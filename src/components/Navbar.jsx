import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getSession } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

/**
 * Authenticated navigation bar component.
 * Displays WriteSpace logo, navigation links (Blogs, Write, and admin-only Dashboard/Users links),
 * user avatar with display name, and logout button.
 * Adapts links based on user role from session.
 * @param {{ session: { userId: string, username: string, displayName: string, role: string } }} props
 * @returns {JSX.Element}
 */
function Navbar({ session }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = session && session.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-8">
        <Link
          to="/blogs"
          className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
        >
          ✍️ WriteSpace
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/blogs"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Blogs
          </Link>
          <Link
            to="/blogs/write"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Write
          </Link>
          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Users
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {getAvatar(session.role)}
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {session.displayName}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  session: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
  }).isRequired,
};

export default Navbar;