import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Delete account states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await pb.collection('users').update(currentUser.id, {
        username,
        email,
      });

      toast.success('Profile updated successfully! ✅');
      navigate('/profile');
    } catch (err) {
      console.error('Update error:', err);
      
      if (err.response?.data?.username) {
        toast.error('Username is already taken! 🚫');
      } else if (err.response?.data?.email) {
        toast.error('Email is already registered! 📧');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm deletion.');
      return;
    }

    setIsLoading(true);

    try {
      // First verify password
      await pb.collection('users').authWithPassword(email, deletePassword);
      
      // Delete the user account
      await pb.collection('users').delete(currentUser.id);
      
      toast.success('Account deleted successfully. We\'re sorry to see you go! 👋');
      
      // Clear auth and redirect
      pb.authStore.clear();
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Incorrect password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-black uppercase">Edit Profile</h1>
          <p className="text-gray-400 mt-2">Manage your account settings</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        
        {/* Profile Information */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#e63946]" />
            Profile Information
          </h2>
          
          <form onSubmit={handleSaveChanges} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 bg-black border border-zinc-700 rounded-xl text-white outline-none focus:border-[#e63946] transition-colors"
                placeholder="Enter your username"
                required
              />
              <p className="text-xs text-gray-500 mt-1">This is your unique identifier on Spicy</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-black border border-zinc-700 rounded-xl text-white outline-none focus:border-[#e63946] transition-colors"
                placeholder="Enter your email"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Used for login and notifications</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#e63946] hover:bg-[#d62839] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/20"
            >
              {isLoading ? 'Saving... ⏳' : 'Save Changes 💾'}
            </button>
          </form>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="bg-zinc-900 rounded-2xl border border-red-900/30 p-6">
          <h2 className="text-xl font-black mb-4 text-red-500 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full p-4 bg-red-900/20 hover:bg-red-900/30 border border-red-900/50 text-red-400 font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Delete My Account 🗑️
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4">
                <p className="text-red-400 font-bold mb-2">⚠️ Confirm Account Deletion</p>
                <p className="text-sm text-gray-400 mb-4">
                  This action cannot be undone. This will permanently delete your account, 
                  saved providers, and all associated data.
                </p>
                
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Enter Your Password to Confirm
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full p-4 pr-12 bg-black border border-red-900/50 rounded-xl text-white outline-none focus:border-red-600 transition-colors"
                      placeholder="Your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading || !deletePassword}
                    className="flex-1 p-4 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    {isLoading ? 'Deleting... ⏳' : 'Yes, Delete My Account'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword('');
                    }}
                    className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;