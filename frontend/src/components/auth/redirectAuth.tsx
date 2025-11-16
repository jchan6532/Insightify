import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuthHook } from '@/hooks/useAuthHook';

type Props = { children: ReactNode };

export function RedirectAuth({ children }: Props) {
  const { isLoggedIn, loading } = useAuthHook();

  if (loading) return <div>Loading...</div>;

  if (isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}
