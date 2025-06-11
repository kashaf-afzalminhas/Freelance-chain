import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractService } from '../services/ContractService';
import { toast } from 'sonner';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuthError = useCallback(() => {
    console.log('Unauthorized, redirecting to login');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    if (navigate) {
      navigate('/signin');
    }
  }, [navigate]);

  // Helper function to merge blockchain state with contract data
  const mergeBlockchainState = useCallback((contract) => {
    if (!contract || !contract.blockchainState) return contract;
    
    // Create a new object with the merged state
    const mergedContract = {
      ...contract,
      // Directly use the backend-derived flags
      clientApproved: contract.blockchainState.clientApproved,
      freelancerApproved: contract.blockchainState.freelancerApproved,
      // Use blockchain status as source of truth
      status: contract.blockchainState.status,
      // Preserve the original blockchain state
      blockchainState: contract.blockchainState
    };

    console.log('Merged contract state:', {
      contractId: contract._id,
      original: {
        clientApproved: contract.clientApproved,
        freelancerApproved: contract.freelancerApproved,
        status: contract.status
      },
      blockchain: {
        clientApproved: contract.blockchainState.clientApproved,
        freelancerApproved: contract.blockchainState.freelancerApproved,
        status: contract.blockchainState.status
      },
      merged: {
        clientApproved: mergedContract.clientApproved,
        freelancerApproved: mergedContract.freelancerApproved,
        status: mergedContract.status
      }
    });

    return mergedContract;
  }, []);

  // Helper function to update contracts state with deep equality check
  const updateContractsState = useCallback((newContract) => {
    setContracts(prevContracts => {
      const updated = prevContracts.map(c => 
        c._id === newContract._id ? { ...newContract } : { ...c }
      );
      
      // Deep equality check to prevent unnecessary re-renders
      if (JSON.stringify(updated) === JSON.stringify(prevContracts)) {
        return prevContracts;
      }
      return updated;
    });
  }, []);

  const fetchContracts = useCallback(async (showToast = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        throw new Error('Authentication required');
      }

      console.log('Fetching contracts...');
      const response = await contractService.getUserContracts();
      console.log('Contracts response:', response);

      // Merge blockchain state with each contract
      const mergedContracts = (response || []).map(mergeBlockchainState);
      console.log('Merged contracts with blockchain state:', mergedContracts);

      setContracts(mergedContracts);
      return mergedContracts;
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      setError(error.message);
      if (error.response?.status === 401) {
        handleAuthError();
      }
      if (showToast) {
        toast.error('Failed to fetch contracts: ' + error.message);
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, mergeBlockchainState]);

  const getContract = useCallback(async (contractId) => {
    try {
      console.log('Fetching contract:', contractId);
      const response = await contractService.getContract(contractId);
      console.log('Contract response from backend:', response);

      if (!response) {
        console.warn('No response from getContract for ID:', contractId);
        return null;
      }

      // Merge blockchain state with the contract
      const mergedContract = mergeBlockchainState(response);
      console.log('Merged contract with blockchain state:', mergedContract);

      // Update the contract in the local state
      updateContractsState(mergedContract);
      
      return mergedContract;
    } catch (error) {
      console.error('Failed to fetch contract:', error);
      toast.error('Failed to fetch contract details: ' + error.message);
      throw error;
    }
  }, [mergeBlockchainState, updateContractsState]);

  const signContract = async (contractId, signerAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      // Optimistic update
      const optimisticContract = contracts.find(c => c._id === contractId);
      if (optimisticContract) {
        updateContractsState({
          ...optimisticContract,
          clientApproved: true,
          status: 'ClientSigned'
        });
      }
      
      console.log('Signing contract:', contractId, 'with address:', signerAddress);
      const result = await contractService.signContract(contractId, signerAddress);
      console.log('Sign contract response (from backend):', result);

      // Merge blockchain state with the signed contract
      const mergedContract = mergeBlockchainState(result);
      console.log('Merged contract after signing:', mergedContract);

      // Update the contract in the list with the merged data
      updateContractsState(mergedContract);

      toast.success('Contract signed successfully');
      return mergedContract;
    } catch (err) {
      console.error('Sign contract error:', err);
      // Revert optimistic update on error
      const originalContract = contracts.find(c => c._id === contractId);
      if (originalContract) {
        updateContractsState({
          ...originalContract,
          clientApproved: false,
          status: 'Draft'
        });
      }
      if (err.response?.status === 401) {
        handleAuthError();
      }
      setError(err.message);
      toast.error('Failed to sign contract: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const freelancerSignContract = async (contractId, signerAddress) => {
    try {
      setLoading(true);
      setError(null);

      // Optimistic update for freelancer signing
      const optimisticContract = contracts.find(c => c._id === contractId);
      if (optimisticContract) {
        updateContractsState({
          ...optimisticContract,
          freelancerApproved: true,
          // Assuming status becomes 'BothSigned' if client is already signed,
          // otherwise 'FreelancerSigned'. The backend should handle this logic,
          // but this optimistic update provides immediate feedback.
          status: optimisticContract.clientApproved ? 'BothSigned' : 'FreelancerSigned'
        });
      }

      console.log('Freelancer signing contract:', contractId, 'with address:', signerAddress);
      // Call the backend service function for freelancer signing
      // NOTE: This assumes contractService.freelancerSignContract exists or
      // contractService.signContract handles freelancer role correctly.
      // If your contractService only has one signContract function, ensure it
      // determines the role based on the signer address.
      const result = await contractService.freelancerSignContract(contractId, signerAddress);
      console.log('Freelancer sign contract response (from backend):', result);

      // Merge blockchain state with the signed contract
      const mergedContract = mergeBlockchainState(result);
      console.log('Merged contract after freelancer signing:', mergedContract);

      // Update the contract in the list with the merged data
      updateContractsState(mergedContract);

      toast.success('Contract signed successfully as freelancer');
      return mergedContract;
    } catch (err) {
      console.error('Freelancer sign contract error:', err);
      // Revert optimistic update on error
       const originalContract = contracts.find(c => c._id === contractId);
      if (originalContract) {
        updateContractsState(originalContract); // Revert to original state
      }
      if (err.response?.status === 401) {
        handleAuthError();
      }
      setError(err.message);
      toast.error('Failed to sign contract as freelancer: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const depositFunds = useCallback(async (contractId, amount) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await contractService.depositFunds(contractId, amount);
      
      // Merge blockchain state with the updated contract
      const mergedContract = mergeBlockchainState(response);
      
      // Update the contract in the list with new state
      updateContractsState(mergedContract);
      
      toast.success('Funds deposited successfully');
      return mergedContract;
    } catch (err) {
      console.error('Deposit funds error:', err);
      setError(err.message);
      toast.error('Failed to deposit funds: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mergeBlockchainState, updateContractsState]);

  // Initial fetch of contracts
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Initial contract fetch - token exists:', !!token);
    if (token) {
      fetchContracts(false).catch(console.error);
    } else {
      setLoading(false);
    }
  }, [fetchContracts]);

  const contextValue = {
    contracts,
    loading,
    error,
    signContract,
    freelancerSignContract,
    depositFunds,
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