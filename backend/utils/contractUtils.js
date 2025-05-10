const path = require('path');
const { ethers } = require('ethers'); // Changed import syntax
const contract = require('@truffle/contract');
const Web3 = require('web3');

// Correct path to contract artifact
const JobContractArtifact = require(path.join(
  __dirname,
  '../../contracts/build/contracts/JobContract.json'
));

const GANACHE_URL = "http://127.0.0.1:7545";
const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));
const provider = new ethers.providers.JsonRpcProvider(GANACHE_URL); // Corrected syntax
const wallet = provider.getSigner(0); // Added account index

class ContractUtils {
    constructor() {
        this.contractInstance = null;
        this.JobContract = contract(JobContractArtifact);
        this.JobContract.setProvider(new Web3.providers.HttpProvider(GANACHE_URL));
    }

    async initialize() {
        // Connect to Ganache
        this.JobContract.setProvider(new Web3.providers.HttpProvider(GANACHE_URL));
        return await this.JobContract.deployed();
    }

    async deployContract(contractData) {
        try {
            const factory = new ethers.ContractFactory(
                JobContractArtifact.abi,
                JobContractArtifact.bytecode,
                wallet
            );
            
            const deployedContract = await factory.deploy();
            await deployedContract.deployTransaction.wait();
            
            // Convert ETH amount to wei
            const bidAmountWei = ethers.utils.parseEther(contractData.bidAmount.toString());
            
            // Convert deadline to Unix timestamp
            const deadlineUnix = Math.floor(new Date(contractData.deadline).getTime() / 1000);
            
            await deployedContract.createContract(
                contractData.freelancerAddress,
                bidAmountWei,
                deadlineUnix,
                contractData.jobTitle,
                contractData.jobDescription
            );
            
            return {
                address: deployedContract.address,
                transactionHash: deployedContract.deployTransaction.hash
            };
        } catch (err) {
            console.error('Deployment error:', err);
            throw err;
        }
    }

    async getContractState(contractAddress) {
        if (!this.contractInstance) {
            this.contractInstance = new ethers.Contract(
                contractAddress,
                JobContractArtifact.abi,
                wallet
            );
        }
        
        try {
            const contractData = await this.contractInstance.getContract(0);
            return {
                ...contractData,
                // Convert wei back to ETH
                bidAmount: ethers.utils.formatEther(contractData.bidAmount),
                // Convert Unix timestamp to Date
                deadline: new Date(contractData.deadline * 1000)
            };
        } catch (err) {
            console.error('Error getting contract state:', err);
            throw err;
        }
    }
}

module.exports = new ContractUtils();