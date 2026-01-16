// services/web3Service.js
import Web3 from 'web3';
import FreelanceContractABI from '../abis/FreelanceContract.json';
import ContractFactoryABI from '../abis/ContractFactory.json';

const CONTRACT_FACTORY_ADDRESS = process.env.REACT_APP_CONTRACT_FACTORY_ADDRESS;

export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      return web3;
    } catch (error) {
      console.error('User denied account access');
      throw error;
    }
  } else {
    console.error('MetaMask not detected');
    throw new Error('Please install MetaMask');
  }
};

export const getContractInstance = async (contractAddress) => {
  const web3 = await initWeb3();
  return new web3.eth.Contract(FreelanceContractABI, contractAddress);
};

export const getContractFactoryInstance = async () => {
  const web3 = await initWeb3();
  return new web3.eth.Contract(ContractFactoryABI, CONTRACT_FACTORY_ADDRESS);
};

export const createContract = async (freelancerAddress, milestones, totalAmount, signer) => {
  const factory = await getContractFactoryInstance();
  
  // Convert milestones to the format expected by the smart contract
  const contractMilestones = milestones.map(milestone => ({
    description: milestone.description,
    amount: Web3.utils.toWei(milestone.amount.toString(), 'ether'),
    deadline: Math.floor(new Date(milestone.deadline).getTime() / 1000),
    state: 0 // Pending
  }));

  const totalAmountWei = Web3.utils.toWei(totalAmount.toString(), 'ether');

  const tx = await factory.methods.createContract(
    freelancerAddress,
    contractMilestones,
    totalAmountWei
  ).send({ from: signer });

  // Get the contract address from the event logs
  const event = tx.events.ContractCreated;
  return event.returnValues.contractAddress;
};