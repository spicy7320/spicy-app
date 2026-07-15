import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import MessageInput from '@/components/MessageInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { toast } from 'sonner';

const ConversationView = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const matchedUser = location.state?.matchedUser;

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();

    return () => {
      pb.collection('messages').unsubscribe();
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('messages').getFullList({
        filter: `conversationId = "${conversationId}"`,
        sort: 'created',
        $autoCancel: false,
      });
      setMessages(records);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = async () => {
    pb.collection('messages').subscribe('*', (e) => {
      if (e.record.conversationId === conversationId) {
        if (e.action === 'create') {
          setMessages(prev => [...prev, e.record]);
        } else if (e.action === 'update') {
          setMessages(prev => prev.map(msg => msg.id === e.record.id ? e.record : msg));
        } else if (e.action === 'delete') {
          setMessages(prev => prev.filter(msg => msg.id !== e.record.id));
        }
      }
    }, { $autoCancel: false });
  };

  const handleSendMessage = async (content) => {
    if (!matchedUser) return;

    setSending(true);
    try {
      await pb.collection('messages').create({
        conversationId,
        senderId: currentUser.id,
        recipientId: matchedUser.userId,
        content,
        read: false,
      }, { $autoCancel: false });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getPhotoUrl = () => {
    if (matchedUser?.photos && matchedUser.photos.length > 0) {
      return pb.files.getUrl(matchedUser, matchedUser.photos[0], { thumb: '100x100' });
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>{`Chat with ${matchedUser?.name || 'Match'} - Spark`}</title>
      </Helmet>
      <Header />
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
        {/* Chat Header */}
        <div className="border-b border-primary/20 bg-card px-4 py-3 flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/messages')}
            className="md:hidden text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {getPhotoUrl() ? (
            <img
              src={getPhotoUrl()}
              alt={matchedUser?.name}
              className="w-10 h-10 rounded-full object-cover border border-primary/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {matchedUser?.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div>
            <h2 className="font-semibold text-white">{matchedUser?.name || 'Match'}</h2>
            <p className="text-xs text-primary">{matchedUser?.location}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-background">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-primary">Say hi to start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.senderId === currentUser.id;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-primary text-black font-medium shadow-[0_0_10px_rgba(255,0,0,0.3)]'
                          : 'bg-secondary border border-primary/20 text-white'
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.created)}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-primary/20 bg-card px-4 py-4">
          <MessageInput onSend={handleSendMessage} disabled={sending} />
        </div>
      </div>
    </>
  );
};

export default ConversationView;