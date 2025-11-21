import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Props = { children: ReactNode };

export function RedirectAuth({ children }: Props) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}
