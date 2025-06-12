import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000/api';

const getRequestConfig = (account, method = 'get', data = null) => {
  const config = {
    method,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'x-admin-wallet': account
    }
  };

  if (data) {
    config.data = data;
  }

  return config;
};

export const useDisputes = () => {
  const { account } = useWeb3();
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

export const useDisputeDetails = (contractId) => {
  const { account } = useWeb3();
  
  return useQuery({
    queryKey: ['adminDisputeDetails', contractId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/admin/disputes/${contractId}`,
        getRequestConfig(account)
      );
      return response.data.dispute;
    },
    enabled: !!account && !!contractId
  });
};

export const useResolveDispute = () => {
  const { account } = useWeb3();
  
  return useMutation({
    mutationFn: async ({ contractId, clientShare, freelancerShare, adminNote }) => {
      const response = await axios.post(
        `${API_BASE_URL}/admin/disputes/${contractId}/resolve`,
        { clientShare, freelancerShare, adminNote },
        getRequestConfig(account, 'post')
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