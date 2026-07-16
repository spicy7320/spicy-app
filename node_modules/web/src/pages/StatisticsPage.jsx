import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Phone, TrendingUp, Calendar, Users, Star, ArrowLeft } from 'lucide-react';

const StatisticsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalViews: 0,
    totalCalls: 0,
    profileVisits: 0,
    favorites: 0,
    messages: 0,
    weeklyViews: 0,
    weeklyCalls: 0,
    topLocation: '',
    peakTime: ''
  });

  useEffect(() => {
    // TODO: Fetch real stats from backend
    // For now, using mock data
    setStats({
      totalViews: 1247,
      totalCalls: 89,
      profileVisits: 342,
      favorites: 56,
      messages: 23,
      weeklyViews: 156,
      weeklyCalls: 12,
      topLocation: 'Nairobi',
      peakTime: '8:00 PM - 10:00 PM'
    });
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "red" }) => (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-600/10`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {subtitle && (
          <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-black text-white mb-1">{value.toLocaleString()}</h3>
      <p className="text-sm text-zinc-400">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/profile')}
            variant="outline"
            size="icon"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black uppercase">Statistics</h1>
            <p className="text-zinc-400">Track your profile performance</p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Eye} 
            title="Total Views" 
            value={stats.totalViews}
            subtitle="+12%"
            color="red"
          />
          <StatCard 
            icon={Phone} 
            title="Total Calls" 
            value={stats.totalCalls}
            subtitle="+8%"
            color="green"
          />
          <StatCard 
            icon={Users} 
            title="Profile Visits" 
            value={stats.profileVisits}
            subtitle="+15%"
            color="blue"
          />
          <StatCard 
            icon={Star} 
            title="Favorites" 
            value={stats.favorites}
            subtitle="+5%"
            color="yellow"
          />
        </div>

        {/* Weekly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" /> This Week
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-300">Profile Views</span>
                </div>
                <span className="text-2xl font-bold text-white">{stats.weeklyViews}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-300">Phone Calls</span>
                </div>
                <span className="text-2xl font-bold text-white">{stats.weeklyCalls}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" /> Insights
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800/50 rounded-xl">
                <p className="text-sm text-zinc-400 mb-1">Top Location</p>
                <p className="text-lg font-bold text-white">{stats.topLocation}</p>
                <p className="text-xs text-zinc-500 mt-1">Most views from this area</p>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-xl">
                <p className="text-sm text-zinc-400 mb-1">Peak Activity Time</p>
                <p className="text-lg font-bold text-white">{stats.peakTime}</p>
                <p className="text-xs text-zinc-500 mt-1">Best time to be online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Views Over Time</h2>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const heights = [60, 80, 45, 90, 70, 85, 65];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-red-600 rounded-t-lg transition-all hover:bg-red-500"
                    style={{ height: `${heights[idx]}%` }}
                  />
                  <span className="text-xs text-zinc-400">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages Stats */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-6">Messages</h2>
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-600/10">
                <Star className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.messages}</p>
                <p className="text-sm text-zinc-400">Total Messages Received</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/messages')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              View Messages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;