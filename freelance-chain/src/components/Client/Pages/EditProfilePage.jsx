// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { z } from 'zod';
// import { getUserProfile, updateUserProfile } from '../../../services/api';
// import ProfileImageUpload from '../../../components/profileImageUpload';

// // Form validation schema
// const profileSchema = z.object({
//   name: z.string()
//     .min(2, "Name must be at least 2 characters")
//     .max(50, "Name cannot exceed 50 characters"),
//   bio: z.string()
//     .max(500, "Bio cannot exceed 500 characters")
//     .optional()
//     .nullable(),
//   portfolioLinks: z.object({
//     linkedin: z.string().url().optional().nullable().or(z.literal('')),
//     github: z.string().url().optional().nullable().or(z.literal('')),
//     personalPortfolio: z.string().url().optional().nullable().or(z.literal(''))
//   }).optional(),
//   skills: z.array(z.string()).optional(),
//   experience: z.string().optional(),
//   company: z.string().optional()
// });

// const EditProfilePage = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     bio: '',
//     portfolioLinks: { linkedin: '', github: '', personalPortfolio: '' },
//     skills: [],
//     experience: '',
//     company: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [newSkill, setNewSkill] = useState('');

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await getUserProfile();
//       console.log('Fetched profile:', response.data);
//       if (response.data.success) {
//         const profileData = response.data.data;
//         setProfile(profileData);
//         setFormData({
//           name: profileData.name || '',
//           bio: profileData.bio || '',
//           portfolioLinks: profileData.portfolioLinks || { linkedin: '', github: '', personalPortfolio: '' },
//           skills: profileData.skills || [],
//           experience: profileData.experience || '',
//           company: profileData.company || ''
//         });
//       } else {
//         toast.error(response.data.message || 'Failed to load profile data');
//       }
//     } catch (err) {
//       console.error('Failed to fetch profile:', err);
//       toast.error(err.response?.data?.message || 'Failed to load profile data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpdate = async (imageUrl) => {
//     try {
//       if (profile) {
//         setProfile({ ...profile, profileImage: imageUrl });
//         toast.success('Profile image updated successfully');
//       }
//     } catch (err) {
//       console.error('Failed to update profile image:', err);
//       toast.error('Failed to update profile image');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name.startsWith('portfolioLinks.')) {
//       const linkType = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         portfolioLinks: {
//           ...prev.portfolioLinks,
//           [linkType]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleAddSkill = () => {
//     if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         skills: [...prev.skills, newSkill.trim()]
//       }));
//       setNewSkill('');
//     }
//   };

//   const handleRemoveSkill = (skillToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter(skill => skill !== skillToRemove)
//     }));
//   };

//   const validateForm = () => {
//     try {
//       profileSchema.parse(formData);
//       setErrors({});
//       return true;
//     } catch (err) {
//       if (err instanceof z.ZodError) {
//         const newErrors = {};
//         err.errors.forEach(error => {
//           const path = error.path[0];
//           newErrors[path] = error.message;
//         });
//         setErrors(newErrors);
//       }
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Form submitted'); // Add this to check if the function is triggered

//     if (!validateForm()) return;

//     try {
//       setSubmitting(true);
//       console.log('Submitting form data:', formData);

//       const response = await updateUserProfile(formData);
//       console.log('Update response:', response);

//       if (response.data.success) {
//         toast.success('Profile updated successfully!');
//         navigate('/profile');
//       } else {
//         toast.error(response.data.message || 'Failed to update profile');
//       }
//     } catch (err) {
//       console.error('Failed to update profile:', err);

//       if (err.response?.data?.errors) {
//         const newErrors = {};
//         err.response.data.errors.forEach(error => {
//           newErrors[error.path] = error.msg;
//         });
//         setErrors(newErrors);
//       } else {
//         toast.error(err.response?.data?.message || 'Failed to update profile');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="bg-white shadow sm:rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <h2 className="text-lg font-medium text-gray-900">Edit Profile</h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Update your profile information below.
//           </p>

//           <ProfileImageUpload 
//             currentImage={profile?.profileImage} 
//             onSuccess={handleImageUpdate} 
//           />

