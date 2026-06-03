import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import UserRow from '../components/UserRow.jsx';
import { getSession } from '../utils/auth.js';
import { getUsers, setUsers } from '../utils/storage.js';

/**
 * Admin-only user management page at '/admin/users'.
 * Displays all users (including hard-coded admin) using UserRow component.
 * Provides a create user form with displayName, username, password, and role fields.
 * Delete action confirms before removing user from localStorage.
 * Hard-coded admin and currently logged-in user cannot be deleted.
 * @returns {JSX.Element}
 */
function UserManagement() {
  const session = getSession();
  const navigate = useNavigate();

  const [users, setUsersState] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_USER = {
    id: 'u_001',
    displayName: 'Admin',
    username: 'admin',
    role: 'admin',
    createdAt: '2024-06-01T12:00:00Z',
  };

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    const storedUsers = getUsers();
    setUsersState(storedUsers);
  }

  /**
   * Generate a unique user ID.
   * @returns {string} A unique ID string prefixed with "u_".
   */
  function generateUserId() {
    return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
  }

  const allUsers = [ADMIN_USER, ...users];

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    if (username.trim() === 'admin') {
      setError('Username already exists');
      return;
    }

    const storedUsers = getUsers();
    const existing = storedUsers.find((u) => u.username === username.trim());

    if (existing) {
      setError('Username already exists');
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        id: generateUserId(),
        displayName: displayName.trim(),
        username: username.trim(),
        password,
        role,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...storedUsers, newUser];
      setUsers(updatedUsers);
      setUsersState(updatedUsers);

      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccess(`User "${newUser.displayName}" created successfully`);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const storedUsers = getUsers();
      const updatedUsers = storedUsers.filter((u) => u.id !== userId);
      setUsers(updatedUsers);
      setUsersState(updatedUsers);
      setSuccess('User deleted successfully');
      setError('');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar session={session} />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage platform users
            </p>
          </div>

          {/* Create User Form */}
          <div className="rounded-xl bg-white p-8 shadow-md mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Create New User
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>

          {/* Users List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                All Users ({allUsers.length})
              </h2>
            </div>

            {allUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-md text-center">
                <span className="text-5xl mb-4" role="img" aria-label="No users">
                  👥
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Create a new user using the form above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    currentUserId={session ? session.userId : ''}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserManagement;