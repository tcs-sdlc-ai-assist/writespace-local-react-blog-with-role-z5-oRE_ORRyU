import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';

/**
 * Authenticated blog list page at '/blogs'.
 * Displays all posts from localStorage in a responsive grid sorted newest first.
 * Each post rendered as BlogCard with title, excerpt, date, author avatar, and edit icon based on role/ownership.
 * Shows empty state with Write CTA if no posts exist.
 * Includes a 'Write New Post' button.
 * @returns {JSX.Element}
 */
function Home() {
  const session = getSession();

  const allPosts = getPosts();
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar session={session} />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                All Posts
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Browse the latest stories from our community
              </p>
            </div>
            <Link
              to="/blogs/write"
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Write New Post
            </Link>
          </div>

          {sortedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-16 shadow-md text-center">
              <span className="text-5xl mb-4" role="img" aria-label="No posts">
                📝
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No posts yet
              </h2>
              <p className="text-sm text-gray-600 mb-6 max-w-md">
                Be the first to share your thoughts with the community. Start
                writing and your post will appear here.
              </p>
              <Link
                to="/blogs/write"
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Start Writing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUserId={session ? session.userId : null}
                  currentUserRole={session ? session.role : null}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;