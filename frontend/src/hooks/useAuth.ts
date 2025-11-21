import { useAuthContext, type AuthContextValue } from '@/contexts/auth';

export type AuthHookResult = AuthContextValue & {
  isLoggedIn: boolean;
  isLoading: boolean;
};

export function useAuth(): AuthHookResult {
  const auth = useAuthContext();

  const isLoggedIn = !!auth.user;
  const isLoading = auth.loading;

  return { ...auth, isLoggedIn, isLoading };
}
