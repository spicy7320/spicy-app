import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { 
  User, Settings, CreditCard, Award, FileText, MessageSquare, 
  Shield, LogOut, Eye, Phone, Plus, Camera, Save, MapPin, 
  Briefcase, Heart, Smartphone, Calendar, Play, Bell
} from 'lucide-react';
import { toast } from 'sonner';

const ProviderProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'Female',
    sexualOrientation: 'Straight',
    age: 18,
    nationality: 'Kenyan',
    county: '',
    city: '',
    location: '',
    area: '',
    description: '',
    services: [],
    otherServices: []
  });

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      const record = await pb.collection('users').getOne(currentUser.id);
      setFormData({
        name: record.name || '',
        phone: record.phone || '',
        gender: record.gender || 'Female',
        sexualOrientation: record.sexualOrientation || 'Straight',
        age: record.age || 18,
        nationality: record.country || 'Kenyan',
        county: record.county || '',
        city: record.location || '',
        location: record.location || '',
        area: record.area || '',
        description: record.description || '',
        services: record.services || [],
        otherServices: record.otherServices || []
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await pb.collection('users').update(currentUser.id, formData);
      toast.success("Profile updated successfully! ✨");
      setOriginalData(null);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

 const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'photos', label: 'Photos', icon: Camera },
  { id: 'videos', label: 'Videos', icon: Play },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

  const sidebarItems = [
  { id: 'subscription', label: 'My Subscription', icon: Award, path: '/subscription' },
  { id: 'verification', label: 'Verification', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-800 border-t-[#e63946] mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#e63946] to-orange-600 h-48 relative">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT SIDEBAR - Profile Card */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 text-center shadow-2xl">
              {/* Profile Photo */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#e63946] to-orange-500 rounded-full p-1">
                  <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden">
                    {currentUser?.avatar ? (
                      <img 
                        src={pb.files.getUrl(currentUser, currentUser.avatar)} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-zinc-600 mx-auto mt-8" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 bg-[#e63946] hover:bg-[#d62839] p-2 rounded-full shadow-lg transition-transform hover:scale-110">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-black mb-1">{formData.name || 'Provider'}</h2>
              <p className="text-zinc-400 text-sm mb-4">Service Provider</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <Eye className="w-5 h-5 text-[#e63946] mx-auto mb-1" />
                  <p className="text-lg font-bold">0</p>
                  <p className="text-xs text-zinc-400">Views</p>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-3">
                  <Phone className="w-5 h-5 text-[#e63946] mx-auto mb-1" />
                  <p className="text-lg font-bold">0</p>
                  <p className="text-xs text-zinc-400">Calls</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/statistics')}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded-xl transition-colors text-sm mb-4"
              >
                View Statistics
              </button>

              
                        {/* Quick Actions */}
          <div className="space-y-2 mt-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => item.path && navigate(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 text-white hover:bg-zinc-700 transition-all border border-zinc-700"
                >
                  <Icon className="w-4 h-4 text-[#e63946]" />
                  <span className="font-medium text-sm text-white">{item.label}</span>
                </button>
              );
            })}
          </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-900/20 hover:bg-red-900/30 text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-2 mb-6">
              <div className="flex gap-2 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/20'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 md:p-8 shadow-2xl">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-black mb-2">Personal Information</h1>
                      <p className="text-zinc-400">Update your profile details and contact information</p>
                    </div>
                                      <div className="flex gap-3">
                    {isEditing ? (
                      <>
                                          <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleSave();
                            setIsEditing(false);
                          }}
                          disabled={saving}
                          className="bg-[#e63946] hover:bg-[#d62839] disabled:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
                        >
                          <Save className="w-5 h-5" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="bg-[#e63946] hover:bg-[#d62839] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>  
                        <button
                          onClick={() => {
                            handleSave();
                            setIsEditing(false);
                          }}
                          disabled={saving}
                          className="bg-[#e63946] hover:bg-[#d62839] disabled:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
                        >
                          <Save className="w-5 h-5" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="bg-[#e63946] hover:bg-[#d62839] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-zinc-400 text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-2">
                      <label className="block text-zinc-400 text-sm font-medium mb-2">
                        <Smartphone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                        placeholder="+254 7XX XXX XXX"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Orientation */}
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">Sexual Orientation</label>
                      <select
                        value={formData.sexualOrientation}
                        onChange={(e) => handleChange('sexualOrientation', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                      >
                        <option>Straight</option>
                        <option>Bisexual</option>
                        <option>Lesbian</option>
                        <option>Gay</option>
                        <option>Transgender</option>
                      </select>
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Age
                      </label>
                      <select
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                      >
                        {Array.from({ length: 50 }, (_, i) => 18 + i).map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">Nationality</label>
                      <select
                        value={formData.nationality}
                        onChange={(e) => handleChange('nationality', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                      >
                        <option>Kenyan</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Location Section */}
                    <div className="md:col-span-2 mt-6 mb-2">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#e63946]" />
                        Location Details
                      </h3>
                    </div>

                    {/* County */}
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">County</label>
                      <select
                        value={formData.county}
                        onChange={(e) => handleChange('county', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                      >
                        <option value="">Select County</option>
                        <option>Nairobi</option>
                        <option>Mombasa</option>
                        <option>Kisumu</option>
                        <option>Nakuru</option>
                        <option>Eldoret</option>
                        <option>Thika</option>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">City / Town</label>
                      <select
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                      >
                        <option value="">Select City</option>
                        <option>Nairobi</option>
                        <option>Mombasa</option>
                        <option>Kisumu</option>
                        <option>Nakuru</option>
                      </select>
                    </div>

                    {/* Location & Area */}
                    <div className="md:col-span-2">
                      <label className="block text-zinc-400 text-sm font-medium mb-2">Specific Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                        placeholder="Enter your specific location or address"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-zinc-400 text-sm font-medium mb-2">Area / Neighborhood</label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => handleChange('area', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all"
                        placeholder="Enter your area or neighborhood"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-zinc-400 text-sm font-medium mb-2">
                        <Heart className="w-4 h-4 inline mr-1 text-[#e63946]" />
                        About You
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/20 transition-all resize-none"
                        placeholder="Tell clients about yourself, your services, and what makes you special..."
                      />
                    </div>
                  </div>

                  {/* Save Button (Mobile) */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full md:hidden bg-[#e63946] hover:bg-[#d62839] disabled:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

                            {/* SERVICES TAB */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Manage Your Services</h3>
                      <p className="text-zinc-400">Select the services you offer to help clients find you</p>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-[#e63946] hover:bg-[#d62839] disabled:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Services'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Dinner Date',
                      'Travel Companion',
                      'Lesbian Show',
                      'Rimming',
                      'Raw BJ',
                      'BJ',
                      'GFE',
                      'COB - Cum On Body',
                      'CIM - Cum In Mouth',
                      '3 Some',
                      'Anal',
                      'Massage'
                    ].map((service) => (
                      <label
                        key={service}
                        className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800 hover:border-[#e63946] transition-all group"
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleChange('services', [...formData.services, service]);
                            } else {
                              handleChange('services', formData.services.filter(s => s !== service));
                            }
                          }}
                          className="w-5 h-5 rounded border-zinc-600 text-[#e63946] focus:ring-[#e63946] focus:ring-2 bg-zinc-700"
                        />
                        <span className="text-white font-medium group-hover:text-white">{service}</span>
                      </label>
                    ))}
                  </div>

                  {/* Other Services */}
                  <div className="mt-8 pt-6 border-t border-zinc-800">
                    <h4 className="text-lg font-bold mb-4">Other Services</h4>
                    <div className="space-y-3">
                      {formData.otherServices.map((service, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-xl p-3">
                          <input
                            type="text"
                            value={service}
                            onChange={(e) => {
                              const newServices = [...formData.otherServices];
                              newServices[idx] = e.target.value;
                              handleChange('otherServices', newServices);
                            }}
                            className="flex-1 bg-transparent text-white focus:outline-none"
                            placeholder="Enter custom service"
                          />
                          <button
                            onClick={() => {
                              handleChange('otherServices', formData.otherServices.filter((_, i) => i !== idx));
                            }}
                            className="text-red-500 hover:text-red-400 p-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          handleChange('otherServices', [...formData.otherServices, '']);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Add Other Services
                      </button>
                    </div>
                  </div>

                  {/* Selected Services Summary */}
                  {formData.services.length > 0 && (
                    <div className="mt-6 p-4 bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl">
                      <p className="text-[#e63946] font-bold mb-2">
                        {formData.services.length} service{formData.services.length !== 1 ? 's' : ''} selected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="bg-[#e63946] text-white text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PHOTOS TAB */}
              {activeTab === 'photos' && (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Your Photos</h3>
                  <p className="text-zinc-400 mb-6">Upload high-quality photos to attract more clients</p>
                  <button className="bg-[#e63946] hover:bg-[#d62839] text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 mx-auto">
                    <Plus className="w-5 h-5" />
                    Upload Photos
                  </button>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Account Settings</h3>
                  <p className="text-zinc-400 mb-6">Manage your account preferences and security</p>
                </div>
              )}
                             {/* VIDEOS TAB */}
               {activeTab === 'videos' && (
                 <div className="text-center py-12">
                   <Play className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                   <h3 className="text-2xl font-bold mb-2">Your Videos</h3>
                   <p className="text-zinc-400 mb-6">Upload videos to showcase your personality</p>
                   <button className="bg-[#e63946] hover:bg-[#d62839] text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 mx-auto">
                     <Plus className="w-5 h-5" />
                     Upload Video
                   </button>
                 </div>
               )}

               {/* NOTIFICATIONS TAB */}
               {activeTab === 'notifications' && (
                 <div className="text-center py-12">
                   <Bell className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                   <h3 className="text-2xl font-bold mb-2">Notifications</h3>
                   <p className="text-zinc-400 mb-6">Manage your notification settings</p>
                 </div>
               )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage;