import { type User } from '../user/User.type';
import { type AppUser } from '../user/AppUser.type';

export type AuthContextValue = {
  user: User;
  appUser: AppUser;
  loading: boolean;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithGooglePopup: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};
