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
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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


const BASE_URL = 'http://localhost:5000';

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