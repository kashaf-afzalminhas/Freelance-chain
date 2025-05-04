import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Adding token to request:', token); // Debug log
  } else {
    console.warn('No token found in localStorage'); // Debug log
  }
  return config;
});

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data); // Debug log
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message); // Debug log
    return Promise.reject(error);
  }
);

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
      console.error('Create project error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update a project
  updateProject: async (id, projectData) => {
    try {
      const formData = new FormData();
      Object.keys(projectData).forEach(key => {
        if (key === 'images') {
          projectData[key].forEach(file => {
            formData.append('images', file);
          });
        } else if (key === 'existingImages') {
          projectData[key].forEach((url, index) => {
            formData.append(`existingImages[${index}]`, url);
          });
        } else if (key === 'requirements') {
          projectData[key].forEach((req, index) => {
            formData.append(`requirements[${index}]`, req);
          });
        } else {
          formData.append(key, projectData[key]);
        }
      });

      const response = await api.patch(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
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
  submitBid: async (bidData) => {
    try {
      // Log the complete bid data
      console.log('Submitting bid with data:', JSON.stringify(bidData, null, 2));
      
      // Log the current token
      const token = localStorage.getItem('token');
      console.log('Current auth token:', token);

      const response = await api.post('/bids/submit', bidData);
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
      return response.data;
    } catch (error) {
      console.error('Get my bids error:', error);
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
  }
};



