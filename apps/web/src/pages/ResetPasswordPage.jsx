import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // Extract token from URL on component mount
  useEffect(() => {
    const extractToken = () => {
      // Method 1: Check URL hash
      const hash = window.location.hash;
      if (hash && hash.includes('confirm-password-reset/')) {
        const token = hash.split('confirm-password-reset/')[1];
        if (token) {
          setResetToken(token);
          return;
        }
      }
      
      // Method 2: Check pathname
      const pathname = window.location.pathname;
      if (pathname.includes('confirm-password-reset/')) {
        const token = pathname.split('confirm-password-reset/')[1];
        if (token) {
          setResetToken(token);
          return;
        }
      }
      
      // Method 3: Check query params
      const tokenFromQuery = searchParams.get('token');
      if (tokenFromQuery) {
        setResetToken(tokenFromQuery);
        return;
      }
      
      // Method 4: Check for any long string in URL (JWT token)
      const urlParts = pathname.split('/');
      const possibleToken = urlParts[urlParts.length - 1];
      if (possibleToken && possibleToken.length > 50) {
        setResetToken(possibleToken);
        return;
      }
      
      console.error('No reset token found in URL');
      toast.error('Reset token not found! Please request a new password reset link.');
    };

    extractToken();
  }, [searchParams]);

  // Password validation checks
  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "At least 1 number", valid: /\d/.test(password) },
    { label: "At least 1 lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least 1 uppercase letter", valid: /[A-Z]/.test(password) },
  ];

  const isPasswordStrong = passwordChecks.every(check => check.valid);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      toast.error('Passwords do not match! ‍♂️');
      return;
    }

    if (!isPasswordStrong) {
      toast.error('Please meet all password requirements! 🔒');
      return;
    }

    if (!resetToken) {
      toast.error('Reset token is missing! Please request a new password reset link.');
      return;
    }

    setIsLoading(true);

    try {
      await pb.collection('users').confirmPasswordReset(resetToken, password, passwordConfirm);
      
      toast.success('✅ Password reset successful! You can now login. 🎉');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error('Failed to reset password. The link may be expired or invalid. ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e63946]/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-[#e63946]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">
            Set New Password 🔐
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className={`w-full p-4 pr-12 bg-black border rounded-xl text-white outline-none transition-colors ${
                  password && !isPasswordStrong ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-[#e63946]'
                }`}
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
            
            {password && (
              <div className="mt-3 space-y-1.5 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Password must contain:</p>
                {passwordChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {check.valid ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-red-500" />
                    )}
                    <span className={check.valid ? 'text-green-500' : 'text-gray-500'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full p-4 bg-black border rounded-xl text-white outline-none transition-colors ${
                passwordConfirm && password !== passwordConfirm ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-[#e63946]'
              }`}
              required
            />
            {passwordConfirm && password !== passwordConfirm && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match!</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isPasswordStrong || password !== passwordConfirm}
            className="w-full p-4 bg-[#e63946] hover:bg-[#d62839] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all mt-2 shadow-lg shadow-red-900/20"
          >
            {isLoading ? 'Resetting... ⏳' : 'Reset Password ✅'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Remember your password?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="text-[#e63946] hover:underline font-bold"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;