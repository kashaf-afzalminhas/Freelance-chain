import { api } from './api';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const contractService = {
  createContract: async (jobId, bidId, freelancerId, bidAmount, jobTitle, jobDescription, deadline) => {
    try {
      const response = await api.post('/contracts', {
        jobId, bidId, freelancerId, bidAmount, jobTitle, jobDescription, deadline
      }, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  },

  getContract: async (contractId) => {
    try {
      const response = await api.get(`/contracts/${contractId}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Get contract error:', error);
      throw error;
    }
  },

  getUserContracts: async () => {
    try {
      const response = await api.get('/contracts/my-contracts', getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Get user contracts error:', error);
      throw error;
    }
  },
  
  signContract: async (contractId, signerAddress) => {
    try {
      const response = await api.post(
        `/contracts/${contractId}/sign`,
        { signerAddress },
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Sign contract error:', error);
      throw error;
    }
  }
};