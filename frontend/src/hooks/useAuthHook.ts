import { useAuth, type AuthContextValue } from '@/contexts/AuthContext';

export type AuthHookResult = AuthContextValue & {
  isLoggedIn: boolean;
  isLoading: boolean;
};

export function useAuthHook(): AuthHookResult {
  const auth = useAuth();

  const isLoggedIn = !!auth.user;
  const isLoading = auth.loading;

  return { ...auth, isLoggedIn, isLoading };
}
