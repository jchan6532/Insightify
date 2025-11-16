import { Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuthHook } from '@/hooks/useAuthHook';

type Props = { children: ReactNode };

export function Protected({ children }: Props) {
  const { isLoggedIn, loading } = useAuthHook();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
