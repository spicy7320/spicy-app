import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, Mail } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    passwordConfirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // ️ NEW STATE: To track if registration was successful
  const [isSuccess, setIsSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordTimerRef = useRef(null);
  const confirmTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(passwordTimerRef.current);
      clearTimeout(confirmTimerRef.current);
    };
  }, []);

  const togglePasswordVisibility = () => {
    if (showPassword) {
      setShowPassword(false);
      clearTimeout(passwordTimerRef.current);
    } else {
      setShowPassword(true);
      clearTimeout(passwordTimerRef.current);
      passwordTimerRef.current = setTimeout(() => setShowPassword(false), 20000);
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    if (showConfirmPassword) {
      setShowConfirmPassword(false);
      clearTimeout(confirmTimerRef.current);
    } else {
      setShowConfirmPassword(true);
      clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = setTimeout(() => setShowConfirmPassword(false), 20000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordChecks = [
    { label: "At least 8 characters", valid: formData.password.length >= 8 },
    { label: "At least 1 number", valid: /\d/.test(formData.password) },
    { label: "At least 1 lowercase letter", valid: /[a-z]/.test(formData.password) },
    { label: "At least 1 uppercase letter", valid: /[A-Z]/.test(formData.password) },
  ];

  const isPasswordStrong = passwordChecks.every(check => check.valid);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Passwords do not match! ♂️');
      return;
    }

    if (!isPasswordStrong) {
      toast.error('Please meet all password requirements! 🔒');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        role: 'User',
        emailVisibility: true,
      };

      // 1. Create the user
      await pb.collection('users').create(userData);
      
      // 2. Send verification email
      await pb.collection('users').requestVerification(formData.email);
      
      // 3. Set success state to true to show the success screen
      setIsSuccess(true);

      // 4. Wait 5 seconds, then redirect to homepage
      setTimeout(() => {
        navigate('/');
      }, 5000); // 5000ms = 5 seconds

    } catch (err) {
      console.error('❌ Registration Error:', err);
      setIsLoading(false); 
      
      if (err.response?.data?.username) {
        toast.error('Username is already taken! 🚫');
      } else if (err.response?.data?.email) {
        toast.error('Email is already registered! ');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  // 🎉 SUCCESS SCREEN (Shows for 5 seconds before redirect)
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/10 p-4 rounded-full">
              <Mail className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">
            Check Your Email! 📧
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            We've sent a verification link to <span className="text-[#e63946] font-bold">{formData.email}</span>. 
            Please click the link to activate your account.
          </p>
          
          {/* Countdown / Loading Indicator */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Redirecting to homepage in 5 seconds... ⏳
            </p>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#e63946] h-1.5 rounded-full animate-[loading_5s_linear_forwards]" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 📝 NORMAL REGISTRATION FORM
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest text-center">
          Create account as a User 👤
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Join Spicy and connect with amazing profiles! ✨
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          
          <input 
            name="username" 
            placeholder="Username" 
            value={formData.username} 
            onChange={handleInputChange} 
            className="w-full p-4 bg-black border border-zinc-700 rounded-xl text-white outline-none focus:border-[#e63946] transition-colors" 
            required 
          />

          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleInputChange} 
            className="w-full p-4 bg-black border border-zinc-700 rounded-xl text-white outline-none focus:border-[#e63946] transition-colors" 
            required 
          />

          <div>
            <div className="relative">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleInputChange} 
                className={`w-full p-4 pr-12 bg-black border rounded-xl text-white outline-none transition-colors ${
                  formData.password && !isPasswordStrong ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-[#e63946]'
                }`} 
                required 
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {formData.password && (
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

          <div className="relative">
            <input 
              name="passwordConfirm" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              value={formData.passwordConfirm} 
              onChange={handleInputChange} 
              className={`w-full p-4 pr-12 bg-black border rounded-xl text-white outline-none transition-colors ${
                formData.passwordConfirm && formData.password !== formData.passwordConfirm ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-[#e63946]'
              }`} 
              required 
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 flex items-start gap-3">
            <div className="text-2xl">💳</div>
            <div>
              <h4 className="text-white font-bold text-sm">Subscription Plan</h4>
              <p className="text-gray-400 text-xs mt-1">
                By registering, you agree to our premium user subscription of <span className="text-[#e63946] font-black">Ksh 100 per month</span>. Unlock all features and connect seamlessly! 🚀
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !isPasswordStrong}
            className="w-full p-4 bg-[#e63946] hover:bg-[#d62839] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all mt-2 shadow-lg shadow-red-900/20"
          >
            {isLoading ? 'Processing... ⏳' : 'REGISTER 🚀'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-[#e63946] hover:underline font-bold">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;