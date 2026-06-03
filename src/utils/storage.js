const USERS_KEY = 'writespace_users';
const POSTS_KEY = 'writespace_posts';
const SESSION_KEY = 'writespace_session';

/**
 * Get all users from localStorage.
 * @returns {Array<Object>} Array of user objects, or empty array on failure.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to read users from localStorage:', e);
    return [];
  }
}

/**
 * Save users array to localStorage.
 * @param {Array<Object>} users - Array of user objects to persist.
 */
export function setUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to write users to localStorage:', e);
  }
}

/**
 * Get all posts from localStorage.
 * @returns {Array<Object>} Array of post objects, or empty array on failure.
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to read posts from localStorage:', e);
    return [];
  }
}

/**
 * Save posts array to localStorage.
 * @param {Array<Object>} posts - Array of post objects to persist.
 */
export function setPosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to write posts to localStorage:', e);
  }
}

/**
 * Get the current session from localStorage.
 * @returns {Object|null} Session object, or null if not logged in or on failure.
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (e) {
    console.error('Failed to read session from localStorage:', e);
    return null;
  }
}

/**
 * Save session object to localStorage.
 * @param {Object} session - Session object containing userId, username, displayName, role.
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to write session to localStorage:', e);
  }
}

/**
 * Clear the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session from localStorage:', e);
  }
}