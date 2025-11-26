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

import { auth, googleProvider } from '@/config/firebase';
import { setAuthToken } from '@/apis';
import { authApi } from '@/apis/auth';

import { type User } from '@/types/user/User.type';
import { type AppUser } from '@/types/user/AppUser.type';
import { type AuthContextValue } from '@/types/contexts/AuthContextvalue.type';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
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
          console.error('Failed to sync user with backend', err);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const signUpWithEmailPassword = async (email: string, password: string) => {
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Email sign-up failed', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmailPassword = async (email: string, password: string) => {
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Google sign-in failed', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGooglePopup = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign-in failed', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleRedirect = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error('Google sign-in failed', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out failed', err);
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
