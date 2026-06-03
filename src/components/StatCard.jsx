import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable stat card component for the admin dashboard.
 * Displays a title, value/count, and optional icon with Tailwind styling.
 * @param {{ title: string, value: string | number, icon?: JSX.Element }} props
 * @returns {JSX.Element}
 */
function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 text-2xl shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element,
};

StatCard.defaultProps = {
  icon: null,
};

export default StatCard;