import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import ProfileCard from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { toast } from 'sonner';

const KENYAN_CITIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kericho', 'Kisii', 
  'Machakos', 'Thika', 'Athi River', 'Nyeri', 'Muranga', 'Kiambu', 'Naivasha', 
  'Narok', 'Bomet', 'Kapsabet', 'Kitale', 'Bungoma', 'Kakamega', 'Busia', 
  'Malindi', 'Lamu', 'Garissa', 'Wajir', 'Mandera', 'Isiolo', 'Samburu', 
  'Turkana', 'West Pokot', 'Baringo', 'Laikipia', 'Tana River', 'Taita Taveta', 
  'Kwale', 'Kilifi'
];

const DiscoveryPage = () => {
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedUserIds, setLikedUserIds] = useState([]);
  const [locationFilter, setLocationFilter] = useState('All');

  useEffect(() => {
    fetchProfiles();
  }, [currentUser, locationFilter]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      // Get likes first
      const likes = await pb.collection('likes').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false,
      });
      const likedIds = likes.map(like => like.likedUserId);
      setLikedUserIds(likedIds);

      // Build filter string
      let filterStr = `userId != "${currentUser.id}"`;
      if (locationFilter !== 'All') {
        filterStr += ` && location = "${locationFilter}"`;
      }

      const allProfiles = await pb.collection('profiles').getFullList({
        filter: filterStr,
        sort: '-created',
        $autoCancel: false,
      });

      const filteredProfiles = allProfiles.filter(
        profile => !likedIds.includes(profile.userId)
      );

      setProfiles(filteredProfiles);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const profile = profiles[currentIndex];
    if (!profile) return;

    try {
      await pb.collection('likes').create({
        userId: currentUser.id,
        likedUserId: profile.userId,
      }, { $autoCancel: false });

      const mutualLike = await pb.collection('likes').getFullList({
        filter: `userId = "${profile.userId}" && likedUserId = "${currentUser.id}"`,
        $autoCancel: false,
      });

      if (mutualLike.length > 0) {
        await pb.collection('matches').create({
          userId1: currentUser.id,
          userId2: profile.userId,
          status: 'matched',
        }, { $autoCancel: false });

        toast.success(`It's a match with ${profile.name}!`);
      }

      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error('Failed to like profile');
    }
  };

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1);
  };

  if (loading && profiles.length === 0) {
    return (
      <>
        <Helmet>
          <title>Discovery - Spark</title>
        </Helmet>
        <Header />
        <div className="min-h-[calc(100vh-4rem)] bg-background py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Skeleton className="w-full aspect-[3/4] rounded-2xl mb-4 bg-secondary" />
            <Skeleton className="h-8 w-48 mb-2 bg-secondary" />
            <Skeleton className="h-4 w-32 bg-secondary" />
          </div>
        </div>
      </>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <>
      <Helmet>
        <title>Discovery - Spark</title>
        <meta name="description" content="Discover amazing people and find your perfect match on Spark." />
      </Helmet>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-background py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,0,0,0.05),transparent_50%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Discover</h1>
              <p className="text-muted-foreground">Find people who match your vibe</p>
            </div>
            
            <div className="flex items-center space-x-2 bg-card border border-primary/20 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px] bg-transparent border-none focus:ring-0 text-white">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30 text-white">
                  <SelectItem value="All">All Locations</SelectItem>
                  {KENYAN_CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentProfile ? (
              <motion.div
                key={currentProfile.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileCard
                  profile={currentProfile}
                  onLike={handleLike}
                  onPass={handlePass}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 border border-primary/20 rounded-2xl bg-card/50 backdrop-blur-sm"
              >
                <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">No more profiles</h2>
                <p className="text-muted-foreground mb-6">
                  You've seen all available profiles in {locationFilter === 'All' ? 'all locations' : locationFilter}. Check back later!
                </p>
                {locationFilter !== 'All' && (
                  <Button variant="outline" onClick={() => setLocationFilter('All')} className="border-primary/50 text-primary hover:bg-primary hover:text-black">
                    View All Locations
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default DiscoveryPage;