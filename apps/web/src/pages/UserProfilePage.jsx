import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { 
  User, 
  Mail, 
  Calendar, 
  Star, 
  Heart, 
  Settings, 
  CreditCard, 
  LogOut,
  Edit2,
  Shield,
  Clock,
  TrendingUp,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

const UserProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  const fetchUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      const profile = await pb.collection('profiles').getFirstListItem(`userId = "${currentUser.id}"`);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      try {
        const newProfile = await pb.collection('profiles').create({
          userId: currentUser.id,
          name: currentUser.name || currentUser.username,
          email: currentUser.email,
        });
        setUserProfile(newProfile);
      } catch (err) {
        console.error('Error creating profile:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/');
  };

  // Placeholder data for favorites
  const mockFavorites = [
    { id: 1, name: 'Sarah Johnson', service: 'Nail Technician', rating: 4.8, image: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Mike Brown', service: 'Personal Trainer', rating: 4.9, image: 'https://i.pravatar.cc/150?img=3' },
  ];

  const stats = {
    memberSince: currentUser?.created ? new Date(currentUser.created).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' }) : '2024',
    favoriteProviders: 5,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e63946] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header Section */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#e63946] to-red-700 rounded-full flex items-center justify-center text-3xl font-black">
              {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black mb-2">{currentUser?.username || 'User'}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {currentUser?.email}
                </span>
                {currentUser?.verified && (
                  <span className="flex items-center gap-1 text-green-500">
                    <Shield className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/edit-profile')}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <TabButton 
              icon={TrendingUp} 
              label="Overview" 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <TabButton 
              icon={Heart} 
              label="Favorites" 
              active={activeTab === 'favorites'} 
              onClick={() => setActiveTab('favorites')} 
            />
            <TabButton 
              icon={CreditCard} 
              label="Subscription" 
              active={activeTab === 'subscription'} 
              onClick={() => setActiveTab('subscription')} 
            />
            <TabButton 
              icon={Settings} 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid - Only Member Since and Favorites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard 
                icon={Clock} 
                label="Member Since" 
                value={stats.memberSince} 
                color="bg-purple-500/10 text-purple-500" 
              />
              <StatCard 
                icon={Heart} 
                label="Saved Providers" 
                value={stats.favoriteProviders} 
                color="bg-red-500/10 text-red-500" 
              />
            </div>

            {/* Welcome Message */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
              <div className="w-16 h-16 bg-[#e63946]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#e63946]" />
              </div>
              <h2 className="text-2xl font-black mb-2">Welcome to Spicy! </h2>
              <p className="text-gray-400 mb-6">Discover amazing service providers and book your favorite services with ease.</p>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#e63946] hover:bg-[#d62839] rounded-xl font-bold transition-colors"
              >
                Browse Providers
              </button>
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-black mb-6">Saved Providers</h2>
            {mockFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockFavorites.map((favorite) => (
                  <div key={favorite.id} className="border border-zinc-700 rounded-xl p-4 hover:border-[#e63946] transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={favorite.image} alt={favorite.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-bold">{favorite.name}</h3>
                        <p className="text-xs text-gray-400">{favorite.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{favorite.rating}</span>
                      </div>
                      <button className="px-3 py-1 bg-[#e63946] hover:bg-[#d62839] rounded-lg text-xs font-bold transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No favorites yet</p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-[#e63946] hover:bg-[#d62839] rounded-xl font-bold transition-colors"
                >
                  Discover Providers
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTION TAB - INACTIVE FOR NOW */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            {/* Coming Soon Banner */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-yellow-500">Payment System - Coming Soon</h2>
                  <p className="text-gray-400">We're working on integrating the payment system. Check back soon!</p>
                </div>
              </div>
            </div>

            {/* Subscription Card - Inactive */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 opacity-50 pointer-events-none">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold mb-1">Premium Subscription</h3>
                  <p className="text-gray-400 text-sm">Ksh 100 per month</p>
                </div>
                <span className="px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold">
                  INACTIVE
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Next Billing Date</p>
                  <p className="font-bold">--</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                  <p className="font-bold">Not set</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <p className="font-bold text-yellow-500">Pending Activation</p>
                </div>
              </div>

              <button 
                disabled
                className="w-full py-3 bg-zinc-700 text-gray-400 rounded-xl font-bold cursor-not-allowed"
              >
                Payment System - Coming Soon
              </button>
            </div>

            {/* Features List */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h3 className="text-lg font-black mb-4">Premium Features (Coming Soon)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FeatureItem text="Unlimited bookings" />
                <FeatureItem text="Priority customer support" />
                <FeatureItem text="Advanced search filters" />
                <FeatureItem text="Exclusive provider access" />
                <FeatureItem text="Payment history tracking" />
                <FeatureItem text="Auto-renewal options" />
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            {/* Account Settings */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#e63946]" />
                Account Settings
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="w-full flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Edit2 className="w-5 h-5 text-gray-400" />
                    <span>Edit Profile</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <span>Change Password</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#e63946]" />
                Notifications
              </h3>
              <div className="space-y-3">
                <ToggleSetting label="Email notifications" description="Receive booking confirmations via email" />
                <ToggleSetting label="SMS notifications" description="Get text messages for important updates" />
                <ToggleSetting label="Marketing emails" description="Receive promotional offers and updates" />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-zinc-900 rounded-2xl border border-red-900/30 p-6">
              <h3 className="text-lg font-black mb-4 text-red-500 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Danger Zone
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-900/10 border border-red-900/20 rounded-xl">
                  <div>
                    <p className="font-bold text-red-400">Logout</p>
                    <p className="text-xs text-gray-400">Sign out of your account</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-900/10 border border-red-900/20 rounded-xl">
                  <div>
                    <p className="font-bold text-red-400">Delete Account</p>
                    <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
                  </div>
                  <button 
                    onClick={() => toast.error('Account deletion coming soon')}
                    disabled
                    className="px-4 py-2 bg-zinc-700 text-gray-400 rounded-lg font-bold text-sm cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const TabButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${
      active 
        ? 'border-[#e63946] text-[#e63946]' 
        : 'border-transparent text-gray-400 hover:text-white hover:border-zinc-700'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3`}>
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-2xl font-black mb-1">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
    <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center">
      <Lock className="w-3 h-3 text-yellow-500" />
    </div>
    <span className="text-gray-400 text-sm">{text}</span>
  </div>
);

const ToggleSetting = ({ label, description }) => {
  const [enabled, setEnabled] = useState(false);
  
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl">
      <div>
        <p className="font-bold text-sm mb-1">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-[#e63946]' : 'bg-zinc-700'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
};

export default UserProfilePage;