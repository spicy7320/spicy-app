import React from 'react';
import { Badge } from '@/components/ui/badge';

const InterestTag = ({ interest }) => {
  const interestIcons = {
    fitness: '💪',
    travel: '✈️',
    music: '🎵',
    art: '🎨',
    food: '🍕',
    sports: '⚽',
    reading: '📚',
    gaming: '🎮',
    movies: '🎬',
    outdoors: '🏕️',
    tech: '💻',
    fashion: '👗',
  };

  return (
    <Badge variant="secondary" className="text-sm">
      <span className="mr-1">{interestIcons[interest] || '✨'}</span>
      {interest}
    </Badge>
  );
};

export default InterestTag;