// export default function ProfileImageUpload({ imageUrl, onUpload }) {
//     const handleFileChange = (e) => {
//       const file = e.target.files[0];
//       if (file) onUpload(file);
//     };
  
//     return (
//       <div className="mb-4">
//         {imageUrl && <img src={imageUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-2" />}
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//       </div>
//     );
//   }
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { uploadProfileImage } from '../services/api';

const ProfileImageUpload = ({ currentImage, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadProfileImage(file);
      if (response.data.profileImage) {
        toast.success('Profile image updated successfully!');
        onSuccess(response.data.profileImage);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
      <form onSubmit={handleUpload} className="mt-4">
        <div className="flex flex-col items-center">
          {previewUrl ? (
            <div className="mb-4 relative">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
              />
            </div>
          ) : (
            <div className="mb-4 w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          <label className="block w-full max-w-xs">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, or GIF up to 5MB</p>
          </label>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload New Image'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileImageUpload;
