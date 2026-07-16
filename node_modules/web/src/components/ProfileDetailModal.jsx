import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, User, ChevronLeft, ChevronRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const ProfileDetailModal = ({ profile, open, onClose }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!profile) return null;

  const photos = profile.photos || [];
  
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getPhotoUrl = (photoName) => {
    return pb.files.getUrl(profile, photoName);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-primary/30 text-foreground">
        <div className="grid md:grid-cols-2 h-full max-h-[85vh]">
          {/* Photo Carousel */}
          <div className="relative bg-black flex items-center justify-center min-h-[300px] md:min-h-full">
            {photos.length > 0 ? (
              <>
                <img
                  src={getPhotoUrl(photos[currentPhotoIndex])}
                  alt={`${profile.name} - Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {photos.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${idx === currentPhotoIndex ? 'bg-primary' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center">
                <User className="w-16 h-16 mb-2 opacity-20" />
                <p>No photos available</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col overflow-y-auto">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-3xl font-bold text-white flex items-baseline gap-3">
                {profile.name} <span className="text-xl text-primary font-medium">{profile.age}</span>
              </DialogTitle>
              <div className="flex items-center text-muted-foreground mt-2">
                <MapPin className="w-4 h-4 mr-1 text-primary" />
                {profile.location}
              </div>
            </DialogHeader>

            <div className="flex-1 space-y-6">
              {profile.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 border-b border-border pb-2">About Me</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              {profile.phone ? (
                <Button 
                  className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(230,57,70,0.4)] transition-all"
                  onClick={() => window.location.href = `tel:${profile.phone}`}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  CALL {profile.phone}
                </Button>
              ) : (
                <Button disabled className="w-full h-14 text-lg font-bold bg-muted text-muted-foreground">
                  No Phone Number
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDetailModal;