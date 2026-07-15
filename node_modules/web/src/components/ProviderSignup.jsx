import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, ArrowLeft, KeyRound, Mail, Smartphone } from 'lucide-react';

const pb = new PocketBase('http://192.168.100.16:8090');

const KENYAN_CITIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kericho',
  'Thika', 'Malindi', 'Naivasha', 'Nyeri', 'Machakos'
];

const COUNTRIES = [
  'Kenyan', 'Ugandan', 'Tanzanian', 'Rwandan', 'Ethiopian',
  'South Sudanese', 'Somali', 'Other'
];

const ProviderSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    age: '',
    gender: 'Female',
    sexualOrientation: 'Straight',
    country: 'Kenyan',
    countryOther: '',
    county: '',
    countyOther: '',
    location: '',
    height: '',
    bodySize: '',
    skinTone: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterProvider = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Strict Validation
    if (!formData.email.trim()) { setError('All sections must be filled'); return; }
    if (!formData.phone.trim()) { setError('All sections must be filled'); return; }
    if (!formData.password) { setError('All sections must be filled'); return; }
    if (!formData.name.trim()) { setError('All sections must be filled'); return; }
    if (!formData.age) { setError('All sections must be filled'); return; }
    if (!formData.height.trim()) { setError('All sections must be filled'); return; }
    if (!formData.gender) { setError('All sections must be filled'); return; }
    if (!formData.sexualOrientation) { setError('All sections must be filled'); return; }
    if (!formData.country) { setError('All sections must be filled'); return; }

    if (formData.country === 'Other') {
      if (!formData.countryOther.trim()) { setError('All sections must be filled'); return; }
    }

    if (formData.country === 'Kenyan') {
      if (!formData.county) { setError('All sections must be filled'); return; }
      if (formData.county === 'Other') {
        if (!formData.countyOther.trim()) { setError('All sections must be filled'); return; }
      }
    } else {
      if (!formData.county.trim()) { setError('All sections must be filled'); return; }
    }

    if (!formData.location.trim()) { setError('All sections must be filled'); return; }
    if (!formData.bodySize.trim()) { setError('All sections must be filled'); return; }
    if (!formData.skinTone.trim()) { setError('All sections must be filled'); return; }
    if (!formData.description.trim()) { setError('All sections must be filled'); return; }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
      setError('Age must be between 18 and 99.');
      return;
    }

    const words = formData.description.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length < 10) {
      setError('Description must be at least 10 words.');
      return;
    }
    if (words.length > 50) {
      setError('Description must be 50 words or less.');
      return;
    }

    setLoading(true);

    try {
      const finalCountry = formData.country === 'Other' ? formData.countryOther.trim() : formData.country;
      const finalCounty = formData.county === 'Other' ? formData.countyOther.trim() : formData.county;

      const data = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        passwordConfirm: formData.password,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        sexualOrientation: formData.sexualOrientation,
        country: finalCountry,
        county: finalCounty,
        location: formData.location.trim(),
        height: formData.height.trim(),
        bodySize: formData.bodySize.trim(),
        skinTone: formData.skinTone.trim(),
        description: formData.description.trim(),
        services: [],
        role: 'Service Provider',
        verified: false,
        views: 0,
        calls: 0
      };

      // Create user account (unverified)
      await pb.collection('users').create(data);

      // Send verification email
      await pb.collection('users').requestVerification(formData.email.trim().toLowerCase());

      // Show success
      setSuccess(true);
      setLoading(false);

      // Redirect to homepage after 5 seconds
      setTimeout(() => {
        navigate('/');
      }, 5000);

    } catch (err) {
      console.error("Signup failed:", err);
      setError('Failed to create account. Please check all fields and try again.');
      setLoading(false);
    }
  };

  // If registration was successful, show verification message
  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 rounded-2xl border border-green-600 p-8 text-center">
          <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
          <p className="text-zinc-300 mb-4">
            A verification link has been sent to <span className="text-white font-semibold">{formData.email || 'your email'}</span>
          </p>
          <p className="text-zinc-400 text-sm mb-6">
            Please click the verification link in your email to activate your account. You will be redirected to the homepage shortly.
          </p>
          <div className="animate-pulse text-green-500 text-sm">Redirecting to homepage...</div>
          <Button
            onClick={() => navigate('/')}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold w-full"
          >
            Go to Homepage Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-6 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 md:p-8">
          <div className="text-center mb-8">
            <ShieldCheck className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-black uppercase mb-2">CREATE SERVICE PROVIDER ACCOUNT</h1>
            <p className="text-zinc-400">Join our network of premium service providers</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-600 text-red-400 p-4 rounded-lg mb-6">
              <p className="font-bold mb-2">⚠️ Error:</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleRegisterProvider}>
            <div className="space-y-6">
              <div className="border border-zinc-800 rounded-lg p-6">
                <h3 className="text-red-600 font-bold mb-4 flex items-center gap-2">
                  <KeyRound className="w-5 h-5" />
                  ACCOUNT SECURITY (PRIVATE)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">EMAIL ADDRESS *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <Input type="email" name="email" value={formData.email} onChange={handleInputChange} className="pl-10 bg-zinc-800 border-zinc-700 text-white" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">PHONE NUMBER *</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="pl-10 bg-zinc-800 border-zinc-700 text-white" placeholder="0712345678" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">CREATE PASSWORD *</label>
                      <Input type="password" name="password" value={formData.password} onChange={handleInputChange} className="bg-zinc-800 border-zinc-700 text-white" placeholder="Minimum 8 characters" required minLength={8} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-lg p-6">
                <h3 className="text-red-600 font-bold mb-4">PERSONAL DETAILS</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">DISPLAY NAME *</label>
                    <Input name="name" value={formData.name} onChange={handleInputChange} className="bg-zinc-800 border-zinc-700 text-white" placeholder="Your display name" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">AGE *</label>
                      <Input type="number" name="age" value={formData.age} onChange={handleInputChange} className="bg-zinc-800 border-zinc-700 text-white" min={18} max={99} placeholder="18-99" required />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">HEIGHT *</label>
                      <Input name="height" value={formData.height} onChange={handleInputChange} placeholder="e.g., 5'6" className="bg-zinc-800 border-zinc-700 text-white" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">GENDER *</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">SEXUAL ORIENTATION *</label>
                      <select name="sexualOrientation" value={formData.sexualOrientation} onChange={handleInputChange} className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white">
                        <option value="Straight">Straight</option>
                        <option value="Bisexual">Bisexual</option>
                        <option value="Gay">Gay</option>
                        <option value="Lesbian">Lesbian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">COUNTRY *</label>
                      {formData.country === 'Other' ? (
                        <Input name="countryOther" value={formData.countryOther} onChange={handleInputChange} placeholder="Type your country here..." className="bg-zinc-800 border-zinc-700 text-white" autoFocus />
                      ) : (
                        <select name="country" value={formData.country} onChange={handleInputChange} className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white">
                          {COUNTRIES.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">COUNTY *</label>
                      {formData.county === 'Other' ? (
                        <Input name="countyOther" value={formData.countyOther} onChange={handleInputChange} placeholder="Type your county/region here..." className="bg-zinc-800 border-zinc-700 text-white" autoFocus />
                      ) : formData.country === 'Kenyan' ? (
                        <select name="county" value={formData.county} onChange={handleInputChange} className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white">
                          <option value="">Select County</option>
                          {KENYAN_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <Input name="county" value={formData.county} onChange={handleInputChange} placeholder="Enter your region/state" className="bg-zinc-800 border-zinc-700 text-white" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">LOCATION / AREA *</label>
                    <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Westlands, CBD, Karen" className="bg-zinc-800 border-zinc-700 text-white" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">BODY SIZE *</label>
                      <Input name="bodySize" value={formData.bodySize} onChange={handleInputChange} placeholder="e.g., Slim, Curvy, Athletic" className="bg-zinc-800 border-zinc-700 text-white" required />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">SKIN TONE *</label>
                      <Input name="skinTone" value={formData.skinTone} onChange={handleInputChange} placeholder="e.g., Light, Medium, Dark" className="bg-zinc-800 border-zinc-700 text-white" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">DESCRIPTION * <span className="text-xs text-zinc-500">(10-50 words)</span></label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" placeholder="Tell us about yourself..." required />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-bold py-3">
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderSignup;