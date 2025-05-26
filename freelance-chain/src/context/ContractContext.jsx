import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractService } from '../services/ContractService';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const contracts = await contractService.getUserContracts();
      setContracts(contracts);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signContract = async (contractId, signerAddress) => {
    try {
      setLoading(true);
      setError(null);
      const result = await contractService.signContract(contractId, signerAddress);
      setContracts(contracts.map(c => 
        c._id === contractId ? { ...c, ...result } : c
      ));
      return result;
    } catch (err) {
      console.error('Sign contract error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        loading,
        error,
        signContract,
        fetchContracts
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => useContext(ContractContext);