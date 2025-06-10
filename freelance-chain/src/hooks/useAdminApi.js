import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api/admin';

export const useAdminApi = () => {
  const queryClient = useQueryClient();

  // Helper function to get request config
  const getRequestConfig = (method = 'get', data = null) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const walletAddress = '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc';

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    // Add wallet address to request body for all requests
    if (method.toLowerCase() === 'get') {
      config.params = { walletAddress };
    } else {
      config.data = { walletAddress, ...(data || {}) };
    }

    return config;
  };

  // Dashboard Stats
  const useDashboardStats = () => {
    return useQuery({
      queryKey: ['adminStats'],
      queryFn: async () => {
        try {
          const response = await axios({
            url: `${API_BASE_URL}/dashboard/stats`,
            ...getRequestConfig()
          });
          return response.data.data;
        } catch (error) {
          console.error('Dashboard stats error:', error.response?.data);
          throw error;
        }
      }
    });
  };

  // Users
  const useUsers = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: ['adminUsers', page, filters],
      queryFn: async () => {
        try {
          const response = await axios({
            url: `${API_BASE_URL}/users`,
            ...getRequestConfig('get'),
            params: {
              page,
              limit: 10,
              ...filters
            }
          });
          return response.data.data;
        } catch (error) {
          console.error('Users fetch error:', error.response?.data);
          throw error;
        }
      }
    });
  };

  const useUpdateUserStatus = () => {
    return useMutation({
      mutationFn: async ({ userId, status }) => {
        try {
          const response = await axios({
            url: `${API_BASE_URL}/users/${userId}/status`,
            ...getRequestConfig('patch', { status })
          });
          return response.data;
        } catch (error) {
          console.error('Update user status error:', error.response?.data);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['adminUsers']);
        toast.success('User status updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update user status');
      }
    });
  };

  // Jobs
  const useJobs = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: ['adminJobs', page, filters],
      queryFn: async () => {
        const response = await axios({
          url: `${API_BASE_URL}/jobs`,
          ...getRequestConfig('get'),
          params: {
            page,
            limit: 10,
            ...filters
          }
        });
        return response.data.data;
      }
    });
  };

  // Contracts
  const useContracts = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: ['adminContracts', page, filters],
      queryFn: async () => {
        const response = await axios({
          url: `${API_BASE_URL}/contracts`,
          ...getRequestConfig('get'),
          params: {
            page,
            limit: 10,
            ...filters
          }
        });
        return response.data.data;
      }
    });
  };

  // Notifications
  const useSendNotification = () => {
    return useMutation({
      mutationFn: async (notificationData) => {
        const response = await axios({
          url: `${API_BASE_URL}/notifications`,
          ...getRequestConfig('post', notificationData)
        });
        return response.data;
      },
      onSuccess: () => {
        toast.success('Notification sent successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send notification');
      }
    });
  };

  // Data Export
  const useExportData = () => {
    return useMutation({
      mutationFn: async ({ type, startDate, endDate }) => {
        const response = await axios({
          url: `${API_BASE_URL}/export/${type}`,
          ...getRequestConfig('get'),
          params: {
            startDate,
            endDate
          },
          responseType: 'blob'
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${variables.type}_export.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`${variables.type} data exported successfully`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to export data');
      }
    });
  };

  return {
    useDashboardStats,
    useUsers,
    useUpdateUserStatus,
    useJobs,
    useContracts,
    useSendNotification,
    useExportData
  };
};