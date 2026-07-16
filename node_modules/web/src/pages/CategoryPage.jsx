import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import pb from '@/lib/pocketbaseClient';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const formattedCategory = categoryName 
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) 
    : '';

  useEffect(() => {
    if (!categoryName) return;

    const fetchProvidersByCategory = async () => {
      setLoading(true);
      try {
        console.log(` Searching for category: ${categoryName}`);
        setDebugInfo(`Searching for: ${categoryName}`);
        
        // Try multiple variations of the category name
        const variations = [
          categoryName,
          categoryName.toLowerCase(),
          categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase()
        ];
        
        console.log(`📋 Trying variations:`, variations);
        
        // Fetch ALL verified service providers first to debug
        const allRecords = await pb.collection('users').getList(1, 100, {
          filter: `role = "Service Provider" && verified = true`,
          sort: '-created'
        });
        
        console.log(`📊 Total verified providers found: ${allRecords.items.length}`);
        console.log(`📊 Sample data:`, allRecords.items.slice(0, 3).map(u => ({
          name: u.name,
          sexualOrientation: u.sexualOrientation,
          role: u.role,
          verified: u.verified
        })));
        
        // Now filter by the specific category
        const records = await pb.collection('users').getList(1, 50, {
          filter: `sexualOrientation ~ "${categoryName}" && role = "Service Provider" && verified = true`,
          sort: '-created'
        });
        
        console.log(`✅ Found ${records.items.length} providers for ${categoryName}`);
        console.log('📋 Results:', records.items.map(u => ({
          name: u.name,
          orientation: u.sexualOrientation
        })));
        
        setProviders(records.items);
        setDebugInfo(`Found ${records.items.length} profiles`);
        
      } catch (error) {
        console.error("❌ Error fetching category data:", error);
        setDebugInfo(`Error: ${error.message}`);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProvidersByCategory();
  }, [categoryName]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white min-h-[85vh]">
      
      {/* Header Block */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
          {formattedCategory} Profiles
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Browse verified {formattedCategory} service providers in your area.
        </p>
      </div>

      {/* Debug Info (remove this in production) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="bg-blue-900/20 border border-blue-600 text-blue-400 p-4 rounded-lg mb-6 text-sm">
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}

      {/* Profiles Display Section */}
      <div className="mt-8">
        <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
          ✨ Active {formattedCategory} Providers
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading profiles...</div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {providers.map((provider) => (
              <ProfileCard key={provider.id} profile={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#121212] border border-dashed border-white/10 rounded-2xl">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">
              No {formattedCategory} Profiles Found
            </h3>
            <p className="text-gray-400 mb-6">
              There are no verified {formattedCategory} service providers registered yet.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-[#e63946] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#d62839] transition-colors"
              >
                Browse All Profiles
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CategoryPage;