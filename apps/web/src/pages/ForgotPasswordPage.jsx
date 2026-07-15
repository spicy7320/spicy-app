import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send password reset email
      await pb.collection('users').requestPasswordReset(email);
      
      setIsSent(true);
      toast.success('✅ Password reset email sent! Check your inbox. 📧');
      
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error('Failed to send reset email. Please check your email address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        {!isSent ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e63946]/10 rounded-full mb-4">
                <Mail className="w-8 h-8 text-[#e63946]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">
                Forgot Password? 🔐
              </h2>
              <p className="text-gray-400 text-sm">
                No worries! Enter your email and we'll send you a password reset link.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-4 bg-black border border-zinc-700 rounded-xl text-white outline-none focus:border-[#e63946] transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full p-4 bg-[#e63946] hover:bg-[#d62839] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/20"
              >
                {isLoading ? 'Sending... ⏳' : 'Send Reset Link 📧'}
              </button>
            </form>
          </>
        ) : (
          /* Success Message */
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4">
              Check Your Email! ✅
            </h2>
            <p className="text-gray-400 mb-6">
              We've sent a password reset link to:<br />
              <span className="text-[#e63946] font-bold">{email}</span>
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Didn't receive it? Check your spam folder or try again.
            </p>
            <button
              onClick={() => {
                setIsSent(false);
                setEmail('');
              }}
              className="text-[#e63946] hover:underline font-bold text-sm"
            >
              Try Another Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;