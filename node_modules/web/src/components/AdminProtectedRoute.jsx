import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, initialLoading } = useAdminAuth();

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;