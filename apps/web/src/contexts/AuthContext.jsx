import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // 🔐 Listen for auth state changes from PocketBase
  useEffect(() => {
    // Set initial user if already logged in
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);

    // Listen for auth changes (login/logout)
    const unsubscribe = pb.authStore.onChange(() => {
      if (pb.authStore.isValid) {
        setCurrentUser(pb.authStore.model);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const signup = async (email, password, passwordConfirm) => {
    const user = await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
    }, { $autoCancel: false });
    
    // Auto-login after signup
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  // ✅ Now derived from state, so it triggers re-renders
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isAuthenticated, initialLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
