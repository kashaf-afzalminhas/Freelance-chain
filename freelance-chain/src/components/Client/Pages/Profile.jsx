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

  const handleImageUpdate = (imageUrl) => {
    if (profile) {
      setProfile({ ...profile, profileImage: imageUrl });
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

              <div>
                <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                <div className="mt-2">
                  <SkillsList skills={profile.skills} ratings={profile.ratings} />
                </div>
              </div>

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

      <ProfileImageUpload 
        currentImage={profile.profileImage} 
        onSuccess={handleImageUpdate} 
      />
    </div>
  );
};

export default ProfilePage;
