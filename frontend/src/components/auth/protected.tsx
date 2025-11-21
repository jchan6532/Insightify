import { Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

type Props = { children: ReactNode };

export function Protected({ children }: Props) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
