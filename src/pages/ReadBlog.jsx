import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts, setPosts } from '../utils/storage.js';

/**
 * Full blog post reader page at '/blogs/:id'.
 * Displays complete post with title, content, author name/avatar, and date.
 * Shows edit and delete buttons only for post owner or admin.
 * Delete confirms before removing post from localStorage.
 * Edit navigates to /blogs/edit/:id. Back button returns to /blogs.
 * @returns {JSX.Element}
 */
function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);

    if (!found) {
      setNotFound(true);
      return;
    }

    setPost(found);
  }, [id]);

  const handleDelete = () => {
    if (!post) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const posts = getPosts();
      const updatedPosts = posts.filter((p) => p.id !== post.id);
      setPosts(updatedPosts);
      navigate('/blogs', { replace: true });
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar session={session} />
        <main className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-16 shadow-md text-center">
            <span className="text-5xl mb-4" role="img" aria-label="Not found">
              🔍
            </span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Post Not Found
            </h2>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              The post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Back to Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar session={session} />
        <main className="flex-1 flex items-center justify-center px-6 py-10">
          <p className="text-sm text-gray-600">Loading…</p>
        </main>
      </div>
    );
  }

  const canEdit =
    session &&
    (post.authorId === session.userId || session.role === 'admin');

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const authorRole = post.authorId === 'u_001' ? 'admin' : 'user';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar session={session} />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              ← Back to Blogs
            </Link>
          </div>

          <article className="rounded-xl bg-white p-8 shadow-md">
            <div className="flex items-center justify-between gap-4 mb-6">
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
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/blogs/edit/${post.id}`}
                    className="rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

export default ReadBlog;