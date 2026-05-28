import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,   // ← switched from signInWithRedirect
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('fitcoach-user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem('fitcoach-user');
  });

  // Single source of truth — onAuthStateChanged handles everything
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        localStorage.setItem('fitcoach-user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('fitcoach-user');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  // ↑ getRedirectResult useEffect is completely removed — no longer needed

  // GOOGLE LOGIN — popup, instant, no race condition
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // No need to manually setUser here — onAuthStateChanged fires automatically
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        throw new Error(
          'Popup was blocked by your browser. Please allow popups for this site and try again.'
        );
      }
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error(
          'This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains.'
        );
      }
      if (error.code === 'auth/popup-closed-by-user') {
        // User dismissed the popup — not an error, just return silently
        return;
      }
      throw new Error(error.message);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('fitcoach-user');
      localStorage.removeItem('fitcoach-logged-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;