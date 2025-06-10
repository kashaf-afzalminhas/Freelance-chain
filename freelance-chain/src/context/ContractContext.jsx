import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { clearAuthData } = useAuth();

  const fetchContracts = useCallback(async (showToast = true) => {
    try {
      setLoading(true);
      setError(null);
      
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
      setError(error.message);
      if (error.response?.status === 401) {
        console.log('Unauthorized, redirecting to login');
        clearAuthData();
        navigate('/signin');
      }
      if (showToast) {
        toast.error('Failed to fetch contracts: ' + error.message);
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [navigate, clearAuthData]);

  const getContract = useCallback(async (contractId) => {
    try {
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
      toast.error('Failed to fetch contract details: ' + error.message);
      throw error;
    }
  }, []);

  const signContract = async (contractId, signerAddress) => {
    try {
      setLoading(true);
      setError(null);
      
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
    } catch (err) {
      console.error('Sign contract error:', err);
      if (err.response?.status === 401) {
        console.log('Unauthorized, redirecting to login');
        clearAuthData();
        navigate('/signin');
      }
      setError(err.message);
      toast.error('Failed to sign contract: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of contracts
  useEffect(() => {
    fetchContracts(false).catch(console.error);
  }, [fetchContracts]);

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