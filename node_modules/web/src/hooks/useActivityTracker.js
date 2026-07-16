import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';

export const useActivityTracker = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.id) return;

    const updateActivity = async () => {
      try {
        await pb.collection('users').update(currentUser.id, {
          lastActive: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to update activity status:", err);
      }
    };

    // Update on load
    updateActivity();

    // Update every 2 minutes
    const interval = setInterval(updateActivity, 120000);
    return () => clearInterval(interval);
  }, [currentUser]);
};