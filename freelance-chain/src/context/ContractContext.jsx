// src/context/ContractContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { contractService } from '../services/ContractService';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const data = await contractService.getUserContracts();
            setContracts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const signContract = async (contractId) => {
        try {
            setLoading(true);
            const result = await contractService.signContract(contractId);
            setContracts(contracts.map(c => 
                c._id === contractId ? { ...c, ...result } : c
            ));
            return result;
        } catch (err) {
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