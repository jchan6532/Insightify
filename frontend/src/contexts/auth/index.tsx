import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User as FirebaseUser,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import axios from 'axios';

import { auth, googleProvider } from '@/config/firebase';
import { setAuthToken } from '@/apis';
import { authApi } from '@/apis/auth';

import { type User } from '@/types/user/User.type';
import { type AppUser } from '@/types/user/AppUser.type';
import { type AuthContextValue } from '@/types/contexts/AuthContextvalue.type';
import { useNotification } from '../notification';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotification();
  const [user, setUser] = useState<User>(null);
  const [appUser, setAppUser] = useState<AppUser>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          setUser(null);
          setAuthToken(null);
          setAppUser(null);
          return;
        }

        setUser({
          id: firebaseUser.uid,
          email: String(firebaseUser.email),
          displayName: firebaseUser.displayName ?? '',
          photoURL: firebaseUser.photoURL ?? undefined,
        });

        const token = await firebaseUser.getIdToken();
        setAuthToken(token);

        try {
          const res = await authApi.post('/sync');
          setAppUser(res.data);
        } catch (err) {
          let message = 'Sync failed';
          if (axios.isAxiosError(err)) {
            message =
              err.response?.data?.detail ??
              err.response?.data?.message ??
              err.message;
          } else if (err instanceof Error) {
            message = err.message;
          }
          console.error('Failed to sync user with backend', err);
          setUser(null);
          setAppUser(null);
          notify({
            message: `Login failed: could not sync with server: ${message}`,
            severity: 'error',
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const signUpWithEmailPassword = async (email: string, password: string) => {
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      notify({
        message: `Hello ${appUser?.name}`,
        severity: 'success',
      });
    } catch (err) {
      const message =
        err instanceof FirebaseError
          ? err.message
          : err instanceof Error
          ? err.message
          : String(err);
      console.error('Email sign-up failed', err);
      notify({
        message: `Login failed due to failure to sync with server: ${message}`,
        severity: 'success',
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmailPassword = async (email: string, password: string) => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      notify({
        message: `Welcome back ${appUser?.name}`,
        severity: 'success',
      });
    } catch (err) {
      const message =
        err instanceof FirebaseError
          ? err.message
          : err instanceof Error
          ? err.message
          : String(err);
      console.error('Google sign-in failed', err);
      notify({
        message: `Login failed due to failure to sync with server: ${message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGooglePopup = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      notify({
        message: `Welcome back ${appUser?.name}`,
        severity: 'success',
      });
    } catch (err) {
      console.error('Google sign-in failed', err);
      notify({
        message: `Login failed due to failure to sync with server ${err}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleRedirect = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
      notify({
        message: `Welcome back ${appUser?.name}`,
        severity: 'success',
      });
    } catch (err) {
      const message =
        err instanceof FirebaseError
          ? err.message
          : err instanceof Error
          ? err.message
          : String(err);
      console.error('Google sign-in failed', err);
      notify({
        message: `Login failed due to failure to sync with server ${message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const name = appUser?.name;
    setLoading(true);
    try {
      await signOut(auth);
      notify({
        message: `Good bye ${name}`,
        severity: 'success',
      });
    } catch (err) {
      const message =
        err instanceof FirebaseError
          ? err.message
          : err instanceof Error
          ? err.message
          : String(err);
      console.error('Sign out failed', err);
      notify({
        message: `Sign out failed, please try again: ${message}`,
        severity: 'error',
      });
    } finally {
      setUser(null);
      setAppUser(null);
      setAuthToken(null);
      setLoading(false);
    }
  };

  const getIdToken = async () => {
    const current = auth.currentUser;
    if (!current) return null;
    return current.getIdToken();
  };

  const value = useMemo(
    () => ({
      user,
      appUser,
      loading,
      signUpWithEmailPassword,
      loginWithEmailPassword,
      loginWithGooglePopup,
      loginWithGoogleRedirect,
      logout,
      getIdToken,
    }),
    [user, appUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
