// services/contractService.js
const Contract = require('../models/Contract');
const Job = require('../models/Job');
const Bid = require('../models/Bid');
const { web3, contractFactory } = require('../config/web3');

exports.createContract = async (freelancerAddress, milestones, totalAmount, clientAddress) => {
  try {
    // Convert milestones to the format expected by the smart contract
    const contractMilestones = milestones.map(milestone => ({
      description: milestone.description,
      amount: web3.utils.toWei(milestone.amount.toString(), 'ether'),
      deadline: Math.floor(new Date(milestone.deadline).getTime() / 1000),
      state: 0 // Pending
    }));

    const totalAmountWei = web3.utils.toWei(totalAmount.toString(), 'ether');

    // Create contract through factory
    const tx = await contractFactory.methods.createContract(
      freelancerAddress,
      contractMilestones,
      totalAmountWei
    ).send({ from: clientAddress });

    // Get the contract address from the event logs
    const event = tx.events.ContractCreated;
    const contractAddress = event.returnValues.contractAddress;

    return {
      contractAddress,
      txHash: tx.transactionHash
    };
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
};

exports.getContractState = async (contractAddress) => {
  const contract = new web3.eth.Contract(FreelanceContractABI, contractAddress);
  
  const [
    isFunded,
    isCompleted,
    isSignedByClient,
    isSignedByFreelancer,
    milestonesCount
  ] = await Promise.all([
    contract.methods.isFunded().call(),
    contract.methods.isCompleted().call(),
    contract.methods.isSignedByClient().call(),
    contract.methods.isSignedByFreelancer().call(),
    contract.methods.milestonesCount().call()
  ]);

  const milestones = [];
  for (let i = 0; i < milestonesCount; i++) {
    const milestone = await contract.methods.milestones(i).call();
    milestones.push({
      description: milestone.description,
      amount: web3.utils.fromWei(milestone.amount, 'ether'),
      deadline: new Date(milestone.deadline * 1000),
      state: ['pending', 'submitted', 'approved', 'rejected'][milestone.state]
    });
  }

  return {
    isFunded,
    isCompleted,
    isSignedByClient,
    isSignedByFreelancer,
    milestones
  };
};