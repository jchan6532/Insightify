import { useAuth } from '../contexts/AuthContext.tsx';

export function useAuthHook() {
  const auth = useAuth();
  const isLoggedIn = !!auth.user;
  return { ...auth, isLoggedIn };
}
