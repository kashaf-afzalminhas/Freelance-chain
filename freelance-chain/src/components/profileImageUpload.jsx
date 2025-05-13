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
// import React, { useState, useRef } from 'react';
// import { toast } from 'sonner';
// import { uploadProfileImage } from '../services/api';

// const ProfileImageUpload = ({ currentImage, onSuccess }) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(currentImage ? `http://localhost:5000${currentImage}` : null);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const fileReader = new FileReader();
//     fileReader.onload = () => {
//       setPreviewUrl(fileReader.result);
//     };
//     fileReader.readAsDataURL(file);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     const file = fileInputRef.current?.files?.[0];

//     if (!file) {
//       toast.error('Please select an image to upload');
//       return;
//     }

//     setIsUploading(true);

//     try {
//       const response = await uploadProfileImage(file);
//       if (response.data.profileImage) {
//         toast.success('Profile image updated successfully!');
//         const fullImageUrl = `http://localhost:5000${response.data.profileImage}`;
//         setPreviewUrl(fullImageUrl);
//         onSuccess(response.data.profileImage);
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       toast.error('Failed to upload image. Please try again.');
//       // Reset preview to current image if upload fails
//       setPreviewUrl(currentImage ? `http://localhost:5000${currentImage}` : null);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
//       <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
//       <form onSubmit={handleUpload} className="mt-4">
//         <div className="flex flex-col items-center">
//           {previewUrl ? (
//             <div className="mb-4 relative">
//               <img
//                 src={previewUrl}
//                 alt="Profile Preview"
//                 className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
//               />
//             </div>
//           ) : (
//             <div className="mb-4 w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
//               <span className="text-gray-400">No Image</span>
//             </div>
//           )}

//           <label className="block w-full max-w-xs">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               accept="image/*"
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
//             />
//             <p className="mt-1 text-xs text-gray-500">PNG, JPG, or GIF up to 5MB</p>
//           </label>
//         </div>

//         <div className="mt-4 flex justify-center">
//           <button
//             type="submit"
//             disabled={isUploading}
//             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isUploading ? 'Uploading...' : 'Upload New Image'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProfileImageUpload;
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { uploadProfileImage, removeProfileImage } from '../services/api';

const ProfileImageUpload = ({ currentImage, onSuccess, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage ? `http://localhost:5000${currentImage}` : null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

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
        const fullImageUrl = `http://localhost:5000${response.data.profileImage}`;
        setPreviewUrl(fullImageUrl);
        onSuccess(response.data.profileImage);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image. Please try again.');
      // Reset preview to current image if upload fails
      setPreviewUrl(currentImage ? `http://localhost:5000${currentImage}` : null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await removeProfileImage();
      if (response.data.success) {
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onSuccess(null);
        toast.success('Profile image removed successfully');
      } else {
        toast.error('Failed to remove profile image');
      }
    } catch (error) {
      console.error('Error removing profile image:', error);
      toast.error(error.response?.data?.message || 'Failed to remove profile image');
    }
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-[#0C3B2E]/10 ${className}`}>
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-[#0C3B2E] mb-6">Profile Photo</h3>
        
        {/* Image Preview */}
        <div className="relative mb-6 group">
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-40 h-40 rounded-full object-cover border-4 border-[#6D9773]/30 shadow-md transition-all duration-300 group-hover:border-[#6D9773]/50"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-[#BB8A52] text-white rounded-full p-2 hover:bg-[#0C3B2E] transition-colors duration-200 shadow-md"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <div className="w-40 h-40 rounded-full bg-[#0C3B2E]/5 flex items-center justify-center border-2 border-dashed border-[#0C3B2E]/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#0C3B2E]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* File Input */}
        <label className="w-full max-w-xs cursor-pointer">
          <div className="flex flex-col items-center px-4 py-6 bg-[#0C3B2E]/5 rounded-lg border-2 border-dashed border-[#0C3B2E]/20 hover:border-[#6D9773] transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6D9773]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="mt-2 text-sm font-medium text-[#0C3B2E]">
              {previewUrl ? 'Change photo' : 'Upload a photo'}
            </span>
            <span className="mt-1 text-xs text-[#0C3B2E]/70">
              PNG, JPG, or GIF (max 5MB)
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </label>

        {/* Upload Button */}
        <div className="mt-6 w-full max-w-xs">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !previewUrl || (previewUrl === currentImage && `http://localhost:5000${currentImage}`)}
            className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-colors duration-300 ${
              isUploading 
                ? 'bg-[#6D9773]/70 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#6D9773] to-[#0C3B2E] hover:from-[#0C3B2E] hover:to-[#6D9773]'
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;