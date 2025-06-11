// frontend/services/ContractService.js
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { api } from './api';

const getAuthConfig = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const useJobContract = () => {
  return useContract(import.meta.env.VITE_CONTRACT_ADDRESS);
};

export const contractService = {
  getUserContracts: async () => {
    try {
      const response = await api.get('/contracts/user', getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Get user contracts error:', error);
      throw error;
    }
  },

  getContract: async (contractId) => {
    try {
      const response = await api.get(`/contracts/${contractId}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Get contract error:', error);
      throw error;
    }
  },

  createContract: async (jobId, bidId, freelancerId, freelancerAddress, bidAmount, jobTitle, jobDescription, deadline) => {
    try {
      const { contract } = useJobContract();
      const deadlineUnix = Math.floor(new Date(deadline).getTime() / 1000);
      
      const tx = await contract.call("createContract", [
        freelancerAddress,
        ethers.utils.parseEther(bidAmount.toString()),
        deadlineUnix,
        jobTitle,
        jobDescription
      ]);
      
      const receipt = await tx.wait();
      const contractId = receipt.events.find(e => e.event === "ContractCreated").args.contractId;

      // Save to backend
      const response = await api.post('/contracts', {
        jobId, 
        bidId, 
        freelancerId,
        freelancerAddress,
        bidAmount, 
        jobTitle, 
        jobDescription, 
        deadline,
        contractId: contractId.toString()
      }, getAuthConfig());

      return {
        ...response.data,
        contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
        contractId: contractId.toString(),
        transactionHash: tx.hash
      };
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  },

  getContractState: async (contractId) => {
    const { contract } = useJobContract();
    try {
      const contractData = await contract.call("getContract", [contractId]);
      return {
        client: contractData.client,
        freelancer: contractData.freelancer,
        bidAmount: ethers.utils.formatEther(contractData.bidAmount),
        deadline: new Date(contractData.deadline.toNumber() * 1000),
        jobTitle: contractData.jobTitle,
        jobDescription: contractData.jobDescription,
        status: ["created", "client_signed", "freelancer_signed", "work_submitted", "completed", "disputed"][contractData.status],
        workSubmissionHash: contractData.workSubmissionHash,
        fundsDeposited: ethers.utils.formatEther(contractData.fundsDeposited),
        clientApproved: contractData.clientApproved,
        freelancerApproved: contractData.freelancerApproved
      };
    } catch (error) {
      console.error('Get contract state error:', error);
      throw error;
    }
  },

  signContract: async (contractId, signerAddress) => {
    try {
      const { contract } = useJobContract();
      const tx = await contract.call("signContract", [contractId]);
      await tx.wait();

      // Update backend
      const response = await api.post(`/contracts/${contractId}/sign`, {
        signerAddress
      }, getAuthConfig());

      return response.data;
    } catch (error) {
      console.error('Sign contract error:', error);
      throw error;
    }
  },

  depositFunds: async (contractId, amount) => {
    try {
      const { contract } = useJobContract();
      const tx = await contract.call("depositFunds", [contractId], {
        value: ethers.utils.parseEther(amount.toString())
      });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Deposit funds error:', error);
      throw error;
    }
  },

  submitWork: async (contractId, workHash) => {
    try {
      const { contract } = useJobContract();
      const tx = await contract.call("submitWork", [contractId, workHash]);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Submit work error:', error);
      throw error;
    }
  },

  approveWork: async (contractId) => {
    try {
      const { contract } = useJobContract();
      const tx = await contract.call("approveWork", [contractId]);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Approve work error:', error);
      throw error;
    }
  },

  raiseDispute: async (contractId) => {
    try {
      const { contract } = useJobContract();
      const disputeFee = await contract.call("disputeFee");
      const tx = await contract.call("raiseDispute", [contractId], {
        value: disputeFee
      });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Raise dispute error:', error);
      throw error;
    }
  },

  requestRefund: async (contractId) => {
    try {
      const { contract } = useJobContract();
      const tx = await contract.call("requestRefund", [contractId]);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Request refund error:', error);
      throw error;
    }
  }
};