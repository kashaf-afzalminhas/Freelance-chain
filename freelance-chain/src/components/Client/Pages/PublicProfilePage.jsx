// src/pages/PublicProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
//import Layout from '../../components/layout/Layout';
import PortfolioLinks from '../../../components/PortfolioLink';
import SkillsList from '../../../components/SkillsList';
import { getPublicUserProfile } from '../../../services/api';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchPublicProfile(userId);
    }
  }, [userId]);

  const fetchPublicProfile = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPublicUserProfile(id);
      
      // Ensure role-specific data is properly structured
      const profileData = {
        ...response.data,
        skills: response.data.skills || [],
        experience: response.data.experience || '',
        company: response.data.company || '',
        portfolioLinks: {
          linkedin: response.data.portfolioLinks?.linkedin || null,
          github: response.data.portfolioLinks?.github || null,
          personalPortfolio: response.data.portfolioLinks?.personalPortfolio || null
        }
      };
      
      setProfile(profileData);
    } catch (err) {
      console.error('Failed to fetch public profile:', err);
      setError('Failed to load profile. This user may not exist or the profile is private.');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
     
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
     
    );
  }

  if (error || !profile) {
    return (
      
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'Could not load profile data'}</p>
        </div>
     
    );
  }

  return (
   
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-800">{profile.name}'s Profile</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Public profile information</p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-40 h-40 rounded-full object-cover border-4 border-purple-100"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xl font-medium">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="mt-4 text-xl font-medium text-gray-900">{profile.name}</h3>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                  <p className="mt-1 text-gray-600">
                    {profile.bio || 'No bio information provided.'}
                  </p>
                </div>

                {profile.role === 'freelancer' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                    <div className="mt-2">
                      <SkillsList skills={profile.skills} />
                    </div>
                  </div>
                )}

                {profile.role === 'client' && profile.company && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Company</h3>
                    <p className="mt-1 text-gray-600">{profile.company}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Portfolio Links</h3>
                  <div className="mt-2">
                    <PortfolioLinks links={profile.portfolioLinks} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default PublicProfilePage;
