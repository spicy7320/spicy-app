import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  CreditCard, 
  MessageCircle, 
  Shield, 
  LogOut, 
  Trash2, 
  HelpCircle, 
  Bell, 
  Lock, 
  Eye,
  EyeOff,
  ChevronRight,
  Star,
  ThumbsUp
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleLogout = () => {
    pb.authStore.clear();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== 'DELETE') return;
    
    try {
      const user = pb.authStore.model;
      if (user) {
        await pb.collection('users').delete(user.id);
        pb.authStore.clear();
        navigate('/');
      }
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  const handleChangePassword = async () => {
    // TODO: Implement password change
    alert('Password change feature coming soon!');
    setShowPasswordChange(false);
  };

  const handleContactSupport = () => {
    navigate('/support');
  };

  const handleRatingSubmit = () => {
    // TODO: Submit rating to backend
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-8">My Settings</h1>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" /> Account Settings
            </h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/profile?edit=true')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition border border-zinc-700 hover:border-zinc-600"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-zinc-400" />
                  <div className="text-left">
                    <p className="font-semibold text-white">Edit Profile</p>
                    <p className="text-sm text-zinc-400">Update your personal information</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>

              <button 
                onClick={() => navigate('/subscription')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition border border-zinc-700 hover:border-zinc-600"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-zinc-400" />
                  <div className="text-left">
                    <p className="font-semibold text-white">Subscription</p>
                    <p className="text-sm text-zinc-400">Manage your subscription plan</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" /> Security
            </h2>
            
            <div className="space-y-4">
              {/* Change Password - Expandable */}
              <div className="rounded-xl bg-zinc-800/50 border border-zinc-700 overflow-hidden">
                <button 
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-zinc-400" />
                    <div className="text-left">
                      <p className="font-semibold text-white">Change Password</p>
                      <p className="text-sm text-zinc-400">Update your password</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-zinc-500 transition-transform ${showPasswordChange ? 'rotate-90' : ''}`} />
                </button>

                {showPasswordChange && (
                  <div className="p-4 border-t border-zinc-700 space-y-3">
                    <div className="relative">
                      <Input 
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current Password"
                        className="bg-zinc-800 border-zinc-700 text-white pr-10"
                      />
                      <button 
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input 
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="bg-zinc-800 border-zinc-700 text-white pr-10"
                      />
                      <button 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button 
                      onClick={handleChangePassword}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      Update Password
                    </Button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate('/verify')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition border border-zinc-700 hover:border-zinc-600"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-zinc-400" />
                  <div className="text-left">
                    <p className="font-semibold text-white">Photo Verification</p>
                    <p className="text-sm text-zinc-400">Verify your identity</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600" /> Notifications
            </h2>
            
            <div className="space-y-3">
              {['Email Notifications', 'Push Notifications', 'SMS Alerts'].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                  <span className="font-medium text-white">{setting}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={idx === 0} />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Your Experience */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-red-600" /> Rate Your Experience
            </h2>
            
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
              {!feedbackSubmitted ? (
                <>
                  <p className="text-zinc-300 mb-4">How would you rate your experience with Spicy?</p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-10 h-10 ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <div className="text-center">
                      <p className="text-zinc-400 mb-3">
                        {rating === 5 && "🎉 Excellent! We're thrilled you love Spicy!"}
                        {rating === 4 && "😊 Great! Thanks for your feedback!"}
                        {rating === 3 && "👍 Good! We're working to improve."}
                        {rating === 2 && "😕 Fair. How can we do better?"}
                        {rating === 1 && "😞 Poor. We'd love to hear how to improve!"}
                      </p>
                      <Button 
                        onClick={handleRatingSubmit}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" /> Submit Rating
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-white font-semibold">Thank you for your feedback!</p>
                  <p className="text-sm text-zinc-400">We appreciate your rating.</p>
                </div>
              )}
            </div>
          </div>

          {/* Support */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-red-600" /> Support
            </h2>
            
            <div className="space-y-4">
              <button 
                onClick={handleContactSupport}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition border border-zinc-700 hover:border-zinc-600"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-zinc-400" />
                  <div className="text-left">
                    <p className="font-semibold text-white">Spicy Support Team</p>
                    <p className="text-sm text-zinc-400">Get help from our team</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>

              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <h3 className="font-semibold text-white mb-2">Need Help?</h3>
                <p className="text-sm text-zinc-400 mb-3">Our support team is available 24/7 to assist you</p>
                <div className="text-sm text-zinc-300">
                  <p>📧 Email: support@spicy.com</p>
                  <p>📱 Phone: +254 712 345 678</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6">Account Actions</h2>
            
            <div className="space-y-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition border border-zinc-700 hover:border-zinc-600"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-zinc-400" />
                  <div className="text-left">
                    <p className="font-semibold text-white">Log Out</p>
                    <p className="text-sm text-zinc-400">Sign out of your account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>

              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-red-600/10 transition border border-zinc-700 hover:border-red-700 group"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
                    <div className="text-left">
                      <p className="font-semibold text-white group-hover:text-red-400 transition-colors">Delete Account</p>
                      <p className="text-sm text-zinc-400">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700">
                  <p className="text-zinc-300 font-semibold mb-3">Type <span className="font-bold text-white">DELETE</span> to confirm</p>
                  <Input 
                    value={deleteText}
                    onChange={(e) => setDeleteText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="bg-zinc-800 border-zinc-700 text-white mb-3"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleDeleteAccount}
                      disabled={deleteText !== 'DELETE'}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50"
                    >
                      Confirm Delete
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteText('');
                      }}
                      variant="outline"
                      className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              ← Back to Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;