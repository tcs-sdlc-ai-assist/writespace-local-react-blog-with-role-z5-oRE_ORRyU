import React from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar.jsx';

/**
 * User table row/card component for admin user management.
 * Displays user info (displayName, username, role, createdAt) with avatar,
 * role badge pill, and delete button.
 * Delete button is hidden for hard-coded admin and currently logged-in user.
 * @param {{ user: Object, currentUserId: string, onDelete: function }} props
 * @returns {JSX.Element}
 */
function UserRow({ user, currentUserId, onDelete }) {
  const isAdmin = user.role === 'admin';
  const isCurrentUser = user.id === currentUserId;
  const canDelete = !isAdmin && !isCurrentUser;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg">
      <div className="flex items-center gap-4 min-w-0">
        {getAvatar(user.role)}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.displayName}
            </p>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                isAdmin
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {user.role}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
          <p className="text-xs text-gray-400 mt-0.5">Joined {formattedDate}</p>
        </div>
      </div>
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(user.id)}
          className="shrink-0 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete
        </button>
      )}
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;