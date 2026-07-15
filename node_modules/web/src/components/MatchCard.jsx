import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';

const MatchCard = ({ match, onClick }) => {
  const getPhotoUrl = () => {
    if (match.photos && match.photos.length > 0) {
      return pb.files.getUrl(match, match.photos[0], { thumb: '300x300' });
    }
    return null;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-square bg-muted">
        {getPhotoUrl() ? (
          <img
            src={getPhotoUrl()}
            alt={match.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-pink-500/20">
            <span className="text-6xl font-bold text-primary/30">
              {match.name?.charAt(0) || '?'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">
          {match.name}, {match.age}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{match.location}</span>
        </div>
        <Button size="sm" className="w-full" variant="outline">
          <MessageCircle className="w-4 h-4 mr-2" />
          Message
        </Button>
      </CardContent>
    </Card>
  );
};

export default MatchCard;