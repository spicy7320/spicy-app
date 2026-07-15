import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  // Handle image URL safely
  const getPhotoUrl = () => {
    if (profile.avatar) {
      return pb.files.getUrl(profile, profile.avatar, { thumb: '400x400' });
    }
    if (profile.photos && profile.photos.length > 0) {
      return pb.files.getUrl(profile, profile.photos[0], { thumb: '400x400' });
    }
    return null;
  };

  const imageUrl = getPhotoUrl();
  const fullName = profile.name || 'Anonymous';
  const callName = fullName.split(' ')[0].toUpperCase(); // Get first name for the button

  const handleCardClick = () => {
    // Navigate to the full profile page when tapped
    navigate(`/provider/${profile.id}`);
  };

  const handleCallClick = (e) => {
    e.stopPropagation(); // Prevent navigating when clicking the call button
    if (profile.phone) {
      window.location.href = `tel:${profile.phone}`;
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#e63946]/50 transition-all duration-300 group"
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] bg-[#1a1a1a]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={fullName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <span className="text-lg font-bold">No Image</span>
          </div>
        )}
        
        {/* Location Badge */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-white/10 text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
          <MapPin className="w-3 h-3 mr-1 text-[#e63946]" />
          {profile.location || 'Unknown'}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Name and Age */}
        <h3 className="text-xl font-bold text-white mb-2">
          {fullName}{profile.age ? `, ${profile.age}` : ''}
        </h3>

        {/* Phone Number */}
        {profile.phone && (
          <p className="text-green-500 font-bold text-sm mb-2 flex items-center gap-1">
            <Phone className="w-3 h-3" /> {profile.phone}
          </p>
        )}

        {/* Short Description */}
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {profile.description || profile.bio || 'No description provided.'}
        </p>

        {/* Call Button */}
        <button
          onClick={handleCallClick}
          className="w-full bg-[#e63946] hover:bg-[#d62839] text-white font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase"
        >
          <Phone className="w-4 h-4" /> CALL {callName}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;