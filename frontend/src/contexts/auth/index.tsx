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

type User = {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
} | null;

export type AuthContextValue = {
  user: User;
  loading: boolean;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithGooglePopup: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser({
          id: firebaseUser.uid,
          email: String(firebaseUser.email),
          displayName: firebaseUser.displayName ?? '',
          photoURL: firebaseUser.photoURL ?? undefined,
        });

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signUpWithEmailPassword = async (email: string, password: string) => {
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Google sign-in failed', err);
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
      loading,
      signUpWithEmailPassword,
      loginWithEmailPassword,
      loginWithGooglePopup,
      loginWithGoogleRedirect,
      logout,
      getIdToken,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
