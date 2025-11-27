import { useAuthContext } from '@/contexts/auth';
import { type AuthHookResult } from '@/types/auth/AuthHookResult.type';

export function useAuth(): AuthHookResult {
  const auth = useAuthContext();

  const isLoggedIn = !!auth.user && !!auth.appUser;
  const isLoading = auth.loading;

  return { ...auth, isLoggedIn, isLoading };
}
