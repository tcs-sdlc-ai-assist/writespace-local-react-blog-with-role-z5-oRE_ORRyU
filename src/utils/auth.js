import { getUsers, setUsers, getSession, setSession, clearSession } from './storage.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_USER = {
  userId: 'u_001',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

/**
 * Generate a unique user ID.
 * @returns {string} A unique ID string prefixed with "u_".
 */
function generateId() {
  return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Attempt to log in with the given credentials.
 * Checks hard-coded admin credentials first, then localStorage users.
 * On success, persists session to localStorage and returns session object.
 * @param {string} username - The username to authenticate.
 * @param {string} password - The password to authenticate.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | { error: string }}
 */
export function login(username, password) {
  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session = { ...ADMIN_USER };
    setSession(session);
    return session;
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const session = {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
    setSession(session);
    return session;
  }

  return { error: 'Invalid credentials' };
}

/**
 * Register a new user account.
 * Enforces username uniqueness across admin and existing users.
 * On success, persists user to localStorage, sets session, and returns session object.
 * @param {{ displayName: string, username: string, password: string }} userData - The user data for registration.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | { error: string }}
 */
export function register(userData) {
  if (!userData || !userData.username || !userData.password || !userData.displayName) {
    return { error: 'Display name, username, and password are required' };
  }

  if (userData.password.length < 4) {
    return { error: 'Password must be at least 4 characters' };
  }

  if (userData.username === ADMIN_USERNAME) {
    return { error: 'Username already exists' };
  }

  const users = getUsers();
  const existing = users.find((u) => u.username === userData.username);

  if (existing) {
    return { error: 'Username already exists' };
  }

  const newUser = {
    id: generateId(),
    displayName: userData.displayName,
    username: userData.username,
    password: userData.password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  setUsers([...users, newUser]);

  const session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };

  setSession(session);
  return session;
}

/**
 * Log out the current user by clearing the session from localStorage.
 */
export function logout() {
  clearSession();
}

export { getSession };