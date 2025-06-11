import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { contractService } from '../services/ContractService';
import { toast } from 'sonner';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize Thirdweb contract
  const { contract } = useContract(import.meta.env.VITE_CONTRACT_ADDRESS);

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

      if (!response.success) {
        console.error('Failed response:', response);
        throw new Error(response.error || 'Failed to fetch contracts');
      }

      // Fetch blockchain state for each contract
      const contractsWithBlockchainState = await Promise.all(
        (response.data || []).map(async (contractData) => {
          try {
            if (contract && contractData.contractId) {
              const blockchainState = await contract.call("getContract", [contractData.contractId]);
              return {
                ...contractData,
                blockchainState: {
                  status: ["created", "client_signed", "freelancer_signed", "work_submitted", "completed", "disputed"][blockchainState.status],
                  clientApproved: blockchainState.clientApproved,
                  freelancerApproved: blockchainState.freelancerApproved,
                  workSubmissionHash: blockchainState.workSubmissionHash,
                  bidAmount: blockchainState.bidAmount.toString(),
                  deadline: new Date(blockchainState.deadline.toNumber() * 1000),
                  fundsDeposited: blockchainState.fundsDeposited.toString()
                }
              };
            }
            return contractData;
          } catch (err) {
            console.error('Error fetching blockchain state:', err);
            return contractData;
          }
        })
      );

      console.log('Setting contracts:', contractsWithBlockchainState);
      setContracts(contractsWithBlockchainState);
      return contractsWithBlockchainState;
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      setError(error.message);
      if (error.response?.status === 401) {
        console.log('Unauthorized, redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/signin');
      }
      if (showToast) {
        toast.error('Failed to fetch contracts: ' + error.message);
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [contract, navigate]);

  const getContract = useCallback(async (contractId) => {
    try {
      console.log('Fetching contract:', contractId);
      const response = await contractService.getContract(contractId);
      console.log('Contract response:', response);

      if (!response.success) {
        console.error('Failed response:', response);
        throw new Error(response.error || 'Failed to fetch contract');
      }
      
      // Fetch blockchain state
      if (contract && response.data.contractId) {
        const blockchainState = await contract.call("getContract", [response.data.contractId]);
        response.data.blockchainState = {
          status: ["created", "client_signed", "freelancer_signed", "work_submitted", "completed", "disputed"][blockchainState.status],
          clientApproved: blockchainState.clientApproved,
          freelancerApproved: blockchainState.freelancerApproved,
          workSubmissionHash: blockchainState.workSubmissionHash,
          bidAmount: blockchainState.bidAmount.toString(),
          deadline: new Date(blockchainState.deadline.toNumber() * 1000),
          fundsDeposited: blockchainState.fundsDeposited.toString()
        };
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
  }, [contract]);

  const signContract = async (contractId, signerAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Signing contract:', contractId, 'with address:', signerAddress);
      const result = await contractService.signContract(contractId, signerAddress);
      console.log('Sign contract response:', result);

      if (!result.success) {
        console.error('Failed response:', result);
        throw new Error(result.error || 'Failed to sign contract');
      }
      
      // Update the contract in the list with new state
      setContracts(prevContracts => {
        const newContracts = prevContracts.map(c => 
          c._id === contractId ? result.data : c
        );
        console.log('Updated contracts after signing:', newContracts);
        return newContracts;
      });
      
      toast.success('Contract signed successfully');
      return result.data;
    } catch (err) {
      console.error('Sign contract error:', err);
      if (err.response?.status === 401) {
        console.log('Unauthorized, redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
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
  if (context === undefined) {
    throw new Error('useContracts must be used within a ContractProvider');
  }
  return context;
};