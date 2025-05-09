// src/components/ProfileForm.jsx
import { useState } from 'react';
import { updateUserProfile, uploadProfileImage } from '../services/api';

const ProfileForm = ({ user, refreshProfile }) => {
  const [formData, setFormData] = useState({ name: user.name || '', bio: user.bio || '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await updateUserProfile(formData);
      refreshProfile();
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadProfileImage(file);
      refreshProfile();
    } catch (err) {
      console.error(err);
      setError('Failed to upload image');
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <input 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        placeholder="Name" 
        className="border p-2 w-full" 
      />
      <textarea 
        name="bio" 
        value={formData.bio} 
        onChange={handleChange} 
        placeholder="Bio" 
        className="border p-2 w-full" 
      />
      <button 
        onClick={handleUpdate} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update Profile
      </button>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
        className="block w-full"
      />
      <button 
        onClick={handleUpload} 
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Upload Image
      </button>
    </div>
  );
};

export default ProfileForm;
