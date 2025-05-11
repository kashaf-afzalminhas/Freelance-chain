// import { useEffect, useState } from 'react';
// import { getUserProfile, updateUserProfile, uploadProfileImage } from '../../../services/api';
// import ProfileView from '../../../components/profileView';
// import ProfileEdit from '../../../components/EditProfile';
// import ProfileImageUpload from '../../../components/profileImageUpload';

// export default function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [editing, setEditing] = useState(false);

//   useEffect(() => {
//     getUserProfile().then((res) => setProfile(res.data)).catch(console.error);
//   }, []);

//   const handleUpdate = async (updatedData) => {
//     try {
//       const res = await updateUserProfile(updatedData);
//       setProfile(res.data);
//       setEditing(false);
//     } catch (err) {
//       console.error('Update failed:', err);
//     }
//   };

//   const handleImageUpload = async (file) => {
//     try {
//       const res = await uploadProfileImage(file);
//       setProfile(prev => ({ ...prev, profileImage: res.data.profileImage }));
//     } catch (err) {
//       console.error('Image upload failed:', err);
//     }
//   };

//   if (!profile) return <p>Loading...</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">My Profile</h1>
//       <ProfileImageUpload imageUrl={profile.profileImage} onUpload={handleImageUpload} />
//       {editing ? (
//         <ProfileEdit profile={profile} onSave={handleUpdate} onCancel={() => setEditing(false)} />
//       ) : (
//         <ProfileView profile={profile} onEdit={() => setEditing(true)} />
//       )}
//     </div>
//   );
// }

// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
//import Layout from '../../components/layout/Layout';
import ProfileImageUpload from '../../../components/profileImageUpload';
import PortfolioLinks from '../../../components/PortfolioLink';
import SkillsList from '../../../components/SkillsList';
import { getUserProfile } from '../../../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please sign in to view your profile');
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getUserProfile();
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile. Please try again later.');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpdate = async (imageUrl) => {
    try {
      if (profile) {
        setProfile({ ...profile, profileImage: imageUrl });
        toast.success('Profile image updated successfully');
      }
    } catch (err) {
      console.error('Failed to update profile image:', err);
      toast.error('Failed to update profile image');
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">{error || 'Could not load profile data'}</p>
        <button
          onClick={fetchProfile}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information</p>
          </div>
          <Link
            to="/profile/edit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Edit Profile
          </Link>
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
                {profile.email && (
                  <p className="text-sm text-gray-500">{profile.email}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                <p className="mt-1 text-gray-600">
                  {profile.bio || "No bio information provided yet."}
                </p>
              </div>

              {/* Role-specific information */}
              {profile.role === 'freelancer' && (
                <>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                    <div className="mt-2">
                      <SkillsList skills={profile.skills} />
                    </div>
                  </div>
                  {profile.experience && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                      <p className="mt-1 text-gray-600">{profile.experience}</p>
                    </div>
                  )}
                </>
              )}

              {profile.role === 'client' && profile.company && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Company</h3>
                  <p className="mt-1 text-gray-600">{profile.company}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900">Portfolio Links</h3>
                <div className="mt-4 space-y-4">
                  {/* LinkedIn */}
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">LinkedIn</p>
                      {profile.portfolioLinks?.linkedin ? (
                        <a 
                          href={profile.portfolioLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {profile.portfolioLinks.linkedin}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">GitHub</p>
                      {profile.portfolioLinks?.github ? (
                        <a 
                          href={profile.portfolioLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {profile.portfolioLinks.github}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>

                  {/* Personal Portfolio */}
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Personal Portfolio</p>
                      {profile.portfolioLinks?.personalPortfolio ? (
                        <a 
                          href={profile.portfolioLinks.personalPortfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {profile.portfolioLinks.personalPortfolio}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileImageUpload 
        currentImage={profile.profileImage} 
        onSuccess={handleImageUpdate} 
      />
    </div>
  );
};



export default ProfilePage;
