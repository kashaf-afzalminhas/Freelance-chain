// src/pages/PublicProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import PortfolioLinks from '../../../components/PortfolioLink';
import SkillsList from '../../../components/SkillsList';
import { getPublicUserProfile } from '../../../services/api';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Color scheme
  const colors = {
    primary: "#6D9773",
    secondary: "#0C3B2E",
    accent: "#BB8A52",
    highlight: "#FFBA00",
  };

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
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load profile');
      }
      
      // Ensure role-specific data is properly structured
      const profileData = {
        ...response.data.data,
        skills: response.data.data.skills || [],
        experience: response.data.data.experience || '',
        company: response.data.data.company || '',
        portfolioLinks: {
          linkedin: response.data.data.portfolioLinks?.linkedin || null,
          github: response.data.data.portfolioLinks?.github || null,
          personalPortfolio: response.data.data.portfolioLinks?.personalPortfolio || null
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>Profile Not Found</h2>
          <p className="text-gray-600">{error || 'Could not load profile data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <div className="relative mb-8">
          {/* Banner */}
          <div 
            className="h-48 rounded-t-xl w-full"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              boxShadow: `0 4px 20px rgba(0, 0, 0, 0.1)`
            }}
          ></div>
          
          {/* Profile Info */}
          <div className="bg-white rounded-b-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row -mt-20 md:-mt-16 gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name || 'User'}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md flex items-center justify-center"
                    style={{ backgroundColor: colors.accent + '30' }}
                  >
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: colors.accent }}
                    >
                      {(profile.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Name and Role */}
              <div className="flex flex-col justify-center text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                  {profile.name}
                </h1>
                <div className="mt-1 inline-flex">
                  <span 
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{ 
                      backgroundColor: colors.highlight + '20',
                      color: colors.secondary
                    }}
                  >
                    {profile.role === 'freelancer' ? 'Freelancer' : 'Client'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 
                className="text-xl font-semibold pb-3 mb-4 border-b"
                style={{ borderColor: colors.primary + '30', color: colors.secondary }}
              >
                Info
              </h2>
              
              {profile.role === 'client' && profile.company && (
                <div className="mb-6">
                  <h3 
                    className="text-sm uppercase font-medium mb-2"
                    style={{ color: colors.primary }}
                  >
                    Company
                  </h3>
                  <p className="text-gray-800">{profile.company}</p>
                </div>
              )}
              
              <div>
                <h3 
                  className="text-sm uppercase font-medium mb-2"
                  style={{ color: colors.primary }}
                >
                  Portfolio Links
                </h3>
                <PortfolioLinks links={profile.portfolioLinks} />
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="md:col-span-2">
            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 
                className="text-xl font-semibold pb-3 mb-4 border-b"
                style={{ borderColor: colors.primary + '30', color: colors.secondary }}
              >
                Biography
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || 'No bio information provided.'}
              </p>
            </div>
            
            {/* Skills Section (for freelancers) */}
            {profile.role === 'freelancer' && profile.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 
                  className="text-xl font-semibold pb-3 mb-4 border-b"
                  style={{ borderColor: colors.primary + '30', color: colors.secondary }}
                >
                  Skills & Expertise
                </h2>
                <div className="mt-2">
                  <SkillsList 
                    skills={profile.skills} 
                    customStyle={{
                      backgroundColor: colors.primary + '15',
                      color: colors.secondary,
                      borderColor: 'transparent'
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Experience Section (for freelancers) */}
            {profile.role === 'freelancer' && profile.experience && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h2 
                  className="text-xl font-semibold pb-3 mb-4 border-b"
                  style={{ borderColor: colors.primary + '30', color: colors.secondary }}
                >
                  Experience
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {profile.experience}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;