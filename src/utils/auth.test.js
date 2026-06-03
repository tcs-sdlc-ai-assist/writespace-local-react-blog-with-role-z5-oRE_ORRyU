import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, register, logout, getSession } from './auth.js';

describe('auth.js', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('returns session for hard-coded admin credentials', () => {
      const result = login('admin', 'admin123');
      expect(result).toEqual({
        userId: 'u_001',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('persists session to localStorage for admin login', () => {
      login('admin', 'admin123');
      const session = getSession();
      expect(session).toEqual({
        userId: 'u_001',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('returns session for a valid localStorage user', () => {
      const mockUsers = [
        {
          id: 'u_100',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-08-15T10:30:00Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const result = login('alice', 'pass1234');
      expect(result).toEqual({
        userId: 'u_100',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
    });

    it('persists session to localStorage for user login', () => {
      const mockUsers = [
        {
          id: 'u_100',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-08-15T10:30:00Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      login('alice', 'pass1234');
      const session = getSession();
      expect(session).toEqual({
        userId: 'u_100',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
    });

    it('returns error for invalid username', () => {
      const result = login('nonexistent', 'password');
      expect(result).toEqual({ error: 'Invalid credentials' });
    });

    it('returns error for invalid password', () => {
      const result = login('admin', 'wrongpassword');
      expect(result).toEqual({ error: 'Invalid credentials' });
    });

    it('returns error for wrong password on localStorage user', () => {
      const mockUsers = [
        {
          id: 'u_100',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-08-15T10:30:00Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const result = login('alice', 'wrongpass');
      expect(result).toEqual({ error: 'Invalid credentials' });
    });

    it('returns error when username is empty', () => {
      const result = login('', 'password');
      expect(result).toEqual({ error: 'Username and password are required' });
    });

    it('returns error when password is empty', () => {
      const result = login('admin', '');
      expect(result).toEqual({ error: 'Username and password are required' });
    });

    it('returns error when both fields are empty', () => {
      const result = login('', '');
      expect(result).toEqual({ error: 'Username and password are required' });
    });

    it('does not persist session on failed login', () => {
      login('nonexistent', 'password');
      const session = getSession();
      expect(session).toBeNull();
    });
  });

  describe('register', () => {
    it('creates a new user and returns session', () => {
      const result = register({
        displayName: 'Bob Jones',
        username: 'bob',
        password: 'bobpass1',
      });

      expect(result).toHaveProperty('userId');
      expect(result.username).toBe('bob');
      expect(result.displayName).toBe('Bob Jones');
      expect(result.role).toBe('user');
      expect(result.error).toBeUndefined();
    });

    it('persists session to localStorage after registration', () => {
      register({
        displayName: 'Bob Jones',
        username: 'bob',
        password: 'bobpass1',
      });

      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.username).toBe('bob');
      expect(session.displayName).toBe('Bob Jones');
      expect(session.role).toBe('user');
    });

    it('persists user to localStorage after registration', () => {
      register({
        displayName: 'Bob Jones',
        username: 'bob',
        password: 'bobpass1',
      });

      const stored = localStorage.getItem('writespace_users');
      const users = JSON.parse(stored);
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('bob');
      expect(users[0].displayName).toBe('Bob Jones');
      expect(users[0].role).toBe('user');
      expect(users[0].password).toBe('bobpass1');
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('createdAt');
    });

    it('returns error when username matches hard-coded admin', () => {
      const result = register({
        displayName: 'Fake Admin',
        username: 'admin',
        password: 'pass1234',
      });

      expect(result).toEqual({ error: 'Username already exists' });
    });

    it('returns error when username already exists in localStorage', () => {
      const mockUsers = [
        {
          id: 'u_100',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-08-15T10:30:00Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const result = register({
        displayName: 'Alice Clone',
        username: 'alice',
        password: 'newpass1',
      });

      expect(result).toEqual({ error: 'Username already exists' });
    });

    it('returns error when displayName is missing', () => {
      const result = register({
        displayName: '',
        username: 'bob',
        password: 'bobpass1',
      });

      expect(result).toEqual({ error: 'Display name, username, and password are required' });
    });

    it('returns error when username is missing', () => {
      const result = register({
        displayName: 'Bob',
        username: '',
        password: 'bobpass1',
      });

      expect(result).toEqual({ error: 'Display name, username, and password are required' });
    });

    it('returns error when password is missing', () => {
      const result = register({
        displayName: 'Bob',
        username: 'bob',
        password: '',
      });

      expect(result).toEqual({ error: 'Display name, username, and password are required' });
    });

    it('returns error when password is too short', () => {
      const result = register({
        displayName: 'Bob',
        username: 'bob',
        password: 'abc',
      });

      expect(result).toEqual({ error: 'Password must be at least 4 characters' });
    });

    it('returns error when userData is null', () => {
      const result = register(null);
      expect(result).toEqual({ error: 'Display name, username, and password are required' });
    });

    it('appends new user to existing users in localStorage', () => {
      const mockUsers = [
        {
          id: 'u_100',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-08-15T10:30:00Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      register({
        displayName: 'Bob Jones',
        username: 'bob',
        password: 'bobpass1',
      });

      const stored = localStorage.getItem('writespace_users');
      const users = JSON.parse(stored);
      expect(users).toHaveLength(2);
      expect(users[0].username).toBe('alice');
      expect(users[1].username).toBe('bob');
    });

    it('generates unique user IDs with u_ prefix', () => {
      const result = register({
        displayName: 'Bob',
        username: 'bob',
        password: 'bobpass1',
      });

      expect(result.userId).toMatch(/^u_/);
    });
  });

  describe('logout', () => {
    it('clears session from localStorage', () => {
      login('admin', 'admin123');
      expect(getSession()).not.toBeNull();

      logout();
      expect(getSession()).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => logout()).not.toThrow();
    });
  });

  describe('getSession', () => {
    it('returns null when no session exists', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns current session after login', () => {
      login('admin', 'admin123');
      const session = getSession();
      expect(session).toEqual({
        userId: 'u_001',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('returns current session after registration', () => {
      register({
        displayName: 'Charlie',
        username: 'charlie',
        password: 'charliepass',
      });

      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.username).toBe('charlie');
      expect(session.displayName).toBe('Charlie');
      expect(session.role).toBe('user');
    });

    it('returns null after logout', () => {
      login('admin', 'admin123');
      logout();
      const session = getSession();
      expect(session).toBeNull();
    });
  });
});