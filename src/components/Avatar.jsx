import React from 'react';
import PropTypes from 'prop-types';

/**
 * Returns a static JSX avatar element based on the user's role.
 * @param {'admin' | 'user'} role - The role of the user.
 * @returns {JSX.Element} A styled avatar element with role-appropriate emoji and background.
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-200 text-violet-800 text-sm font-semibold select-none"
        role="img"
        aria-label="Admin avatar"
      >
        👑
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 text-sm font-semibold select-none"
      role="img"
      aria-label="User avatar"
    >
      📖
    </span>
  );
}

/**
 * Avatar React component that renders a role-based avatar.
 * @param {{ role: 'admin' | 'user' }} props
 * @returns {JSX.Element}
 */
function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

export default Avatar;