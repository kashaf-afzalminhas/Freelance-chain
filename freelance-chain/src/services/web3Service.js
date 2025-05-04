import { ethers } from 'ethers';
import ContractFactoryABI from '../abis/ContractFactory.json';
import FreelanceContractABI from '../abis/FreelanceContract.json';

const contractFactoryAddress = process.env.REACT_APP_CONTRACT_FACTORY_ADDRESS;

export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      return {
        provider,
        signer,
        address,
        network: await provider.getNetwork()
      };
    } catch (error) {
      console.error('User denied account access', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask not detected');
  }
};

export const createContract = async (freelancerAddress, milestones, totalAmount, signer) => {
  const contractFactory = new ethers.Contract(
    contractFactoryAddress,
    ContractFactoryABI,
    signer
  );
  
  // Convert milestones for blockchain
  const blockchainMilestones = milestones.map(m => ({
    description: m.description,
    amount: ethers.utils.parseEther(m.amount.toString()),
    deadline: Math.floor(new Date(m.deadline).getTime() / 1000),
    state: 0 // Pending
  }));
  
  const tx = await contractFactory.createContract(
    freelancerAddress,
    blockchainMilestones,
    ethers.utils.parseEther(totalAmount.toString())
  );
  
  const receipt = await tx.wait();
  const contractAddress = receipt.events.find(e => e.event === 'ContractCreated').args.contractAddress;
  
  return contractAddress;
};

export const getContractInstance = (address, signer) => {
  return new ethers.Contract(
    address,
    FreelanceContractABI,
    signer
  );
};