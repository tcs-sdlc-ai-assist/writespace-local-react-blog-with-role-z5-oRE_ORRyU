import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

vi.mock('../utils/auth.js', () => ({
  getSession: vi.fn(),
}));

import { getSession } from '../utils/auth.js';

function renderWithRouter(initialRoute, element) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/blogs" element={<div>Blogs Page</div>} />
        <Route path="/protected" element={element} />
        <Route path="/admin" element={element} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('unauthenticated access', () => {
    it('redirects to /login when no session exists', () => {
      getSession.mockReturnValue(null);

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to /login when session is null and role is required', () => {
      getSession.mockReturnValue(null);

      renderWithRouter(
        '/admin',
        <ProtectedRoute role="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated access without required role', () => {
    it('redirects to /blogs when user role does not match required role', () => {
      getSession.mockReturnValue({
        userId: 'u_100',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderWithRouter(
        '/admin',
        <ProtectedRoute role="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated access with correct role', () => {
    it('renders children when authenticated and no role is required', () => {
      getSession.mockReturnValue({
        userId: 'u_100',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('renders children when authenticated as admin and admin role is required', () => {
      getSession.mockReturnValue({
        userId: 'u_001',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(
        '/admin',
        <ProtectedRoute role="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('renders children when admin accesses a route with no role requirement', () => {
      getSession.mockReturnValue({
        userId: 'u_001',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('role prop defaults', () => {
    it('does not enforce role check when role prop is not provided', () => {
      getSession.mockReturnValue({
        userId: 'u_100',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>No Role Required</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('No Role Required')).toBeInTheDocument();
    });
  });
});