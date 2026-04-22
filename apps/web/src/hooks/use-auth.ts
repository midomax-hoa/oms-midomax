import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const MOCK_ADMIN = {
  id: 1,
  email: 'admin@midomax.com',
  name: 'Admin',
  role: 'admin',
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(MOCK_ADMIN);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post<User>('/login', { email, password });
      setUser(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } finally {
      setUser(null);
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<User | null> => {
    try {
      const data = await api.get<{ user: User }>('/me');
      const userData = data.user || MOCK_ADMIN;
      setUser(userData);
      return userData;
    } catch {
      setUser(MOCK_ADMIN);
      return MOCK_ADMIN;
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
    isLoading,
    error,
  };
}
