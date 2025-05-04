const { web3, contractFactory, FreelanceContractABI } = require('../config/web3');
const Job = require('../models/Job');
const Bid = require('../models/Bid');
const Contract = require('../models/Contract');

exports.createSmartContract = async (req, res) => {
  try {
    const { jobId, bidId } = req.body;
    
    // Get job and accepted bid
    const job = await Job.findById(jobId);
    const bid = await Bid.findById(bidId);
    
    if (!job || !bid) {
      return res.status(404).json({ error: 'Job or bid not found' });
    }
    
    // Prepare milestones for smart contract
    const milestones = job.milestones.map(milestone => ({
      description: milestone.description,
      amount: web3.utils.toWei(milestone.amount.toString(), 'ether'),
      deadline: Math.floor(new Date(milestone.deadline).getTime() / 1000),
      state: 0 // Pending
    }));
    
    const totalAmount = web3.utils.toWei(bid.amount.toString(), 'ether');
    
    // Create contract
    const accounts = await web3.eth.getAccounts();
    const result = await contractFactory.methods.createContract(
      bid.freelancer.walletAddress,
      milestones,
      totalAmount
    ).send({ from: job.client.walletAddress });
    
    const contractAddress = result.events.ContractCreated.returnValues.contractAddress;
    
    // Save contract reference in DB
    const newContract = new Contract({
      job: jobId,
      bid: bidId,
      client: job.client,
      freelancer: bid.freelancer,
      contractAddress,
      state: 'created',
      milestones: job.milestones.map(m => ({
        ...m,
        amount: parseFloat(web3.utils.fromWei(m.amount, 'ether')),
        state: 'pending'
      }))
    });
    
    await newContract.save();
    
    // Update job and bid status
    job.status = 'contract_created';
    await job.save();
    
    bid.status = 'accepted';
    await bid.save();
    
    res.status(201).json({
      contractAddress,
      dbContract: newContract
    });
    
  } catch (error) {
    console.error('Error creating smart contract:', error);
    res.status(500).json({ error: 'Failed to create smart contract' });
  }
};

exports.fundContract = async (req, res) => {
  try {
    const { contractId } = req.body;
    const contract = await Contract.findById(contractId);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    const freelanceContract = new web3.eth.Contract(
      FreelanceContractABI,
      contract.contractAddress
    );
    
    const totalAmountWei = web3.utils.toWei(
      contract.milestones.reduce((sum, m) => sum + m.amount, 0).toString(),
      'ether'
    );
    
    await freelanceContract.methods.fundContract().send({
      from: contract.client.walletAddress,
      value: totalAmountWei
    });
    
    contract.state = 'funded';
    await contract.save();
    
    res.json({ message: 'Contract funded successfully' });
    
  } catch (error) {
    console.error('Error funding contract:', error);
    res.status(500).json({ error: 'Failed to fund contract' });
  }
};

// Additional controller methods for milestone submission, approval, etc.