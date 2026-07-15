import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import pb from '@/lib/pocketbaseClient';

const LocationPage = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  
  const [selectedArea, setSelectedArea] = useState(null);
  const [customArea, setCustomArea] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [providers, setProviders] = useState([]);
  const [otherProviders, setOtherProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const areaData = {
    nairobi: [
      'Alisops', 'Athi River', 'Banana', 'Buru Buru', 'Chokaa', 'Dagoretti', 
      'Dandora', 'Donholm', 'Eastlands', 'Eastleigh', 'Embakasi', 'Garden City', 
      'Githurai 44', 'Githurai 45', 'Homeland', 'Hurlingham', 'Huruma', 'Imara Daima', 
      'Jamhuri', 'Joska', 'Juja', 'Kabete', 'Kahawa Sukari', 'Kahawa Wendani', 
      'Kahawa West', 'Kamulu', 'Kangemi', 'Karen', 'Kariobangi', 'Kasarani', 
      'Kawangware', 'Kayole', 'Kenyatta Road', 'Kibera', 'Kikuyu', 'Kileleshwa', 
      'Kilimani', 'Kitengela', 'Kitisuru', 'Komarock', 'Langata', 'Lavington', 
      'Loresho', 'Madaraka', 'Makadara', 'Malaa', 'Mathare', 'Milimani', 
      'Mlolongo', 'Muthaiga', 'Muthangari', 'Muthurwa', 'Mwiki', 'Nairobi Town', 
      'Nairobi West', 'Ndenderu', 'Ngara', 'Ngong', 'Ngumba', 'Njiru', 
      'Ongata Rongai', 'Pangani', 'Parklands', 'Roasters', 'Roysambu', 'Ruai', 
      'Ruaka', 'Ruaraka', 'Ruiru', 'Runda', 'Saika', 'South B', 'South C', 
      'Syokimau', 'Thika', 'Thogoto', 'Thome', 'Umoja', 'Upper Hill', 'Utawala', 
      'Uthiru', 'Westlands'
    ],
    mombasa: ['Nyali', 'Bamburi', 'Shanzu', 'Mtwapa', 'Changamwe', 'Likoni', 'Tudor', 'Diani'],
    kisumu: ['Milimani', 'Kondele', 'Riat', 'Nyamasaria', 'Manyatta', 'Migosi'],
    nakuru: ['Milimani', 'Naka', 'Lanet', 'Kiamunyi', 'Section 58', 'Blankets'],
    eldoret: ['Kapsoya', 'Elgon View', 'Langas', 'Huruma', 'Maili Nne', 'West Indies'],
    thika: ['Section 9', 'Landless', 'Makongeni', 'Ngoingwa', 'Chania', 'Happy Valley']
  };

  const areas = areaData[cityName?.toLowerCase()] || [];
  const formattedCity = cityName ? cityName.charAt(0).toUpperCase() + cityName.slice(1) : '';

  const handleAreaClick = (area) => {
    if (area === 'Other') {
      setShowCustomInput(true);
      setSelectedArea(null);
      setProviders([]);
      setOtherProviders([]);
    } else {
      setShowCustomInput(false);
      setCustomArea('');
      setSelectedArea(area);
    }
  };

  const handleCustomAreaSubmit = () => {
    if (customArea.trim()) {
      setSelectedArea(customArea.trim());
      setShowCustomInput(false);
      setCustomArea('');
    }
  };

  useEffect(() => {
    const areaToFetch = selectedArea || (areas.length === 0 && cityName ? cityName : null);
    if (!areaToFetch) return;

    const fetchProviders = async () => {
      setLoading(true);
      try {
        console.log(`Fetching providers from: ${areaToFetch}`);
        
        // Fetch providers from selected area
        const localRecords = await pb.collection('users').getList(1, 50, {
          filter: `location ~ "${areaToFetch}" && role = "Service Provider" && verified = true`,
          sort: '-created'
        });
        
        setProviders(localRecords.items);
        
        // If no local providers, fetch from other areas
        if (localRecords.items.length === 0) {
          console.log(`No providers in ${areaToFetch}, fetching from other areas...`);
          const otherRecords = await pb.collection('users').getList(1, 20, {
            filter: `location !~ "${areaToFetch}" && role = "Service Provider" && verified = true`,
            sort: '-created'
          });
          setOtherProviders(otherRecords.items);
        } else {
          setOtherProviders([]);
        }
        
      } catch (error) {
        console.error("Error fetching location data:", error);
        setProviders([]);
        setOtherProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [selectedArea, cityName, areas.length]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white min-h-[85vh]">
      
      {/* Header Block */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
          {formattedCity} Models & Profiles
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Find localized active profiles near you | Available in {formattedCity} County areas.
        </p>
      </div>

      {/* Directory Filter Box */}
      {areas.length > 0 && (
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-xl mb-8">
          
          {/* Navigation Info Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider mb-6">
            <button 
              onClick={() => navigate('/')} 
              className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors"
            >
              HOME
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400">{formattedCity} Local Hub</span>
            {selectedArea && (
              <>
                <span className="text-gray-600">/</span>
                <span className="text-[#e63946]">{selectedArea}</span>
              </>
            )}
          </div>

          {/* Dynamic Area Button Tags Grid */}
          <div className="flex flex-wrap gap-2.5">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => handleAreaClick(area)}
                className={`text-sm font-bold px-3.5 py-2 rounded-lg transition-all tracking-wide ${
                  selectedArea === area 
                    ? 'bg-white text-black scale-[1.02] shadow-lg' 
                    : 'bg-[#e63946] text-white hover:bg-[#d62839]'
                }`}
              >
                {area}
              </button>
            ))}
            {/* "Other" button */}
            <button
              onClick={() => handleAreaClick('Other')}
              className={`text-sm font-bold px-3.5 py-2 rounded-lg transition-all tracking-wide ${
                showCustomInput 
                  ? 'bg-white text-black scale-[1.02] shadow-lg' 
                  : 'bg-[#e63946] text-white hover:bg-[#d62839]'
              }`}
            >
              Other
            </button>
          </div>

          {/* Custom area input field */}
          {showCustomInput && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="Type your area/neighborhood..."
                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#e63946]"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCustomAreaSubmit()}
              />
              <button
                onClick={handleCustomAreaSubmit}
                disabled={!customArea.trim()}
                className="bg-[#e63946] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d62839] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
              >
                Search
              </button>
            </div>
          )}
        </div>
      )}

      {/* PROFILES DISPLAY SECTION */}
      <div className="mt-12">
        <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
          {selectedArea ? `✨ Active Providers in ${selectedArea}` : areas.length > 0 ? '👈 Select an area above to view profiles' : '✨ Active Providers'}
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading active profiles...</div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {providers.map((provider) => (
              <ProfileCard key={provider.id} profile={provider} />
            ))}
          </div>
        ) : selectedArea ? (
          <>
            {/* No profiles in this area message */}
            <div className="text-center py-12 bg-[#121212] border border-dashed border-white/10 rounded-2xl mb-8">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Profiles Found in {selectedArea}
              </h3>
              <p className="text-gray-400 mb-4">
                We couldn't find any active service providers in this area yet.
              </p>
              <p className="text-gray-500 text-sm">
                Here are some profiles from other areas you might be interested in:
              </p>
            </div>

            {/* Show other providers */}
            {otherProviders.length > 0 ? (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   Other Active Providers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {otherProviders.map((provider) => (
                    <ProfileCard key={provider.id} profile={provider} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-[#121212] border border-dashed border-white/10 rounded-2xl">
                <p className="text-gray-400">No other profiles available at the moment.</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-[#e63946] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#d62839] transition-colors"
                >
                  View Homepage
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>

    </div>
  );
};

export default LocationPage;