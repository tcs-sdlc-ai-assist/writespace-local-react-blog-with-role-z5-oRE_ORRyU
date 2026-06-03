import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth.js';

/**
 * Route guard component for protected routes.
 * Checks localStorage session via getSession().
 * Redirects unauthenticated users to /login.
 * If role prop is provided, redirects users without that role to /blogs.
 * Renders children if authorized.
 * @param {{ children: React.ReactNode, role?: string }} props
 * @returns {JSX.Element}
 */
function ProtectedRoute({ children, role }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role && session.role !== role) {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  role: null,
};

export default ProtectedRoute;