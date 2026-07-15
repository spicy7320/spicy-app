import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'admins') {
      setCurrentAdmin(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('admins').authWithPassword(email, password, { $autoCancel: false });
    setCurrentAdmin(authData.record);
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentAdmin(null);
  };

  const isAdminAuthenticated = pb.authStore.isValid && pb.authStore.model?.collectionName === 'admins';

  return (
    <AdminAuthContext.Provider value={{ currentAdmin, login, logout, isAdminAuthenticated, initialLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};