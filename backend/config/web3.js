// config/web3.js
const Web3 = require('web3');
const { CONTRACT_ABI } = require('./contractABI');

// Initialize Web3 with the provider URL
const web3 = new Web3(process.env.PROVIDER_URL || 'https://rpc-vanguard.vanarchain.com');

// Contract address - use environment variable or default to our deployed address
const contractAddress = process.env.CONTRACT_ADDRESS || '0x19c5e8e78fc12F5381138A87ca30f87D08EE818e';

// Create contract instance
const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

module.exports = {
    web3,
    contract
};
