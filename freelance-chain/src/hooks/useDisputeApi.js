import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getRequestConfig = (method = 'post', data = null) => {
    const token = localStorage.getItem('authToken');
    const adminWallet = localStorage.getItem('adminWalletAddress');
    const verifiedAdmin = localStorage.getItem('verifiedAdmin');
    
    console.log('Request config check:', {
        hasToken: !!token,
        adminWallet,
        verifiedAdmin,
        method,
        data
    });

    if (!token) {
        throw new Error('No authentication token found');
    }

    if (!adminWallet || verifiedAdmin !== 'true') {
        throw new Error('Admin verification required');
    }

    const normalizedWallet = adminWallet.toLowerCase();
    
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-admin-wallet': normalizedWallet
        }
    };

    if (data) {
        config.data = data;
    }

    console.log('Request config:', config);
    return config;
};

export const useDisputes = () => {
    return useQuery({
        queryKey: ['disputes'],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/admin/disputes`,
                    getRequestConfig('get')
                );

                if (!response.data || !response.data.success) {
                    throw new Error(response.data?.message || 'Failed to fetch disputes');
                }

                return response.data.data || [];
            } catch (error) {
                console.error('Error fetching disputes:', error);
                throw new Error(error.response?.data?.message || error.message || 'Failed to fetch disputes');
            }
        },
        retry: 1,
        staleTime: 30000,
    });
};

export const useDisputeDetails = (contractId) => {
    return useQuery({
        queryKey: ['disputed', contractId],
        queryFn: async () => {
            if (!contractId) return null;

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/admin/disputes/${contractId}`,
                    getRequestConfig('get')
                );

                if (!response.data || !response.data.success) {
                    throw new Error(response.data?.message || 'Failed to fetch dispute details');
                }

                return response.data.data;
            } catch (error) {
                console.error('Error fetching dispute details:', error);
                throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dispute details');
            }
        },
        enabled: !!contractId,
        retry: 1,
        staleTime: 30000,
    });
};

export const useResolveDispute = () => {
    const { account } = useWeb3();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ contractId, clientShare, freelancerShare, adminNote }) => {
            try {
                // Get auth token and verify admin status
                const token = localStorage.getItem('authToken');
                const verifiedAdmin = localStorage.getItem('verifiedAdmin');
                const adminWalletAddress = localStorage.getItem('adminWalletAddress');

                console.log('Resolve dispute check:', {
                    hasToken: !!token,
                    verifiedAdmin,
                    adminWalletAddress,
                    connectedAccount: account,
                    contractId,
                    clientShare,
                    freelancerShare
                });

                if (!token) {
                    throw new Error('No authentication token found');
                }

                if (!account) {
                    throw new Error('No admin wallet connected');
                }

                const normalizedAccount = account.toLowerCase();
                const normalizedStoredWallet = adminWalletAddress?.toLowerCase();

                if (verifiedAdmin !== 'true' || normalizedStoredWallet !== normalizedAccount) {
                    throw new Error('Admin verification required');
                }

                // Validate shares as basis points (0-10000)
                if (clientShare < 0 || clientShare > 10000 || freelancerShare < 0 || freelancerShare > 10000) {
                    throw new Error('Shares must be between 0 and 10000 basis points');
                }

                // Validate total is 10000 basis points
                if (clientShare + freelancerShare !== 10000) {
                    throw new Error('Shares must total 10000 basis points');
                }

                // Validate admin note
                if (!adminNote || typeof adminNote !== 'string' || adminNote.trim() === '') {
                    throw new Error('Admin note is required');
                }

                // Ensure contractId is a number
                const numericContractId = parseInt(contractId);
                if (isNaN(numericContractId)) {
                    throw new Error('Invalid contract ID');
                }

                const requestData = {
                    clientShare,
                    freelancerShare,
                    adminNote
                };

                console.log('Sending resolve dispute request:', {
                    url: `${API_BASE_URL}/admin/disputes/${numericContractId}/resolve`,
                    data: requestData,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-admin-wallet': normalizedStoredWallet
                    }
                });

                const response = await axios.post(
                    `${API_BASE_URL}/admin/disputes/${numericContractId}/resolve`,
                    requestData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'x-admin-wallet': normalizedStoredWallet,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.data.success) {
                    throw new Error(response.data.message || 'Failed to resolve dispute');
                }

                return response.data;
            } catch (error) {
                console.error('Error resolving dispute:', {
                    error,
                    message: error.message,
                    response: error.response?.data,
                    contractId,
                    clientShare,
                    freelancerShare,
                    adminNote,
                    adminWallet: account,
                    verifiedAdmin: localStorage.getItem('verifiedAdmin'),
                    adminWalletAddress: localStorage.getItem('adminWalletAddress')
                });
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['disputes']);
            toast.success('Dispute resolved successfully');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to resolve dispute');
        }
    });
}; 