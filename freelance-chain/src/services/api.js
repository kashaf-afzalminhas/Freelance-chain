import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users
export const getAllUsers = () => api.get('/users/all');
export const getUserById = (id) => api.get(`/users/${id}`);
export const searchUsers = (query) => api.get(`/users/search/${query}`);

// Conversations
export const getUserConversations = (userId) => 
  api.get(`/conversations/${userId}`);
export const getConversationBetweenUsers = (firstUserId, secondUserId) => 
  api.get(`/conversations/find/${firstUserId}/${secondUserId}`);
export const createConversation = (senderId, receiverId) => 
  api.post('/conversations', { senderId, receiverId });
export const getConversationById = (id) => 
  api.get(`/conversations/conversation/${id}`); // New route for getting a conversation by ID

// Messages
export const getMessagesByConversation = (conversationId) => 
  api.get(`/messages/${conversationId}`);
export const sendMessage = (message) => 
  api.post('/messages', message);
export const markMessageAsRead = (messageId) => 
  api.patch(`/messages/${messageId}/read`); // New route for marking a message as read

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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