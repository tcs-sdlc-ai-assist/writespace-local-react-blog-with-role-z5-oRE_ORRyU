import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home.jsx';

vi.mock('../utils/auth.js', () => ({
  getSession: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('../utils/storage.js', () => ({
  getPosts: vi.fn(),
  getUsers: vi.fn(() => []),
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

import { getSession } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';

const mockSession = {
  userId: 'u_100',
  username: 'alice',
  displayName: 'Alice',
  role: 'user',
};

const mockAdminSession = {
  userId: 'u_001',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

function renderHome(session = mockSession) {
  getSession.mockReturnValue(session);
  return render(
    <MemoryRouter initialEntries={['/blogs']}>
      <Home />
    </MemoryRouter>
  );
}

describe('Home', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getSession.mockReturnValue(mockSession);
    getPosts.mockReturnValue([]);
  });

  describe('empty state', () => {
    it('displays empty state message when no posts exist', () => {
      getPosts.mockReturnValue([]);
      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Be the first to share your thoughts with the community. Start writing and your post will appear here.'
        )
      ).toBeInTheDocument();
    });

    it('displays a Start Writing link in empty state', () => {
      getPosts.mockReturnValue([]);
      renderHome();

      const startWritingLink = screen.getByRole('link', { name: 'Start Writing' });
      expect(startWritingLink).toBeInTheDocument();
      expect(startWritingLink).toHaveAttribute('href', '/blogs/write');
    });
  });

  describe('rendering blog cards', () => {
    const mockPosts = [
      {
        id: 'p_001',
        title: 'First Post',
        content: 'Content of the first post which is long enough to display properly.',
        createdAt: '2024-06-01T12:00:00Z',
        authorId: 'u_001',
        authorName: 'Admin',
      },
      {
        id: 'p_002',
        title: 'Second Post',
        content: 'Content of the second post with some interesting text.',
        createdAt: '2024-07-15T10:00:00Z',
        authorId: 'u_100',
        authorName: 'Alice',
      },
      {
        id: 'p_003',
        title: 'Third Post',
        content: 'Content of the third post, the newest one.',
        createdAt: '2024-08-20T08:00:00Z',
        authorId: 'u_200',
        authorName: 'Bob',
      },
    ];

    it('renders blog cards for each post', () => {
      getPosts.mockReturnValue(mockPosts);
      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
    });

    it('does not display empty state when posts exist', () => {
      getPosts.mockReturnValue(mockPosts);
      renderHome();

      expect(screen.queryByText('No posts yet')).not.toBeInTheDocument();
    });

    it('renders posts sorted newest first', () => {
      getPosts.mockReturnValue(mockPosts);
      renderHome();

      const postTitles = screen.getAllByRole('heading', { level: 3 });
      expect(postTitles[0]).toHaveTextContent('Third Post');
      expect(postTitles[1]).toHaveTextContent('Second Post');
      expect(postTitles[2]).toHaveTextContent('First Post');
    });

    it('renders author names on blog cards', () => {
      getPosts.mockReturnValue(mockPosts);
      renderHome();

      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  describe('Write New Post button', () => {
    it('displays Write New Post button', () => {
      getPosts.mockReturnValue([]);
      renderHome();

      const writeButton = screen.getByRole('link', { name: 'Write New Post' });
      expect(writeButton).toBeInTheDocument();
      expect(writeButton).toHaveAttribute('href', '/blogs/write');
    });

    it('displays Write New Post button when posts exist', () => {
      getPosts.mockReturnValue([
        {
          id: 'p_001',
          title: 'A Post',
          content: 'Some content here.',
          createdAt: '2024-06-01T12:00:00Z',
          authorId: 'u_001',
          authorName: 'Admin',
        },
      ]);
      renderHome();

      const writeButton = screen.getByRole('link', { name: 'Write New Post' });
      expect(writeButton).toBeInTheDocument();
    });
  });

  describe('page header', () => {
    it('displays the All Posts heading', () => {
      getPosts.mockReturnValue([]);
      renderHome();

      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('displays the subtitle text', () => {
      getPosts.mockReturnValue([]);
      renderHome();

      expect(
        screen.getByText('Browse the latest stories from our community')
      ).toBeInTheDocument();
    });
  });

  describe('edit controls based on ownership', () => {
    it('shows edit icon for posts owned by current user', () => {
      getPosts.mockReturnValue([
        {
          id: 'p_002',
          title: 'My Post',
          content: 'Content of my post.',
          createdAt: '2024-07-15T10:00:00Z',
          authorId: 'u_100',
          authorName: 'Alice',
        },
      ]);
      renderHome();

      const editLink = screen.getByRole('link', { name: 'Edit My Post' });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', '/blogs/edit/p_002');
    });

    it('does not show edit icon for posts not owned by current user', () => {
      getPosts.mockReturnValue([
        {
          id: 'p_001',
          title: 'Other Post',
          content: 'Content of other post.',
          createdAt: '2024-06-01T12:00:00Z',
          authorId: 'u_200',
          authorName: 'Bob',
        },
      ]);
      renderHome();

      expect(screen.queryByRole('link', { name: 'Edit Other Post' })).not.toBeInTheDocument();
    });

    it('shows edit icon for all posts when user is admin', () => {
      getPosts.mockReturnValue([
        {
          id: 'p_002',
          title: 'User Post',
          content: 'Content of user post.',
          createdAt: '2024-07-15T10:00:00Z',
          authorId: 'u_200',
          authorName: 'Bob',
        },
      ]);
      renderHome(mockAdminSession);

      const editLink = screen.getByRole('link', { name: 'Edit User Post' });
      expect(editLink).toBeInTheDocument();
    });
  });
});