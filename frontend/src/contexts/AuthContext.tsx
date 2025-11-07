import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type User = { id: string; email: string } | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  login: (email?: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  // mock rehydrate (swap with Firebase/JWT later)
  useEffect(() => {
    const raw = localStorage.getItem('demo_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (email = 'demo@insightify.dev') => {
    setLoading(true);
    // simulate auth delay
    await new Promise((r) => setTimeout(r, 400));
    const u = { id: 'demo-user-1', email };
    localStorage.setItem('demo_user', JSON.stringify(u));
    setUser(u);
    setLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('demo_user');
    setUser(null);
  };

  const getIdToken = async () => {
    // replace with Firebase getIdToken() or your JWT later
    return user ? 'mock-id-token.demo' : null;
  };

  const value = useMemo(
    () => ({ user, loading, login, logout, getIdToken }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
