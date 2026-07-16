import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const images = provider.photos && provider.photos.length > 0 
    ? provider.photos 
    : [provider.avatar || null];

  const getPhotoUrl = (filename) => {
    if (!filename || !provider) return null;
    try {
      return pb.files.getUrl(provider, filename);
    } catch (err) {
      return null;
    }
  };

  const handleCall = () => {
    if (provider.phone) {
      window.location.href = `tel:${provider.phone}`;
    }
  };

  const handleCardClick = () => {
    navigate(`/provider/${provider.id}`);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition-all">
      {/* Name at Top */}
      <div className="p-4 pb-2">
        <h3 className="text-2xl font-bold text-white">{provider.name || 'Unknown'}</h3>
      </div>

      {/* Image Gallery - Clickable */}
      <div className="px-4 pb-4 cursor-pointer" onClick={handleCardClick}>
        <div className="flex gap-3">
          {/* Main Image */}
          <div className="flex-1">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-800">
              {images[selectedImage] ? (
                <img 
                  src={getPhotoUrl(images[selectedImage])}
                  alt={provider.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 w-20">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx);
                  }}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-red-600' : 'border-zinc-700'
                  }`}
                >
                  {img ? (
                    <img 
                      src={getPhotoUrl(img)}
                      alt={`${provider.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <div className="px-4 pb-2">
        {provider.phone && (
          <p className="text-green-500 font-semibold text-base">
            Phone: {provider.phone}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="px-4 pb-4 flex-grow">
        <p className="text-zinc-300 text-base leading-relaxed">
          {provider.description || `This is ${provider.name} a ${provider.age || ''} year old ${provider.country || ''} ${provider.gender || ''} from ${provider.location || provider.county || 'Unknown'}`}
        </p>
      </div>

      {/* Call Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleCall}
          disabled={!provider.phone}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Phone className="w-5 h-5" />
          CALL {provider.name ? provider.name.toUpperCase() : 'NOW'}
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;