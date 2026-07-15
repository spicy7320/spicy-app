import React from 'react';
import { useActivityTracker } from '../hooks/useActivityTracker.js';

// This component acts as a "bridge" inside the AuthProvider
export const AppLayout = ({ children }) => {
  useActivityTracker();
  return <>{children}</>;
};