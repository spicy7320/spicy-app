import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import MatchCard from '@/components/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { toast } from 'sonner';

const MatchesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [currentUser]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const matchRecords = await pb.collection('matches').getFullList({
        filter: `(userId1 = "${currentUser.id}" || userId2 = "${currentUser.id}") && status = "matched"`,
        sort: '-created',
        $autoCancel: false,
      });

      const matchedUserIds = matchRecords.map(match => 
        match.userId1 === currentUser.id ? match.userId2 : match.userId1
      );

      if (matchedUserIds.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      const profiles = await pb.collection('profiles').getFullList({
        filter: matchedUserIds.map(id => `userId = "${id}"`).join(' || '),
        $autoCancel: false,
      });

      setMatches(profiles);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = (match) => {
    const conversationId = [currentUser.id, match.userId].sort().join('_');
    navigate(`/messages/${conversationId}`, { state: { matchedUser: match } });
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Matches - Spark</title>
        </Helmet>
        <Header />
        <div className="min-h-[calc(100vh-4rem)] bg-background py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-8 text-white">Your Matches</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="aspect-square rounded-2xl mb-4 bg-secondary" />
                  <Skeleton className="h-6 w-32 mb-2 bg-secondary" />
                  <Skeleton className="h-4 w-24 bg-secondary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Matches (${matches.length}) - Spark`}</title>
        <meta name="description" content="View all your matches and start meaningful conversations on Spark." />
      </Helmet>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-background py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,0,0,0.05),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8 border-b border-primary/20 pb-6">
            <h1 className="text-4xl font-bold mb-2 text-white">Your Matches</h1>
            <p className="text-primary">
              {matches.length === 0 ? 'No matches yet' : `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
            </p>
          </div>

          {matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 border border-primary/20 rounded-2xl bg-card/50 backdrop-blur-sm max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white">No matches yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start swiping in Discovery to find people you like. When they like you back, you'll see them here!
              </p>
              <Button onClick={() => navigate('/discovery')} className="bg-primary text-black hover:bg-primary/90">
                Go to Discovery
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MatchCard match={match} onClick={() => handleMatchClick(match)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MatchesPage;