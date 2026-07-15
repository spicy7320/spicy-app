import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, ShieldCheck } from 'lucide-react';

const RegisterTypeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // If the modal isn't supposed to be open, don't show anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#121212] p-6 shadow-2xl md:p-8 text-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black tracking-tight">Join our Community</h3>
          <p className="text-xs text-gray-400 mt-2">Choose how you want to experience the platform</p>
        </div>

        {/* The Two Choices */}
        <div className="space-y-4">
          
          {/* OPTION 1: Standard User */}
          <button
            onClick={() => {
              onClose();       // Close the popup
              navigate('/signup'); // Send to regular user signup
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all text-left group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-500/10 text-gray-400 group-hover:text-white transition-colors">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Register as User</h4>
              <p className="text-xs text-gray-400 mt-0.5">Browse profiles, save favorites, and connect.</p>
            </div>
          </button>

          {/* OPTION 2: Service Provider */}
          <button
            onClick={() => {
              onClose();                // Close the popup
              navigate('/signup-provider'); // Send to provider form we built earlier
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-[#e63946]/20 hover:border-[#e63946]/50 hover:bg-[#e63946]/5 transition-all text-left group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e63946]/10 text-[#e63946]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white group-hover:text-[#e63946] transition-colors">Register as Provider</h4>
              <p className="text-xs text-gray-400 mt-0.5">Create your professional profile and scale your vibe.</p>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};

export default RegisterTypeModal;