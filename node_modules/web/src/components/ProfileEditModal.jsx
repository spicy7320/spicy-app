import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const KENYAN_CITIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kericho', 'Kisii', 
  'Machakos', 'Thika', 'Athi River', 'Nyeri', 'Muranga', 'Kiambu', 'Naivasha', 
  'Narok', 'Bomet', 'Kapsabet', 'Kitale', 'Bungoma', 'Kakamega', 'Busia', 
  'Malindi', 'Lamu', 'Garissa', 'Wajir', 'Mandera', 'Isiolo', 'Samburu', 
  'Turkana', 'West Pokot', 'Baringo', 'Laikipia', 'Tana River', 'Taita Taveta', 
  'Kwale', 'Kilifi'
];

const ProfileEditModal = ({ open, onClose, profile, onSave }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    phone: '',
    bio: '',
  });
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        location: profile.location || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
      setExistingPhotos(profile.photos || []);
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (existingPhotos.length + photos.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }
    setPhotos(prev => [...prev, ...files]);
  };

  const removeNewPhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (photoName) => {
    setExistingPhotos(prev => prev.filter(p => p !== photoName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) {
      toast.error('Location is required');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('userId', currentUser.id);
      data.append('name', formData.name);
      data.append('age', formData.age);
      data.append('location', formData.location);
      data.append('phone', formData.phone);
      data.append('bio', formData.bio);

      photos.forEach(photo => data.append('photos', photo));

      if (profile) {
        existingPhotos.forEach(photo => data.append('photos', photo));
        await pb.collection('profiles').update(profile.id, data, { $autoCancel: false });
        toast.success('Profile updated');
      } else {
        await pb.collection('profiles').create(data, { $autoCancel: false });
        toast.success('Profile created');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-primary/30 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">{profile ? 'Edit Profile' : 'Create Profile'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos */}
          <div>
            <Label className="text-muted-foreground">Photos (max 5)</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {existingPhotos.map((photo, index) => (
                <div key={`existing-${index}`} className="relative aspect-square">
                  <img
                    src={pb.files.getUrl(profile, photo, { thumb: '300x300' })}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(photo)}
                    className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {photos.map((photo, index) => (
                <div key={`new-${index}`} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`New photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {existingPhotos.length + photos.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-muted-foreground">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="bg-input border-border focus-visible:ring-primary text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-muted-foreground">Age *</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="120"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                required
                className="bg-input border-border focus-visible:ring-primary text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-muted-foreground">Location *</Label>
              <Select value={formData.location || undefined} onValueChange={(val) => handleChange('location', val)}>
                <SelectTrigger className="bg-input border-border focus:ring-primary text-foreground">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  {KENYAN_CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone" className="text-muted-foreground">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +254 700 000000"
                className="bg-input border-border focus-visible:ring-primary text-foreground"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-muted-foreground">Bio / Description</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Describe your services..."
              className="min-h-[120px] bg-input border-border focus-visible:ring-primary text-foreground"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="border-border hover:bg-muted text-foreground">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;