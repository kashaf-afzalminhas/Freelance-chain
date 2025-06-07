const path = require('path');
const { ethers } = require('ethers');

// Correct path to contract artifact
const JobContractArtifact = require(path.join(
  __dirname,
  '../../contracts/build/contracts/JobContract.json'
));

const GANACHE_URL = "http://127.0.0.1:8545";

class ContractUtils {
    constructor() {
        this.provider = null;
        this.wallet = null;
        this.contractInstance = null;
    }

    async initialize() {
        try {
            // Initialize provider and wallet
            this.provider = new ethers.providers.JsonRpcProvider(GANACHE_URL);
            this.wallet = this.provider.getSigner(0);
            
            console.log('Contract utilities initialized successfully');
            return true;
        } catch (err) {
            console.error('Failed to initialize contract:', err);
            throw new Error('Failed to connect to blockchain network. Please ensure Ganache is running.');
        }
    }

    async deployContract(contractData) {
        try {
            const factory = new ethers.ContractFactory(
                JobContractArtifact.abi,
                JobContractArtifact.bytecode,
                this.wallet
            );
            
            // Deploy the base contract
            const deployedContract = await factory.deploy();
            await deployedContract.deployTransaction.wait();
            
            // Convert ETH amount to wei
            const bidAmountWei = ethers.utils.parseEther(contractData.bidAmount.toString());
            
            // Convert deadline to Unix timestamp
            const deadlineUnix = Math.floor(new Date(contractData.deadline).getTime() / 1000);
            
            // Create the actual job contract
            const tx = await deployedContract.createContract(
                contractData.freelancerAddress,
                bidAmountWei,
                deadlineUnix,
                contractData.jobTitle,
                contractData.jobDescription
            );
            await tx.wait();
            
            this.contractInstance = deployedContract;
            
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
        try {
            const contract = new ethers.Contract(
                contractAddress,
                JobContractArtifact.abi,
                this.wallet
            );
            
            const contractData = await contract.getContract(0);
            return {
                ...contractData,
                bidAmount: ethers.utils.formatEther(contractData.bidAmount),
                deadline: new Date(contractData.deadline.toNumber() * 1000)
            };
        } catch (err) {
            console.error('Error getting contract state:', err);
            throw err;
        }
    }

    async signContract(contractAddress, signerAddress) {
        try {
            const contract = new ethers.Contract(
                contractAddress,
                JobContractArtifact.abi,
                this.wallet
            );
            
            const tx = await contract.signContract(0);
            await tx.wait();
            
            return true;
        } catch (err) {
            console.error('Error signing contract:', err);
            throw err;
        }
    }
}

module.exports = new ContractUtils();