// // src/api/profile.js
// import axios from 'axios';

// const BASE_URL = 'http://localhost:5000';
// const authHeaders = (token) => ({
//   headers: { Authorization: `Bearer ${token}` },
// });

// export const getUserProfile = (token) => 
//   axios.get(`${BASE_URL}/profile`, authHeaders(token));

// export const updateUserProfile = (data, token) => 
//   axios.put(`${BASE_URL}/profile`, data, authHeaders(token));

// export const uploadProfileImage = (file, token) => {
//   const formData = new FormData();
//   formData.append('profileImage', file);
//   return axios.post(`${BASE_URL}/profile/image`, formData, authHeaders(token));
// };

// export const getPublicUserProfile = (userId) => 
//   axios.get(`${BASE_URL}/profile/public/${userId}`);
// src/api/profile.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getUserProfile = (token) => 
  axios.get(`${BASE_URL}/profile`, authHeaders(token));

export const updateUserProfile = (data, token) => 
  axios.put(`${BASE_URL}/profile`, data, authHeaders(token));

export const uploadProfileImage = (file, token) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  return axios.post(`${BASE_URL}/profile/image`, formData, authHeaders(token));
};

export const getPublicUserProfile = (userId) => 
  axios.get(`${BASE_URL}/profile/public/${userId}`);
