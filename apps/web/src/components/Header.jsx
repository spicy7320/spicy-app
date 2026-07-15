import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, Award, Video, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = ({ onOpenRegisterModal }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { name: 'Straight', path: '/category/straight' },
    { name: 'Bisexual', path: '/category/bisexual' },
    { name: 'Lesbian', path: '/category/lesbian' },
    { name: 'Gay', path: '/category/gay' },
    { name: 'Transgender', path: '/category/transgender' }
  ];

  const locations = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Other'
  ];

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLocationClick = (loc) => {
    if (loc === 'Other') {
      setShowCustomLocation(true);
      setIsLocationOpen(false);
    } else {
      setShowCustomLocation(false);
      setCustomLocation('');
      setIsLocationOpen(false);
      navigate(`/location/${loc.toLowerCase()}`);
    }
  };

  const handleCustomLocationSubmit = () => {
    if (customLocation.trim()) {
      setShowCustomLocation(false);
      setCustomLocation('');
      navigate(`/location/${customLocation.trim().toLowerCase()}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="w-full bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50 px-4 py-3 text-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-4">
          
          {/* FLAME LOGO */}
          <Link 
            to="/" 
            className="text-5xl md:text-6xl font-black italic tracking-tighter font-space bg-gradient-to-b from-[#cc1111] via-[#e63946] to-[#ffaa00] bg-clip-text text-transparent hover:opacity-95 drop-shadow-[0_4px_12px_rgba(255,100,0,0.45)] transition-all duration-300 select-none"
            style={{ filter: 'contrast(1.2) brightness(1.1)' }}
          >
            SPICY
          </Link>

         <div className="flex-1 max-w-2xl relative flex items-center min-w-0">
            <Search className="w-4 h-4 absolute left-3 text-gray-500" />
            <input 
             type="text" 
             placeholder="Search..." 
              className="w-full bg-[#121212] border border-white/10 rounded-xl h-10 pl-10 pr-4 text-sm focus:outline-none focus:border-[#e63946] transition-colors text-gray-200 placeholder:text-gray-600"
            />
         </div>

          <div className="flex items-center gap-3 text-sm font-bold">
            {/* DYNAMIC AUTH CONTROL PANEL */}
            {!currentUser ? (
              <>
                <button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white transition-colors px-2">
                  Login
                </button>

                <button 
                  onClick={onOpenRegisterModal} 
                  className="bg-white text-black hover:bg-gray-200 transition-all px-4 h-9 rounded-lg font-black"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                {/* ✅ FIXED: This now goes to the correct profile based on user type */}
                <button 
                  onClick={() => navigate(`/provider/${currentUser.id}`)} 
                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all px-4 h-9 rounded-lg font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                >
                  <User className="w-4 h-4 text-[#e63946]" /> My Profile
                </button>

                <button 
                  onClick={handleLogoutClick} 
                  className="text-gray-400 hover:text-white transition-colors px-2 flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            {/* PREMIUM BUTTON */}
            <button 
              onClick={() => alert('Premium options are coming soon! Stay tuned.')}
              className="bg-[#e63946] text-white hover:bg-[#d62839] transition-all px-4 h-9 rounded-lg font-black flex items-center gap-1 shadow-[0_0_15px_rgba(230,57,70,0.3)]"
            >
              <Award className="w-4 h-4" /> PREMIUM
            </button>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex items-center gap-6 border-t border-white/[0.03] pt-2 text-xs uppercase font-black tracking-wider text-gray-400">
          
          <Link to="/" className="text-white border-b-2 border-[#e63946] pb-1 flex items-center gap-1">
            🔥 Best Profiles
          </Link>

          <div className="relative">
            <button 
              onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsLocationOpen(false); setShowCustomLocation(false); }}
              className="flex items-center gap-1 hover:text-white pb-1 transition-colors"
            >
              Categories <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#121212] border border-white/10 rounded-xl shadow-2xl p-1 z-50">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setIsCategoryOpen(false);
                      navigate(cat.path);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white normal-case font-medium text-sm transition-colors block"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => { setIsLocationOpen(!isLocationOpen); setIsCategoryOpen(false); }}
              className="flex items-center gap-1 hover:text-white pb-1 transition-colors"
            >
               Locations <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLocationOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#121212] border border-white/10 rounded-xl shadow-2xl p-1 z-50">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocationClick(loc)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white normal-case font-medium text-sm transition-colors block"
                  >
                    {loc}
                  </button>
                ))} 
              </div>
            )}

            {/* Custom Location Input */}
            {showCustomLocation && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#121212] border border-white/10 rounded-xl shadow-2xl p-3 z-50">
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Type your location..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e63946] mb-2"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomLocationSubmit()}
                />
                <button
                  onClick={handleCustomLocationSubmit}
                  disabled={!customLocation.trim()}
                  className="w-full bg-[#e63946] text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#d62839] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                >
                  Go
                </button>
              </div>
            )}
          </div>

          <Link to="/" className="hover:text-white pb-1 transition-colors">Featured Profiles</Link>
          <Link to="/" className="hover:text-white pb-1 transition-colors flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Videos</Link>
        </div>

      </div>
    </header>
  );
};

export default Header;