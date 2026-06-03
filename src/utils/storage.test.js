import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUsers,
  setUsers,
  getPosts,
  setPosts,
  getSession,
  setSession,
  clearSession,
} from './storage.js';

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getUsers', () => {
    it('returns an empty array when no users are stored', () => {
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      const mockUsers = [
        { id: 'u_001', displayName: 'Alice', username: 'alice', role: 'user' },
        { id: 'u_002', displayName: 'Bob', username: 'bob', role: 'admin' },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toEqual(mockUsers);
      expect(users).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', '{not valid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const users = getUsers();
      expect(users).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('reads from the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getUsers();
      expect(spy).toHaveBeenCalledWith('writespace_users');
    });
  });

  describe('setUsers', () => {
    it('saves users array to localStorage as JSON', () => {
      const mockUsers = [
        { id: 'u_001', displayName: 'Alice', username: 'alice', role: 'user' },
      ];
      setUsers(mockUsers);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).toBe(JSON.stringify(mockUsers));
    });

    it('writes to the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      setUsers([]);
      expect(spy).toHaveBeenCalledWith('writespace_users', '[]');
    });

    it('handles localStorage setItem failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => setUsers([{ id: 'u_001' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts are stored', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const mockPosts = [
        {
          id: 'p_001',
          title: 'Test Post',
          content: 'Hello world',
          createdAt: '2024-06-01T12:00:00Z',
          authorId: 'u_001',
          authorName: 'Admin',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
      expect(posts).toHaveLength(1);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', 'corrupted data');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const posts = getPosts();
      expect(posts).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('reads from the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getPosts();
      expect(spy).toHaveBeenCalledWith('writespace_posts');
    });
  });

  describe('setPosts', () => {
    it('saves posts array to localStorage as JSON', () => {
      const mockPosts = [
        {
          id: 'p_001',
          title: 'Test Post',
          content: 'Content here',
          createdAt: '2024-06-01T12:00:00Z',
          authorId: 'u_001',
          authorName: 'Admin',
        },
      ];
      setPosts(mockPosts);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).toBe(JSON.stringify(mockPosts));
    });

    it('writes to the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      setPosts([]);
      expect(spy).toHaveBeenCalledWith('writespace_posts', '[]');
    });

    it('handles localStorage setItem failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => setPosts([{ id: 'p_001' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('getSession', () => {
    it('returns null when no session is stored', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const mockSession = {
        userId: 'u_001',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
    });

    it('returns null when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_session', '{{broken');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const session = getSession();
      expect(session).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('reads from the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getSession();
      expect(spy).toHaveBeenCalledWith('writespace_session');
    });
  });

  describe('setSession', () => {
    it('saves session object to localStorage as JSON', () => {
      const mockSession = {
        userId: 'u_002',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      setSession(mockSession);

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBe(JSON.stringify(mockSession));
    });

    it('writes to the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      const mockSession = {
        userId: 'u_001',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      setSession(mockSession);
      expect(spy).toHaveBeenCalledWith(
        'writespace_session',
        JSON.stringify(mockSession)
      );
    });

    it('handles localStorage setItem failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() =>
        setSession({ userId: 'u_001', username: 'admin', displayName: 'Admin', role: 'admin' })
      ).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const mockSession = {
        userId: 'u_001',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('removes from the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'removeItem');
      clearSession();
      expect(spy).toHaveBeenCalledWith('writespace_session');
    });

    it('handles localStorage removeItem failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => clearSession()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('round-trip serialization', () => {
    it('preserves users data through set and get cycle', () => {
      const mockUsers = [
        {
          id: 'u_100',
          displayName: 'Test User',
          username: 'testuser',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-08-15T10:30:00Z',
        },
      ];
      setUsers(mockUsers);
      const result = getUsers();
      expect(result).toEqual(mockUsers);
    });

    it('preserves posts data through set and get cycle', () => {
      const mockPosts = [
        {
          id: 'p_100',
          title: 'Round Trip Post',
          content: 'Testing serialization',
          createdAt: '2024-08-15T10:30:00Z',
          authorId: 'u_100',
          authorName: 'Test User',
        },
      ];
      setPosts(mockPosts);
      const result = getPosts();
      expect(result).toEqual(mockPosts);
    });

    it('preserves session data through set and get cycle', () => {
      const mockSession = {
        userId: 'u_100',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      setSession(mockSession);
      const result = getSession();
      expect(result).toEqual(mockSession);
    });
  });
});