// ContractService.js
import * as api from './api';

const createContract = async (
    jobId,
    bidId,
    freelancerId,
    bidAmount,
    jobTitle,
    jobDescription,
    deadline
) => {
    const response = await api.post('/contracts', {
        jobId,
        bidId,
        freelancerId,
        bidAmount,
        jobTitle,
        jobDescription,
        deadline
    });
    return response.data;
};

const signContract = async (contractId, signerAddress) => {
    const response = await api.post(`/contracts/${contractId}/sign`, {
        signerAddress
    });
    return response.data;
};

const getContract = async (contractId) => {
    const response = await api.get(`/contracts/${contractId}`);
    return response.data;
};

const getUserContracts = async (userAddress) => {
    const response = await api.get(`/contracts?user=${userAddress}`);
    return response.data;
};

export const contractService = {
    createContract,
    signContract,
    getContract,
    getUserContracts
};