import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useWeb3 } from '../context/Web3Context';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export const useAdminApi = () => {
  const { account } = useWeb3();

  const getRequestConfig = (method = 'get', data = null) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!account) {
      throw new Error('No wallet address found');
    }

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-admin-wallet': account.toLowerCase()
      }
    };

    if (data) {
      config.data = data;
    }

    return config;
  };

  const useDashboardStats = () => {
    return useQuery({
      queryKey: ['adminDashboardStats'],
      queryFn: async () => {
        const response = await axios('http://localhost:5000/api/admin/dashboard/stats', getRequestConfig());
        return response.data.data;
      },
      enabled: !!account
    });
  };

  const useUsers = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: ['adminUsers', page, filters],
      queryFn: async () => {
        const response = await axios('http://localhost:5000/api/admin/users', {
          ...getRequestConfig(),
          params: {
            ...getRequestConfig().params,
            page,
            limit: 10,
            ...filters
          }
        });
        return response.data.data;
      },
      enabled: !!account
    });
  };

  const useUpdateUserStatus = () => {
    return useMutation({
      mutationFn: async ({ userId, status }) => {
        const response = await axios(
          `http://localhost:5000/api/admin/users/${userId}/status`,
          getRequestConfig('patch', { status })
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success('User status updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update user status');
      }
    });
  };

  const useJobs = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: ['adminJobs', page, filters],
      queryFn: async () => {
        const response = await axios('http://localhost:5000/api/admin/jobs', {
          ...getRequestConfig(),
          params: {
            ...getRequestConfig().params,
            page,
            limit: 10,
            ...filters
          }
        });
        return response.data.data;
      },
      enabled: !!account
    });
  };

  const useUpdateJobStatus = () => {
    return useMutation({
      mutationFn: async ({ jobId, status }) => {
        const response = await axios(
          `http://localhost:5000/api/admin/jobs/${jobId}/status`,
          getRequestConfig('patch', { status })
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success('Job status updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update job status');
      }
    });
  };

  const useContracts = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: ['adminContracts', page, filters],
      queryFn: async () => {
        const response = await axios('http://localhost:5000/api/admin/contracts', {
          ...getRequestConfig(),
          params: {
            ...getRequestConfig().params,
            page,
            limit: 10,
            ...filters
          }
        });
        return response.data.data;
      },
      enabled: !!account
    });
  };

  const useDisputes = () => {
    const [disputes, setDisputes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDisputes = async () => {
      if (!account) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/disputes`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'x-admin-wallet': account
          }
        });

        if (response.data.success) {
          setDisputes(response.data.data.disputes);
        } else {
          setError(response.data.message || 'Failed to fetch disputes');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching disputes');
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchDisputes();
    }, [account]);

    return {
      data: disputes,
      isLoading,
      error,
      refetch: fetchDisputes
    };
  };

  const useDisputeDetails = (contractId) => {
    return useQuery({
      queryKey: ['adminDisputeDetails', contractId],
      queryFn: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/disputes/${contractId}`, getRequestConfig());
        return response.data.data;
      },
      enabled: !!account && !!contractId
    });
  };

  const useResolveDispute = () => {
    return useMutation({
      mutationFn: async ({ contractId, clientShare, freelancerShare, adminNote }) => {
        const response = await axios.post(
          `${API_BASE_URL}/admin/disputes/${contractId}/resolve`,
          { 
            clientShare, // in basis points (0-10000)
            freelancerShare, // in basis points (0-10000)
            adminNote 
          },
          getRequestConfig('post')
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success('Dispute resolved successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to resolve dispute');
      }
    });
  };

  const useSendNotification = () => {
    return useMutation({
      mutationFn: async (notificationData) => {
        const response = await axios(
          'http://localhost:5000/api/admin/notifications',
          getRequestConfig('post', notificationData)
        );
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

  const useExportData = () => {
    return useMutation({
      mutationFn: async (type) => {
        const response = await axios(
          `http://localhost:5000/api/admin/export/${type}`,
          getRequestConfig()
        );
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
    useUpdateJobStatus,
    useContracts,
    useDisputes,
    useDisputeDetails,
    useResolveDispute,
    useSendNotification,
    useExportData
  };
};