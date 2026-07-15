import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { toast } from 'sonner';

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const matchRecords = await pb.collection('matches').getFullList({
        filter: `(userId1 = "${currentUser.id}" || userId2 = "${currentUser.id}") && status = "matched"`,
        sort: '-created',
        $autoCancel: false,
      });

      const conversationsData = await Promise.all(
        matchRecords.map(async (match) => {
          const otherUserId = match.userId1 === currentUser.id ? match.userId2 : match.userId1;
          const conversationId = [currentUser.id, otherUserId].sort().join('_');

          const profile = await pb.collection('profiles').getFirstListItem(
            `userId = "${otherUserId}"`,
            { $autoCancel: false }
          );

          const messages = await pb.collection('messages').getList(1, 1, {
            filter: `conversationId = "${conversationId}"`,
            sort: '-created',
            $autoCancel: false,
          });

          return {
            conversationId,
            profile,
            lastMessage: messages.items[0] || null,
            matchedAt: match.created,
          };
        })
      );

      conversationsData.sort((a, b) => {
        const aTime = a.lastMessage?.created || a.matchedAt;
        const bTime = b.lastMessage?.created || b.matchedAt;
        return new Date(bTime) - new Date(aTime);
      });

      setConversations(conversationsData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (profile) => {
    if (profile.photos && profile.photos.length > 0) {
      return pb.files.getUrl(profile, profile.photos[0], { thumb: '100x100' });
    }
    return null;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Messages - Spark</title>
        </Helmet>
        <Header />
        <div className="min-h-[calc(100vh-4rem)] bg-background py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-white">Messages</h1>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card border-primary/20">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded-full bg-secondary" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2 bg-secondary" />
                      <Skeleton className="h-4 w-48 bg-secondary" />
                    </div>
                  </CardContent>
                </Card>
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
        <title>{`Messages (${conversations.length}) - Spark`}</title>
        <meta name="description" content="View and manage your conversations with matches on Spark." />
      </Helmet>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-background py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(255,0,0,0.05),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="mb-8 border-b border-primary/20 pb-6">
            <h1 className="text-4xl font-bold mb-2 text-white">Messages</h1>
            <p className="text-primary">
              {conversations.length === 0 ? 'No conversations yet' : `${conversations.length} ${conversations.length === 1 ? 'conversation' : 'conversations'}`}
            </p>
          </div>

          {conversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 border border-primary/20 rounded-2xl bg-card/50 backdrop-blur-sm"
            >
              <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white">No messages yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                When you match with someone, you can start chatting with them here!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv, index) => (
                <motion.div
                  key={conv.conversationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer bg-card border-primary/20 hover:border-primary/60 hover:shadow-[0_0_15px_rgba(255,0,0,0.1)] transition-all duration-200 group"
                    onClick={() => navigate(`/messages/${conv.conversationId}`, { state: { matchedUser: conv.profile } })}
                  >
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="relative">
                        {getPhotoUrl(conv.profile) ? (
                          <img
                            src={getPhotoUrl(conv.profile)}
                            alt={conv.profile.name}
                            className="w-16 h-16 rounded-full object-cover border border-primary/30"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                              {conv.profile.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-lg text-white truncate group-hover:text-primary transition-colors">
                            {conv.profile.name}
                          </h3>
                          {conv.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conv.lastMessage.created)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage ? conv.lastMessage.content : 'Start a conversation'}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesPage;