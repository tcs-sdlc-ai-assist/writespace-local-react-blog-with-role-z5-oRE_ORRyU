import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar.jsx';

/**
 * Truncate a string to a given max length, appending ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length before truncation.
 * @returns {string} The truncated string.
 */
function truncate(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Reusable blog post card component.
 * Displays title, excerpt (truncated content), date, author name with avatar,
 * and conditional edit icon based on ownership/role.
 * Links to ReadBlog page.
 * @param {{ post: Object, currentUserId?: string, currentUserRole?: string }} props
 * @returns {JSX.Element}
 */
function BlogCard({ post, currentUserId, currentUserRole }) {
  const canEdit =
    currentUserId &&
    (post.authorId === currentUserId || currentUserRole === 'admin');

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const authorRole = post.authorId === 'u_001' ? 'admin' : 'user';

  return (
    <div className="flex flex-col rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {getAvatar(authorRole)}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {post.authorName}
            </p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>
        {canEdit && (
          <Link
            to={`/blogs/edit/${post.id}`}
            className="shrink-0 rounded-lg bg-primary-50 p-2 text-primary-600 transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={`Edit ${post.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </Link>
        )}
      </div>

      <Link to={`/blogs/${post.id}`} className="flex flex-col flex-1 group">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1">
          {truncate(post.content, 150)}
        </p>
        <span className="mt-4 text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
          Read more →
        </span>
      </Link>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  currentUserId: PropTypes.string,
  currentUserRole: PropTypes.string,
};

BlogCard.defaultProps = {
  currentUserId: null,
  currentUserRole: null,
};

export default BlogCard;