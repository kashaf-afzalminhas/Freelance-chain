import { api } from './api';
import { ethers } from 'ethers';
import JobContractArtifact from '../../../contracts/build/contracts/JobContract.json';

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

export const contractService = {
  createContract: async (jobId, bidId, freelancerId, freelancerAddress, bidAmount, jobTitle, jobDescription, deadline) => {
    try {
      // 1. Create contract in backend
      const response = await api.post('/contracts', {
        jobId, 
        bidId, 
        freelancerId,
        freelancerAddress,
        bidAmount, 
        jobTitle, 
        jobDescription, 
        deadline
      }, getAuthConfig());

      // 2. Deploy smart contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractFactory = new ethers.ContractFactory(
        JobContractArtifact.abi,
        JobContractArtifact.bytecode,
        signer
      );

      // Convert deadline to Unix timestamp
      const deadlineUnix = Math.floor(new Date(deadline).getTime() / 1000);
      
      // Deploy contract
      const contract = await contractFactory.deploy();
      await contract.waitForDeployment();

      // Create contract instance
      const contractInstance = await contract.createContract(
        freelancerAddress,
        ethers.parseEther(bidAmount.toString()),
        deadlineUnix,
        jobTitle,
        jobDescription
      );
      await contractInstance.wait();

      // 3. Update backend with contract address
      await api.put(`/contracts/${response.data._id}`, {
        contractAddress: await contract.getAddress(),
        transactionHash: contractInstance.hash
      }, getAuthConfig());

      return {
        ...response.data,
        contractAddress: await contract.getAddress(),
        transactionHash: contractInstance.hash
      };
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  },

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
  
  signContract: async (contractId, signerAddress) => {
    try {
      // 1. Get contract details first
      const contractDetails = await contractService.getContract(contractId);
      
      if (!contractDetails.contractAddress) {
        throw new Error('Contract address not found');
      }

      // 2. Sign contract on blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractDetails.contractAddress,
        JobContractArtifact.abi,
        signer
      );

      const tx = await contract.signContract(0);
      await tx.wait();

      // 3. Update backend
      const response = await api.post(
        `/contracts/${contractId}/sign`,
        { signerAddress },
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      console.error('Sign contract error:', error);
      throw error;
    }
  }
};