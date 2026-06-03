import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';

/**
 * Public landing page component.
 * Displays hero section, features section, latest blog posts preview, and footer.
 * Shows PublicNavbar for guests and Navbar for authenticated users.
 * @returns {JSX.Element}
 */
function LandingPage() {
  const session = getSession();
  const navigate = useNavigate();

  const allPosts = getPosts();
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const features = [
    {
      icon: '✍️',
      title: 'Write Freely',
      description:
        'Express your thoughts and ideas with a clean, distraction-free writing experience.',
    },
    {
      icon: '👥',
      title: 'Community Driven',
      description:
        'Share your stories with a growing community of readers and writers.',
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description:
        'Admins manage the platform while users focus on creating great content.',
    },
  ];

  const handlePostClick = (e) => {
    if (!session) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {session ? <Navbar session={session} /> : <PublicNavbar />}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 md:py-32 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-center max-w-3xl leading-tight">
          Welcome to{' '}
          <span className="text-primary-600">WriteSpace</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 text-center max-w-2xl leading-relaxed">
          Your creative writing space. Share stories, explore ideas, and connect
          with a community of passionate writers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {session ? (
            <>
              <Link
                to="/blogs"
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Browse Blogs
              </Link>
              <Link
                to="/blogs/write"
                className="rounded-lg border border-primary-600 px-6 py-3 text-sm font-medium text-primary-600 transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Start Writing
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-primary-600 px-6 py-3 text-sm font-medium text-primary-600 transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            Why WriteSpace?
          </h2>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
            Everything you need to start writing and sharing your ideas with the
            world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center rounded-xl bg-white p-8 shadow-md transition hover:shadow-lg text-center"
              >
                <span className="text-4xl mb-4" role="img" aria-label={feature.title}>
                  {feature.icon}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="px-6 py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
              Latest Posts
            </h2>
            <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
              Check out what our community has been writing about.
            </p>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              onClick={handlePostClick}
            >
              {latestPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUserId={session ? session.userId : null}
                  currentUserRole={session ? session.role : null}
                />
              ))}
            </div>
            <div className="mt-10 text-center">
              {session ? (
                <Link
                  to="/blogs"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View all posts →
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign in to read more →
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-white">✍️ WriteSpace</p>
            <p className="text-sm text-gray-400 mt-1">
              Your creative writing space.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Home
            </Link>
            <Link
              to={session ? '/blogs' : '/login'}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Blogs
            </Link>
            <Link
              to={session ? '/blogs/write' : '/register'}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              {session ? 'Write' : 'Get Started'}
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;