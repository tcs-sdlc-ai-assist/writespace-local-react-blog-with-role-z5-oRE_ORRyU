import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts, setPosts, getUsers } from '../utils/storage.js';

/**
 * Admin-only dashboard page at '/admin/dashboard'.
 * Displays stat cards (total posts, total users, admin count, user count) using StatCard component.
 * Shows quick-action buttons for writing new post and managing users.
 * Recent posts section shows 5 most recent posts with edit/delete controls.
 * Non-admins are redirected via ProtectedRoute wrapper in App.jsx.
 * @returns {JSX.Element}
 */
function AdminDashboard() {
  const session = getSession();
  const navigate = useNavigate();

  const allPosts = getPosts();
  const allUsers = getUsers();

  const totalPosts = allPosts.length;
  const totalUsers = allUsers.length + 1; // +1 for hard-coded admin
  const adminCount = allUsers.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = allUsers.filter((u) => u.role === 'user').length;

  const recentPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleDelete = (postId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const posts = getPosts();
      const updatedPosts = posts.filter((p) => p.id !== postId);
      setPosts(updatedPosts);
      navigate(0);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar session={session} />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Overview of your WriteSpace platform
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Posts"
              value={totalPosts}
              icon={<span role="img" aria-label="Posts">📝</span>}
            />
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={<span role="img" aria-label="Users">👥</span>}
            />
            <StatCard
              title="Admins"
              value={adminCount}
              icon={<span role="img" aria-label="Admins">👑</span>}
            />
            <StatCard
              title="Users"
              value={userCount}
              icon={<span role="img" aria-label="Regular users">📖</span>}
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/blogs/write"
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Write New Post
              </Link>
              <Link
                to="/admin/users"
                className="rounded-lg border border-primary-600 px-5 py-2.5 text-sm font-medium text-primary-600 transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Posts
              </h2>
              <Link
                to="/blogs"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View all →
              </Link>
            </div>

            {recentPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-md text-center">
                <span className="text-5xl mb-4" role="img" aria-label="No posts">
                  📝
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md">
                  Get started by creating the first post on the platform.
                </p>
                <Link
                  to="/blogs/write"
                  className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Start Writing
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => {
                  const formattedDate = post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—';

                  const authorRole = post.authorId === 'u_001' ? 'admin' : 'user';

                  return (
                    <div
                      key={post.id}
                      className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {getAvatar(authorRole)}
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/blogs/${post.id}`}
                            className="text-sm font-semibold text-gray-900 truncate block hover:text-primary-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-gray-500 truncate">
                            by {post.authorName} · {formattedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/blogs/edit/${post.id}`}
                          className="rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600 transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;