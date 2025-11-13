import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_TOKEN_KEY = 'clinic_inventory_token';
const AUTH_USER_KEY = 'clinic_inventory_user';

type LoginResponse = {
  token: string;
  user: User;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem(AUTH_USER_KEY);
    return cached ? (JSON.parse(cached) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: Boolean(token)
    }),
    [login, logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
