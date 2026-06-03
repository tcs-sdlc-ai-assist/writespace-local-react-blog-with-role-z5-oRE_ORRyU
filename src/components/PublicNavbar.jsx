import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Public/guest navigation bar displayed on public pages when user is not authenticated.
 * Shows WriteSpace logo/name, Login button, and Get Started button linking to /register.
 * @returns {JSX.Element}
 */
function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <Link
        to="/"
        className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
      >
        ✍️ WriteSpace
      </Link>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="rounded-lg px-4 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default PublicNavbar;