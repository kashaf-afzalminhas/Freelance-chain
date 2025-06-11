import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';

const ContractContext = createContext();

// List of public paths that don't require authentication
const publicPaths = ['/', '/signin', '/signup', '/jobs', '/browse-projects', '/jobs/', '/projects/'];

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuthData } = useAuth();

  const isPublicRoute = useCallback(() => {
    return publicPaths.some(path => location.pathname.startsWith(path));
  }, [location.pathname]);

  const validateToken = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (!token && !isPublicRoute()) {
      throw new Error('No authentication token found');
    }
    return token;
  }, [isPublicRoute]);

  const fetchContracts = useCallback(async (showToast = true, retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Skip token validation for public routes
      if (isPublicRoute()) {
        setLoading(false);
        return [];
      }
      
      // Validate token before making request
      validateToken();
      
      console.log('Fetching contracts...');
      const response = await api.get('/contracts/user');
      console.log('Contracts response:', response);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Ensure contracts is always an array
      const contractsData = Array.isArray(response.data) ? response.data : 
                          Array.isArray(response.data.contracts) ? response.data.contracts : 
                          [];
      
      console.log('Setting contracts:', contractsData);
      setContracts(contractsData);
      return contractsData;
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401 && !isPublicRoute()) {
        console.log('Unauthorized, redirecting to login');
        clearAuthData();
        navigate('/signin');
        return [];
      }

      // Retry logic for network errors
      if (retryCount < 3 && (error.message.includes('Network Error') || error.response?.status >= 500)) {
        console.log(`Retrying fetch contracts (attempt ${retryCount + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return fetchContracts(showToast, retryCount + 1);
      }

      setError(error.message);
      if (showToast) {
        toast.error('Failed to fetch contracts: ' + error.message);
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [navigate, clearAuthData, validateToken, isPublicRoute]);

  const getContract = useCallback(async (contractId, retryCount = 0) => {
    try {
      // Skip token validation for public routes
      if (isPublicRoute()) {
        return null;
      }

      // Validate token before making request
      validateToken();

      console.log('Fetching contract:', contractId);
      const response = await api.get(`/contracts/${contractId}`);
      console.log('Contract response:', response);

      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Update the contract in the local state
      setContracts(prevContracts => {
        const updatedContracts = prevContracts.map(c => 
          c._id === contractId ? response.data : c
        );
        if (!prevContracts.find(c => c._id === contractId)) {
          updatedContracts.push(response.data);
        }
        console.log('Updated contracts state:', updatedContracts);
        return updatedContracts;
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch contract:', error);

      // Handle authentication errors
      if (error.response?.status === 401 && !isPublicRoute()) {
        console.log('Unauthorized, redirecting to login');
        clearAuthData();
        navigate('/signin');
        throw error;
      }

      // Retry logic for network errors
      if (retryCount < 3 && (error.message.includes('Network Error') || error.response?.status >= 500)) {
        console.log(`Retrying fetch contract (attempt ${retryCount + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return getContract(contractId, retryCount + 1);
      }

      toast.error('Failed to fetch contract details: ' + error.message);
      throw error;
    }
  }, [navigate, clearAuthData, validateToken, isPublicRoute]);

  const signContract = async (contractId, signerAddress, retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Skip token validation for public routes
      if (isPublicRoute()) {
        return null;
      }

      // Validate token before making request
      validateToken();
      
      console.log('Signing contract:', contractId, 'with address:', signerAddress);
      const response = await api.post(`/contracts/${contractId}/sign`, {
        signerAddress
      });
      console.log('Sign contract response:', response);

      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Update the contract in the list with new state
      setContracts(prevContracts => {
        const newContracts = prevContracts.map(c => 
          c._id === contractId ? response.data : c
        );
        console.log('Updated contracts after signing:', newContracts);
        return newContracts;
      });
      
      toast.success('Contract signed successfully');
      return response.data;
    } catch (error) {
      console.error('Sign contract error:', error);

      // Handle authentication errors
      if (error.response?.status === 401 && !isPublicRoute()) {
        console.log('Unauthorized, redirecting to login');
        clearAuthData();
        navigate('/signin');
        throw error;
      }

      // Retry logic for network errors
      if (retryCount < 3 && (error.message.includes('Network Error') || error.response?.status >= 500)) {
        console.log(`Retrying sign contract (attempt ${retryCount + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return signContract(contractId, signerAddress, retryCount + 1);
      }

      setError(error.message);
      toast.error('Failed to sign contract: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of contracts
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchContracts(false).catch(console.error);
    } else if (!isPublicRoute()) {
      setLoading(false);
      navigate('/signin');
    } else {
      setLoading(false);
    }
  }, [fetchContracts, navigate, isPublicRoute]);

  const contextValue = {
    contracts,
    loading,
    error,
    signContract,
    fetchContracts,
    getContract
  };

  console.log('Contract context state:', contextValue);

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContracts must be used within a ContractProvider');
  }
  return context;
};