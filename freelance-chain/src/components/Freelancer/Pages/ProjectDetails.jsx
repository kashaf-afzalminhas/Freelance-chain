import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../../../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const nextSlide = () => {
    if (project?.media) {
      setCurrentSlide((prev) => (prev + 1) % project.media.length);
    }
  };

  const prevSlide = () => {
    if (project?.media) {
      setCurrentSlide((prev) => (prev - 1 + project.media.length) % project.media.length);
    }
  };

  // Status badge styles based on status
  const getStatusStyle = (status) => {
    switch(status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#6D9773]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-[#0C3B2E] text-2xl font-semibold mb-2">Something went wrong</div>
        <div className="text-red-500 text-lg">{error}</div>
        <Link to="/browse-projects" className="mt-6 bg-[#6D9773] hover:bg-opacity-90 text-white px-6 py-2 rounded-lg shadow-md transition-all">
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-[#0C3B2E] text-2xl font-semibold">Project not found</div>
        <Link to="/browse-projects" className="mt-6 bg-[#6D9773] hover:bg-opacity-90 text-white px-6 py-2 rounded-lg shadow-md transition-all">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/browse-projects" className="text-[#6D9773] hover:text-[#0C3B2E] text-sm font-medium transition-colors">
                Projects
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-500 truncate max-w-xs">
                {project.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Project Header Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold text-[#0C3B2E]">{project.title}</h1>
              <span className={`mt-2 md:mt-0 px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${getStatusStyle(project.status)}`}>
                <span className={`w-2 h-2 rounded-full mr-1.5 ${project.status === 'active' ? 'bg-emerald-500' : project.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm">
              <div className="flex items-center text-gray-600">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {project.freelancerName}
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(project.createdAt)}
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {project.category}
              </div>
              <div className="flex items-center font-medium text-[#BB8A52]">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${Number(project.price).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Media Section */}
        {project.media && project.media.length > 0 && (
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100">
              {/* Main Media Display - Adjusted to more professional proportions */}
              <div className="relative max-h-96 bg-gray-100">
                {project.media[currentSlide].type === 'image' ? (
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${project.media[currentSlide].url}`}
                    alt={project.media[currentSlide].name}
                    className="w-full h-full max-h-96 object-contain mx-auto cursor-pointer"
                    onClick={() => handleMediaClick(project.media[currentSlide])}
                  />
                ) : project.media[currentSlide].type === 'video' ? (
                  <video
                    src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${project.media[currentSlide].url}`}
                    controls
                    className="w-full h-full max-h-96 object-contain mx-auto"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center">
                    <div className="text-center p-8">
                      <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-4 text-base font-medium text-gray-900">{project.media[currentSlide].name}</p>
                      <a
                        href={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${project.media[currentSlide].url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm font-medium text-white bg-[#6D9773] hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D9773]"
                      >
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Document
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              {project.media.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
                    aria-label="Previous slide"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
                    aria-label="Next slide"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Media counter */}
              {project.media.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {currentSlide + 1} / {project.media.length}
                </div>
              )}
            </div>

            {/* Thumbnails - Slightly smaller and more uniform */}
            {project.media.length > 1 && (
              <div className="mt-4 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
                {project.media.map((media, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all hover:opacity-90 ${
                      currentSlide === index ? 'ring-2 ring-[#FFBA00] ring-offset-2' : 'border border-gray-200'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="aspect-w-1 aspect-h-1">
                      {media.type === 'image' ? (
                        <img
                          src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${media.url}`}
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                      ) : media.type === 'video' ? (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description Section - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#0C3B2E] border-b border-gray-200 pb-4 mb-6">Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {project.description}
              </div>
            </div>
          </div>
          
          {/* Details Sidebar - 1/3 width on large screens */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#0C3B2E] border-b border-gray-200 pb-4 mb-6">Project Details</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Category</h3>
                  <p className="mt-2 text-lg font-medium text-gray-900 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#BB8A52] mr-2"></span>
                    {project.category}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Budget</h3>
                  <p className="mt-2 text-2xl font-bold text-[#BB8A52]">${Number(project.price).toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Posted On</h3>
                  <p className="mt-2 text-gray-900">{formatDate(project.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</h3>
                  <p className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(project.status)}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${
                      project.status === 'active' ? 'bg-emerald-500' : 
                      project.status === 'completed' ? 'bg-blue-500' : 
                      'bg-amber-500'
                    }`}></span>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </p>
                </div>
              </div>
              
              {/* Call to Action Button */}
              <div className="mt-8">
                <Link 
                  to="/messages/new"
                  state={{ recipientId: project.freelancer._id, projectId: project._id }}
                  className="w-full py-3 px-4 bg-[#FFBA00] hover:bg-opacity-90 text-[#0C3B2E] rounded-lg shadow-md font-bold transition-all flex items-center justify-center"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Freelancer
                </Link>
                <button className="w-full mt-3 py-3 px-4 bg-white border border-[#6D9773] text-[#6D9773] hover:bg-gray-50 rounded-lg font-bold transition-all flex items-center justify-center">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save Project
                </button>
              </div>
            </div>
            
            {/* Freelancer Info Card */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-lg font-bold text-[#0C3B2E] mb-4">About the Freelancer</h2>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-[#6D9773] flex items-center justify-center text-white font-bold text-lg">
                  {project.freelancerName.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{project.freelancerName}</h3>
                  <p className="text-gray-500">Professional Freelancer</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <Link 
                  to={`/profile/public/${project.freelancer._id}`}
                  className="w-full py-2 px-4 bg-[#6D9773] hover:bg-opacity-90 text-white rounded-lg shadow-sm font-medium transition-all flex items-center justify-center"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>
                <Link 
                  to="/messages/new"
                  state={{ recipientId: project.freelancer._id, projectId: project._id }}
                  className="w-full py-2 px-4 bg-white border border-[#6D9773] text-[#6D9773] hover:bg-gray-50 rounded-lg font-medium transition-all flex items-center justify-center"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Modal - Adjusted for more professional dimensions */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full mx-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-4">
              {selectedMedia.type === 'image' ? (
                <img
                  src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${selectedMedia.url}`}
                  alt={selectedMedia.name}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                />
              ) : selectedMedia.type === 'video' ? (
                <video
                  src={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${selectedMedia.url}`}
                  controls
                  className="w-full h-auto max-h-[70vh] mx-auto"
                  autoPlay
                />
              ) : (
                <div className="text-center py-12 bg-white rounded-xl max-w-2xl mx-auto">
                  <svg className="h-20 w-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">{selectedMedia.name}</h3>
                  <p className="mt-2 text-gray-500">Document Preview</p>
                  <div className="mt-6">
                    <a
                      href={`${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${selectedMedia.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#6D9773] hover:bg-opacity-90 transition-all"
                    >
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Document
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Image caption */}
            {selectedMedia.type === 'image' && (
              <div className="text-center mt-4">
                <p className="text-white text-lg font-medium">{selectedMedia.name}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;