import { type AuthContextValue } from '../contexts/AuthContextvalue.type';

export type AuthHookResult = AuthContextValue & {
  isLoggedIn: boolean;
  isLoading: boolean;
};
