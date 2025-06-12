import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';
console.log('API_URL used in api.js:', API_URL);

// List of public paths that don't require authentication
const publicPaths = ['/', '/signin', '/signup', '/jobs', '/browse-projects', '/jobs/', '/projects/'];

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log the full URL being requested
  console.log('Making request to:', `${config.baseURL}${config.url}`);
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('isAdmin');
      
      // Only redirect if not on a public route
      const currentPath = window.location.pathname;
      if (!publicPaths.some(path => currentPath.startsWith(path))) {
        window.location.href = '/signin';
      }
    }
    
    // Log the error for debugging
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: `${error.config?.baseURL}${error.config?.url}`
    });
    
    return Promise.reject(error);
  }
);

// Users
export const getAllUsers = () => api.get('/users/all');
export const getUserById = (id) => api.get(`/users/${id}`);
export const searchUsers = (query) => api.get(`/users/search/${query}`);

// Conversations
export const getUserConversations = (userId) => 
  api.get(`/conversations/${userId}`);

export const getConversationBetweenUsers = async (firstUserId, secondUserId) => {
  try {
    const response = await api.get(`/conversations/find/${firstUserId}/${secondUserId}`);
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      // If conversation not found, return null instead of throwing error
      return { data: null };
    }
    throw error;
  }
};

export const createConversation = async (senderId, receiverId) => {
  try {
    const response = await api.post('/conversations', { senderId, receiverId });
    return response;
  } catch (error) {
    console.error('Create conversation error:', error.response?.data || error.message);
    throw error;
  }
};

// Messages
export const getMessagesByConversation = (conversationId) => 
  api.get(`/messages/${conversationId}`);
export const sendMessage = (message) => 
  api.post('/messages', message);
export const markMessageAsRead = (messageId) => 
  api.patch(`/messages/${messageId}/read`); // New route for marking a message as read

//profile 
// export const getUserProfile = () => api.get('/profile');
// export const updateUserProfile = (data) => api.put('/profile', data);
// export const uploadProfileImage = (file) => {
// const formData = new FormData();
// formData.append('profileImage', file);
// return api.post('/profile/image', formData, {
// headers: {
// 'Content-Type': 'multipart/form-data',
// },
// });
// };
//export const getPublicUserProfile = (userId) => api.get(/profile/public/${userId});



// Update the authHeaders function
const authHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Update the profile-related API calls to match backend routes
export const getUserProfile = () => api.get('/profile');

export const updateUserProfile = (data) => {
  console.log('Updating profile with data:', data);
  return api.put('/profile', data);
};

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  return api.post('/profile/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => {
    // Ensure we return the image URL in the expected format
    return {
      data: {
        profileImage: response.data.data.profileImage
      }
    };
  });
};

export const removeProfileImage = () => api.delete('/profile/image');

export const getPublicUserProfile = (userId) => api.get(`/profile/public/${userId}`);

//projects 
export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get project by ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's projects
  getMyProjects: async () => {
    try {
      const response = await api.get('/projects/my-projects');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new project
  createProject: async (formData) => {
    try {
      const response = await api.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error.response?.data?.message || 'Failed to create project';
    }
  },

  // Update a project
  updateProject: async (id, formData) => {
    try {
      const response = await api.patch(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update project error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete a project
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Delete Error:', error);
      throw error.response?.data || error;
    }
  },

  // Upload images
  uploadImages: async (formData) => {
    try {
      const response = await api.post('/projects/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to upload images');
      }
      
      return response.data;
    } catch (error) {
      console.error('Upload images error:', error);
      throw error.response?.data || error.message;
    }
  },
};

export const bidService = {
  submitBid: async (formData) => {
    try {
      // Log the complete bid data
      console.log('Submitting bid with data:', {
        jobId: formData.get('jobId'),
        proposal: formData.get('proposal'),
        bidAmount: formData.get('bidAmount'),
        estimatedTime: formData.get('estimatedTime'),
        freelancerAddress: formData.get('freelancerAddress'),
        files: formData.getAll('bidMedia').map(f => f.name)
      });
      // Log the current token
      const token = localStorage.getItem('authToken');
      console.log('Current auth token:', token);

      const response = await api.post('/bids/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Bid submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Submit bid error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        throw error.response.data;
      }
      throw error;
    }
  },

  // Get bids for a specific job
  getBidsForJob: async (jobId) => {
    try {
      const response = await api.get(`/bids/job/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Get bids error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get bids submitted by current user
  getMyBids: async () => {
    try {
      const response = await api.get('/bids/my-bids');
      return response.data; // Ensure this is an array
    } catch (error) {
      console.error('Get my bids error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get details of a specific bid
  getBidDetails: async (bidId) => {
    try {
      const response = await api.get(`/bids/${bidId}`);
      return response.data;
    } catch (error) {
      console.error('Get bid details error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update a bid
  updateBid: async (id, formData) => {
    try {
      const response = await api.put(`/bids/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update bid error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update bid status
  updateBidStatus: async (bidId, { status }) => {
    try {
      const response = await api.put(`/bids/${bidId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update bid status error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Withdraw a bid
  withdrawBid: async (bidId) => {
    try {
      const response = await api.delete(`/bids/${bidId}`);
      return response.data;
    } catch (error) {
      console.error('Withdraw bid error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get top bids for a job
  getTopBids: async (jobId, limit = 5) => {
    try {
      const response = await api.get(`/bids/top/${jobId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get top bids error:', error);
      throw error.response?.data || error.message;
    }
  }
};

export const jobService = {
  // Get all jobs
  getJobs: async () => {
    try {
      const response = await api.get('/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  saveJob: async (id) => api.post(`/jobs/${id}/save`),
  unsaveJob: async (id) => api.post(`/jobs/${id}/unsave`),
  // Get job by ID
  getJobById: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Get jobs posted by current user
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getMyJobs: async () => {
    try {
      const response = await api.get('/jobs/my-jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching my jobs:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
      throw error.response?.data || error.message;
    }
  },
  // Update job status
  updateJobStatus: async (id, status) => {
    try {
      const response = await api.put(`/jobs/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a job
  deleteJob: async (id) => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a job
  updateJob: async (id, jobData) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit a proposal (if needed)
  submitProposal: async (jobId, proposalData) => {
    try {
      const response = await api.post(`/jobs/${jobId}/proposals`, proposalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
 
};

// Notification settings
export const updateNotificationSettings = async (settings) => {
  return api.patch('/users/me/notification-settings', { notificationSettings: settings });
};
// Saved Jobs
export const saveJob = (jobId) => api.post('/saved-jobs', { jobId });
export const getSavedJobs = () => api.get('/saved-jobs');
export const unsaveJob = (jobId) => api.delete(`/saved-jobs/${jobId}`);