//           <form onSubmit={handleSubmit} className="mt-6 space-y-6">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
//                   errors.name ? 'border-red-300' : ''
//                 }`}
//               />
//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
//                 Bio
//               </label>
//               <textarea
//                 name="bio"
//                 id="bio"
//                 rows={4}
//                 value={formData.bio}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
//                   errors.bio ? 'border-red-300' : ''
//                 }`}
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 {formData.bio?.length || 0}/500 characters
//               </p>
//               {errors.bio && (
//                 <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
//               )}
//             </div>

//             {profile?.role === 'freelancer' && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Skills
//                   </label>
//                   <div className="mt-1 flex items-center space-x-2">
//                     <input
//                       type="text"
//                       value={newSkill}
//                       onChange={(e) => setNewSkill(e.target.value)}
//                       placeholder="Add a skill"
//                       className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
//                     />
//                     <button
//                       type="button"
//                       onClick={handleAddSkill}
//                       className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {formData.skills.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
//                       >
//                         {skill}
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveSkill(skill)}
//                           className="ml-2 text-purple-600 hover:text-purple-800"
//                         >
//                           ×
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                   {errors.skills && (
//                     <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
//                     Experience
//                   </label>
//                   <textarea
//                     name="experience"
//                     id="experience"
//                     rows={4}
//                     value={formData.experience}
//                     onChange={handleChange}
//                     placeholder="Describe your professional experience"
//                     className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
//                       errors.experience ? 'border-red-300' : ''
//                     }`}
//                   />
//                   {errors.experience && (
//                     <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
//                   )}
//                 </div>
//               </>
//             )}

//             {profile?.role === 'client' && (
//               <div>
//                 <label htmlFor="company" className="block text-sm font-medium text-gray-700">
//                   Company Name
//                 </label>
//                 <input
//                   type="text"
//                   name="company"
//                   id="company"
//                   value={formData.company}
//                   onChange={handleChange}
//                   className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
//                     errors.company ? 'border-red-300' : ''
//                   }`}
//                 />
//                 {errors.company && (
//                   <p className="mt-1 text-sm text-red-600">{errors.company}</p>
//                 )}
//               </div>
//             )}

//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900">Portfolio Links</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Add your professional links to showcase your work and experience.
//                 </p>
//               </div>

//               {/* LinkedIn */}
//               <div>
//                 <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
//                   LinkedIn Profile
//                 </label>
//                 <div className="mt-1 flex rounded-md shadow-sm">
//                   <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
//                     <svg className="w-5 h-5 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
//                     </svg>
//                   </span>
//                   <input
//                     type="url"
//                     name="portfolioLinks.linkedin"
//                     id="linkedin"
//                     value={formData.portfolioLinks.linkedin}
//                     onChange={handleChange}
//                     className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300"
//                     placeholder="https://linkedin.com/in/your-profile"
//                   />
//                 </div>
//                 {errors['portfolioLinks.linkedin'] && (
//                   <p className="mt-1 text-sm text-red-600">{errors['portfolioLinks.linkedin']}</p>
//                 )}
//               </div>

//               {/* GitHub */}
//               <div>
//                 <label htmlFor="github" className="block text-sm font-medium text-gray-700">
//                   GitHub Profile
//                 </label>
//                 <div className="mt-1 flex rounded-md shadow-sm">
//                   <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
//                     <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                     </svg>
//                   </span>
//                   <input
//                     type="url"
//                     name="portfolioLinks.github"
//                     id="github"
//                     value={formData.portfolioLinks.github}
//                     onChange={handleChange}
//                     className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300"
//                     placeholder="https://github.com/your-username"
//                   />
//                 </div>
//                 {errors['portfolioLinks.github'] && (
//                   <p className="mt-1 text-sm text-red-600">{errors['portfolioLinks.github']}</p>
//                 )}
//               </div>

//               {/* Personal Portfolio */}
//               <div>
//                 <label htmlFor="personalPortfolio" className="block text-sm font-medium text-gray-700">
//                   Personal Portfolio
//                 </label>
//                 <div className="mt-1 flex rounded-md shadow-sm">
//                   <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
//                     <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
//                     </svg>
//                   </span>
//                   <input
//                     type="url"
//                     name="portfolioLinks.personalPortfolio"
//                     id="personalPortfolio"
//                     value={formData.portfolioLinks.personalPortfolio}
//                     onChange={handleChange}
//                     className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300"
//                     placeholder="https://your-portfolio.com"
//                   />
//                 </div>
//                 {errors['portfolioLinks.personalPortfolio'] && (
//                   <p className="mt-1 text-sm text-red-600">{errors['portfolioLinks.personalPortfolio']}</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => navigate('/profile')}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
//               >
//                 {submitting ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfilePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { getUserProfile, updateUserProfile } from '../../../services/api';
import ProfileImageUpload from '../../../components/profileImageUpload';

// Form validation schema
const profileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  bio: z.string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .nullable(),
  portfolioLinks: z.object({
    linkedin: z.string().url().optional().nullable().or(z.literal('')),
    github: z.string().url().optional().nullable().or(z.literal('')),
    personalPortfolio: z.string().url().optional().nullable().or(z.literal(''))
  }).optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  company: z.string().optional()
});

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    portfolioLinks: { linkedin: '', github: '', personalPortfolio: '' },
    skills: [],
    experience: '',
    company: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          bio: profileData.bio || '',
          portfolioLinks: profileData.portfolioLinks || { linkedin: '', github: '', personalPortfolio: '' },
          skills: profileData.skills || [],
          experience: profileData.experience || '',
          company: profileData.company || ''
        });
      } else {
        toast.error(response.data.message || 'Failed to load profile data');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      toast.error(err.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

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
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateForm = () => {
    try {
      profileSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {};
        err.errors.forEach(error => {
          const path = error.path[0];
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const response = await updateUserProfile(formData);

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        navigate('/profile');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);

      if (err.response?.data?.errors) {
        const newErrors = {};
        err.response.data.errors.forEach(error => {
          newErrors[error.path] = error.msg;
        });
        setErrors(newErrors);
      } else {
        toast.error(err.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D9773]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C3B2E] to-[#6D9773] px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Edit Profile</h1>
              <p className="mt-2 text-[#FFBA00]">Update your personal and professional information</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 border border-transparent rounded-lg text-base font-medium text-[#0C3B2E] bg-[#FFBA00] hover:bg-[#BB8A52] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBA00]"
            >
              Back to Profile
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 sm:p-10">
          <ProfileImageUpload 
            currentImage={profile?.profileImage} 
            onSuccess={handleImageUpdate}
            className="mb-10"
          />

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-lg font-medium text-[#0C3B2E]">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full rounded-lg border-2 px-4 py-3 text-[#0C3B2E] focus:ring-2 focus:ring-[#6D9773] focus:border-transparent transition-all ${
                  errors.name ? 'border-[#BB8A52]' : 'border-[#0C3B2E]/20'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-[#BB8A52]">{errors.name}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-lg font-medium text-[#0C3B2E]">
                About You
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className={`block w-full rounded-lg border-2 px-4 py-3 text-[#0C3B2E] focus:ring-2 focus:ring-[#6D9773] focus:border-transparent transition-all ${
                  errors.bio ? 'border-[#BB8A52]' : 'border-[#0C3B2E]/20'
                }`}
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#0C3B2E]/70">
                  {formData.bio?.length || 0}/500 characters
                </p>
                {errors.bio && (
                  <p className="text-sm text-[#BB8A52]">{errors.bio}</p>
                )}
              </div>
            </div>

            {/* Role-specific sections */}
            {profile?.role === 'freelancer' && (
              <>
                {/* Skills */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-lg font-medium text-[#0C3B2E]">
                      Your Skills
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add a skill (e.g. React, Design)"
                        className="flex-1 rounded-lg border-2 border-[#0C3B2E]/20 px-4 py-3 focus:ring-2 focus:ring-[#6D9773] focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-6 py-3 rounded-lg bg-[#6D9773] text-white font-medium hover:bg-[#0C3B2E] transition-colors duration-300"
                      >
                        Add Skill
                      </button>
                    </div>
                    {errors.skills && (
                      <p className="text-sm text-[#BB8A52]">{errors.skills}</p>
                    )}
                  </div>

                  {/* Skills List */}
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-[#6D9773]/10 text-[#0C3B2E] hover:bg-[#6D9773]/20 transition-colors duration-200"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-[#0C3B2E]/70 hover:text-[#BB8A52] transition-colors duration-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <label htmlFor="experience" className="block text-lg font-medium text-[#0C3B2E]">
                    Professional Experience
                  </label>
                  <textarea
                    name="experience"
                    id="experience"
                    rows={5}
                    value={formData.experience}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border-2 px-4 py-3 text-[#0C3B2E] focus:ring-2 focus:ring-[#6D9773] focus:border-transparent transition-all ${
                      errors.experience ? 'border-[#BB8A52]' : 'border-[#0C3B2E]/20'
                    }`}
                    placeholder="Describe your professional background and experience..."
                  />
                  {errors.experience && (
                    <p className="text-sm text-[#BB8A52]">{errors.experience}</p>
                  )}
                </div>
              </>
            )}

            {profile?.role === 'client' && (
              <div className="space-y-2">
                <label htmlFor="company" className="block text-lg font-medium text-[#0C3B2E]">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border-2 px-4 py-3 text-[#0C3B2E] focus:ring-2 focus:ring-[#6D9773] focus:border-transparent transition-all ${
                    errors.company ? 'border-[#BB8A52]' : 'border-[#0C3B2E]/20'
                  }`}
                  placeholder="Your company name"
                />
                {errors.company && (
                  <p className="text-sm text-[#BB8A52]">{errors.company}</p>
                )}
              </div>
            )}

            {/* Portfolio Links */}
            <div className="space-y-8">
              <div className="border-t border-[#0C3B2E]/10 pt-8">
                <h3 className="text-2xl font-bold text-[#0C3B2E] mb-2">Portfolio Links</h3>
                <p className="text-[#0C3B2E]/70">
                  Add links to showcase your professional work and presence.
                </p>
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <label htmlFor="linkedin" className="block text-lg font-medium text-[#0C3B2E]">
                  LinkedIn Profile
                </label>
                <div className="flex rounded-lg overflow-hidden border-2 border-[#0C3B2E]/20 focus-within:ring-2 focus-within:ring-[#6D9773] focus-within:border-transparent transition-all">
                  <span className="inline-flex items-center px-4 bg-[#0C3B2E]/5">
                    <svg className="w-6 h-6 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </span>
                  <input
                    type="url"
                    name="portfolioLinks.linkedin"
                    id="linkedin"
                    value={formData.portfolioLinks.linkedin}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-4 py-3 focus:outline-none"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
                {errors['portfolioLinks.linkedin'] && (
                  <p className="text-sm text-[#BB8A52]">{errors['portfolioLinks.linkedin']}</p>
                )}
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <label htmlFor="github" className="block text-lg font-medium text-[#0C3B2E]">
                  GitHub Profile
                </label>
                <div className="flex rounded-lg overflow-hidden border-2 border-[#0C3B2E]/20 focus-within:ring-2 focus-within:ring-[#6D9773] focus-within:border-transparent transition-all">
                  <span className="inline-flex items-center px-4 bg-[#0C3B2E]/5">
                    <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </span>
                  <input
                    type="url"
                    name="portfolioLinks.github"
                    id="github"
                    value={formData.portfolioLinks.github}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-4 py-3 focus:outline-none"
                    placeholder="https://github.com/your-username"
                  />
                </div>
                {errors['portfolioLinks.github'] && (
                  <p className="text-sm text-[#BB8A52]">{errors['portfolioLinks.github']}</p>
                )}
              </div>

              {/* Personal Portfolio */}
              <div className="space-y-2">
                <label htmlFor="personalPortfolio" className="block text-lg font-medium text-[#0C3B2E]">
                  Personal Website
                </label>
                <div className="flex rounded-lg overflow-hidden border-2 border-[#0C3B2E]/20 focus-within:ring-2 focus-within:ring-[#6D9773] focus-within:border-transparent transition-all">
                  <span className="inline-flex items-center px-4 bg-[#0C3B2E]/5">
                    <svg className="w-6 h-6 text-[#6D9773]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </span>
                  <input
                    type="url"
                    name="portfolioLinks.personalPortfolio"
                    id="personalPortfolio"
                    value={formData.portfolioLinks.personalPortfolio}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-4 py-3 focus:outline-none"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
                {errors['portfolioLinks.personalPortfolio'] && (
                  <p className="text-sm text-[#BB8A52]">{errors['portfolioLinks.personalPortfolio']}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-8">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-8 py-3 rounded-lg border-2 border-[#0C3B2E] text-[#0C3B2E] font-medium hover:bg-[#0C3B2E]/5 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#6D9773] to-[#0C3B2E] text-white font-medium hover:opacity-90 transition-opacity duration-300 disabled:opacity-70"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;