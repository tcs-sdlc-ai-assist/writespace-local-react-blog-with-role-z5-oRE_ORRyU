import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts, setPosts } from '../utils/storage.js';

/**
 * Blog create/edit form page.
 * Create mode at '/blogs/write', edit mode at '/blogs/edit/:id'.
 * All authenticated users can create posts.
 * Edit mode loads existing post and enforces ownership (only post owner or admin can edit).
 * Form has title and content fields.
 * On submit, saves to localStorage via setPosts(). Redirects to /blogs on success.
 * @returns {JSX.Element}
 */
function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const posts = getPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
      setError('Post not found');
      return;
    }

    const canEdit =
      session &&
      (post.authorId === session.userId || session.role === 'admin');

    if (!canEdit) {
      navigate('/blogs', { replace: true });
      return;
    }

    setTitle(post.title);
    setContent(post.content);
  }, [id, isEditMode, navigate, session]);

  /**
   * Generate a unique post ID.
   * @returns {string} A unique ID string prefixed with "p_".
   */
  function generatePostId() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);

    try {
      const posts = getPosts();

      if (isEditMode) {
        const postIndex = posts.findIndex((p) => p.id === id);

        if (postIndex === -1) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        const post = posts[postIndex];
        const canEdit =
          session &&
          (post.authorId === session.userId || session.role === 'admin');

        if (!canEdit) {
          setError('You do not have permission to edit this post');
          setLoading(false);
          return;
        }

        const updatedPosts = [...posts];
        updatedPosts[postIndex] = {
          ...post,
          title: title.trim(),
          content: content.trim(),
        };

        setPosts(updatedPosts);
      } else {
        const newPost = {
          id: generatePostId(),
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName,
        };

        setPosts([...posts, newPost]);
      }

      navigate('/blogs', { replace: true });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar session={session} />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl bg-white p-8 shadow-md">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Post' : 'Write New Post'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {isEditMode
                  ? 'Update your post below'
                  : 'Share your thoughts with the community'}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here..."
                  required
                  rows={12}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? isEditMode
                      ? 'Saving…'
                      : 'Publishing…'
                    : isEditMode
                      ? 'Save Changes'
                      : 'Publish Post'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/blogs')}
                  className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WriteBlog;