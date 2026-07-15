import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import pb from '@/lib/pocketbaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, MessageCircle, Activity, Trash2, Ban, ShieldAlert } from 'lucide-react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { currentAdmin } = useAdminAuth();
  const [stats, setStats] = useState({ users: 0, matches: 0, messages: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const usersList = await pb.collection('users').getList(1, 1, { $autoCancel: false });
      const matchesList = await pb.collection('matches').getList(1, 1, { $autoCancel: false });
      const messagesList = await pb.collection('messages').getList(1, 1, { $autoCancel: false });
      
      setStats({
        users: usersList.totalItems,
        matches: matchesList.totalItems,
        messages: messagesList.totalItems
      });

      // Fetch users for management table
      const allUsers = await pb.collection('users').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      
      // Fetch profiles to get names
      const profiles = await pb.collection('profiles').getFullList({ $autoCancel: false });
      const profileMap = profiles.reduce((acc, p) => ({ ...acc, [p.userId]: p }), {});

      const usersWithProfiles = allUsers.items.map(u => ({
        ...u,
        profile: profileMap[u.id] || null
      }));

      setUsers(usersWithProfiles);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    
    try {
      await pb.collection('users').delete(userId, { $autoCancel: false });
      setUsers(users.filter(u => u.id !== userId));
      setStats(prev => ({ ...prev, users: prev.users - 1 }));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Spark</title>
      </Helmet>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Command Center</h1>
              <p className="text-primary">Welcome back, {currentAdmin?.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card border-primary/30">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Users</p>
                  <h3 className="text-3xl font-bold text-white">{stats.users}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-primary/30">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Matches</p>
                  <h3 className="text-3xl font-bold text-white">{stats.matches}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-primary/30">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Messages Sent</p>
                  <h3 className="text-3xl font-bold text-white">{stats.messages}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="bg-card border-primary/30">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="text-xl text-white flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2 text-primary" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary text-muted-foreground uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Location</th>
                      <th className="px-6 py-4 font-medium">Joined</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{user.profile?.name || 'No Profile'}</div>
                          <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4 text-muted-foreground">{user.profile?.location || '-'}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(user.created).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-black">
                            <Ban className="w-4 h-4 mr-1" /> Ban
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-destructive/20 text-destructive border border-destructive hover:bg-destructive hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;