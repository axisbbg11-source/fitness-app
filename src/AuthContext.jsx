import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';

import { auth, googleProvider } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // AUTH STATE LISTENER
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

        localStorage.setItem(
          'fitcoach-user',
          JSON.stringify(userData)
        );
      } else {
        setUser(null);
        localStorage.removeItem('fitcoach-user');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // HANDLE REDIRECT RESULT
  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result?.user) {
          const userData = {
            uid: result.user.uid,
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          };

          setUser(userData);

          localStorage.setItem(
            'fitcoach-user',
            JSON.stringify(userData)
          );
        }
      } catch (error) {
        console.error('Redirect login error:', error);
      }
    };

    fetchRedirectResult();
  }, []);

  // GOOGLE LOGIN
  const loginWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error(
          'This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains'
        );
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}

export default AuthContext;