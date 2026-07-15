import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import ProfileCard from '@/components/ProfileCard';
import pb from '@/lib/pocketbaseClient';

const HomePage = () => {
  const location = useLocation();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Show success message from signup redirect
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const records = await pb.collection('users').getList(1, 50, {
          filter: 'verified = true',
          sort: '-created'
        });
        setProviders(records.items);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">🔥 Best Profiles</h1>
        <p className="text-gray-400">Discover amazing service providers near you!</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading profiles...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {providers.map((provider) => (
            <ProfileCard key={provider.id} profile={provider} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;