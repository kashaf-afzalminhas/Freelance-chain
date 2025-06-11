import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../../../services/api';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [projectData, setProjectData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    requirements: [''],
    media: [],
    status: 'active'
  });
  const [objectUrls, setObjectUrls] = useState(new Set());
  const [newMediaFiles, setNewMediaFiles] = useState([]);

  const categories = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'design', label: 'Design' },
    { value: 'writing', label: 'Writing' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const myProjects = await projectService.getMyProjects();
        const currentProject = myProjects.find(p => p._id === id);
        if (currentProject) {
          setProjectData({
            title: currentProject.title,
            category: currentProject.category,
            description: currentProject.description,
            price: currentProject.price,
            requirements: currentProject.requirements || [''],
            media: currentProject.media || [],
            status: currentProject.status
          });
        } else {
          setError('Project not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project for edit:', err);
        setError(err.message || 'Failed to load project details');
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...projectData.requirements];
    newRequirements[index] = value;
    setProjectData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setProjectData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    const newRequirements = projectData.requirements.filter((_, i) => i !== index);
    setProjectData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const allowedTypes = ['image/', 'video/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const isValidType = allowedTypes.some(typePrefix => file.type.startsWith(typePrefix)) ||
                          allowedTypes.includes(file.type);
      const isValidSize = file.size <= 20 * 1024 * 1024;

      if (!isValidType) {
        setImageErrors(prev => ({
          ...prev,
          [file.name]: 'Invalid file type. Supported formats: Images, Videos, PDFs, Docs.'
        }));
        console.warn('Invalid file type selected:', file.type);
      }
      if (!isValidSize) {
        setImageErrors(prev => ({
          ...prev,
          [file.name]: 'File size must be less than 20MB'
        }));
        console.warn('File size too large:', file.size);
      }
      return isValidType && isValidSize;
    });

    // Store the actual files for upload
    setNewMediaFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs for display
    const previewMedia = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      name: file.name,
      fileObject: file
    }));

    // Add preview URLs to objectUrls for cleanup
    previewMedia.forEach(item => setObjectUrls(prev => new Set([...prev, item.url])));

    // Update project data with new media
    setProjectData(prev => ({
      ...prev,
      media: [...prev.media, ...previewMedia]
    }));
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: 'Failed to load media'
    }));
  };

  const removeImage = (index) => {
    const mediaItemToRemove = projectData.media[index];

    if (mediaItemToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(mediaItemToRemove.url);
      setObjectUrls(prev => {
        const newUrls = new Set(prev);
        newUrls.delete(mediaItemToRemove.url);
        return newUrls;
      });
      setNewMediaFiles(prev => prev.filter(file => file !== mediaItemToRemove.fileObject));
       console.log('Removed new media preview. newMediaFiles:', newMediaFiles);
    } else {
       console.log('Marked existing media for removal (will be handled in submit).', mediaItemToRemove);
    }

    setProjectData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));

    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', projectData.title);
      formData.append('category', projectData.category);
      formData.append('description', projectData.description);
      formData.append('price', projectData.price);
      formData.append('status', projectData.status);

      // Handle requirements
      const validRequirements = projectData.requirements.filter(req => req.trim());
      formData.append('requirements', JSON.stringify(validRequirements));

      // Handle existing media
      const existingMediaToKeep = projectData.media.filter(item => !item.url.startsWith('blob:'));
      existingMediaToKeep.forEach(item => {
        formData.append('existingMedia', item.url);
      });

      // Handle new media files
      newMediaFiles.forEach(file => {
        formData.append('media', file);
      });

      await projectService.updateProject(id, formData);
      navigate('/my-projects');
    } catch (err) {
      console.error('Error updating project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update project';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
            <button
              onClick={() => navigate('/my-projects')}
              className="mt-4 text-sm text-red-600 hover:text-red-800"
            >
              Back to My Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Project</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={projectData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={projectData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (in ETH)
              </label>
              <input
                type="number"
                name="price"
                value={projectData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Project Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Requirements
              </label>
              {projectData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="px-3 py-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="mt-2 text-sm text-green-600 hover:text-green-800"
              >
                + Add Requirement
              </button>
            </div>

            {/* Project Media */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Media
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,text/plain,application/zip,application/x-zip-compressed"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Up to 10 files, 20MB each. Supported formats: Images, Videos, PDFs, Docs, Sheets, Presentations, Text, Zips
                  </p>
                </div>
              </div>

              {projectData.media.length > 0 ? (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {projectData.media.map((mediaItem, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                        {mediaItem.type && mediaItem.type.startsWith('image') ? (
                          <img
                            src={mediaItem.url.startsWith('blob:') ? mediaItem.url : `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${mediaItem.url}`}
                            alt={mediaItem.name || 'Project media'}
                            onError={() => handleImageError(index)}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : mediaItem.type === 'video' ? (
                           <video controls src={mediaItem.url.startsWith('blob:') ? mediaItem.url : `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${mediaItem.url}`} className="h-full w-full object-cover object-center" />
                        ) : (
                           <div className="flex flex-col items-center p-4">
                              <svg className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                             <p className="text-xs text-gray-600 text-center truncate w-full px-2">{mediaItem.name || 'Document'}</p>
                           </div>
                        )}
                      </div>
                       {imageErrors[index] && (
                        <p className="mt-1 text-xs text-red-600">{imageErrors[index]}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-center text-gray-500">
                  No media uploaded yet
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={projectData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/my-projects')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject; 