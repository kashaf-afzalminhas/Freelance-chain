// src/components/ProfileForm.jsx
import { useState } from 'react';
import { updateUserProfile, uploadProfileImage } from '../services/api';

const ProfileForm = ({ user, refreshProfile }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    portfolioLinks: {
      linkedin: user.portfolioLinks?.linkedin || '',
      github: user.portfolioLinks?.github || '',
      personalPortfolio: user.portfolioLinks?.personalPortfolio || ''
    }
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('portfolioLinks.')) {
      const linkType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        portfolioLinks: {
          ...prev.portfolioLinks,
          [linkType]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

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
      
      {/* Portfolio Links Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Portfolio Links</h3>
        
        {/* LinkedIn */}
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          <input
            type="url"
            name="portfolioLinks.linkedin"
            value={formData.portfolioLinks.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn Profile URL"
            className="border p-2 flex-1"
          />
        </div>

        {/* GitHub */}
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <input
            type="url"
            name="portfolioLinks.github"
            value={formData.portfolioLinks.github}
            onChange={handleChange}
            placeholder="GitHub Profile URL"
            className="border p-2 flex-1"
          />
        </div>

        {/* Personal Portfolio */}
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <input
            type="url"
            name="portfolioLinks.personalPortfolio"
            value={formData.portfolioLinks.personalPortfolio}
            onChange={handleChange}
            placeholder="Personal Portfolio URL"
            className="border p-2 flex-1"
          />
        </div>
      </div>

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
