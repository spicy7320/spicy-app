import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);

           // Check role and redirect
      if (authData.record.role === 'Service Provider') {
        // THIS IS THE MAGIC CONNECTION: It sends them to the Provider page using THEIR OWN ID
        navigate(`/provider/${authData.record.id}`); 
      } else {
        navigate('/profile');
      }

            // ✅ REDIRECT BASED ON ROLE
      const userRole = authData.record.role;
      
      if (userRole === 'Service Provider') {
        // Send providers to THEIR public provider profile
        navigate(`/provider/${authData.record.id}`);
      } else {
        // Send regular users to their user profile page
        navigate('/profile');
      }

    } catch (err) {
      console.error("Login failed:", err);
      
      // Better error messages
      if (err.status === 400) {
        setError('Invalid email or password. Please try again.');
      } else if (err.status === 404) {
        setError('Account not found. Please check your email or register.');
      } else if (err.message?.includes('network')) {
        setError('Connection error. Please check if PocketBase is running.');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
        <div className="text-center mb-8">
          <LogIn className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-black uppercase mb-2">Login</h1>
          <p className="text-zinc-400">Welcome back</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 text-red-400 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-sm font-medium mb-2">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm font-medium mb-2">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter your password"
                required
              />
            </div>
            {/* 🔐 Forgot Password Link */}
            <div className="text-right mt-2">
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-red-500 hover:text-red-400 hover:underline font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-bold py-3"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-zinc-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup-provider" className="text-red-500 hover:text-red-400 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;