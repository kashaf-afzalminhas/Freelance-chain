const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const { ethers } = require("ethers");
require('dotenv').config();

class ContractUtils {
    constructor() {
        this.sdk = null;
        this.contract = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return true;

        try {
            // Validate environment variables
            this.validateEnvironment();

            // Format and validate private key
            const formattedPrivateKey = this.formatPrivateKey(process.env.PRIVATE_KEY);

            // Initialize SDK
            this.sdk = await ThirdwebSDK.fromPrivateKey(
                formattedPrivateKey,
                process.env.NETWORK_URL || "mumbai"
            );

            // Get contract instance using the contract address
            this.contract = await this.sdk.getContract(
                process.env.CONTRACT_ADDRESS
            );

            console.log('✅ Contract utilities initialized successfully');
            this.initialized = true;
            return true;
        } catch (err) {
            console.error('❌ Failed to initialize contract utilities:', err.message);
            throw new Error(`Contract initialization failed: ${err.message}`);
        }
    }

    validateEnvironment() {
        if (!process.env.PRIVATE_KEY) {
            throw new Error('PRIVATE_KEY is not set in environment variables');
        }
        if (!process.env.CONTRACT_ADDRESS) {
            throw new Error('CONTRACT_ADDRESS is not set in environment variables');
        }
        if (!process.env.CONTRACT_ADDRESS.match(/^0x[a-fA-F0-9]{40}$/)) {
            throw new Error('CONTRACT_ADDRESS is not a valid Ethereum address');
        }
    }

    formatPrivateKey(privateKey) {
        // Remove whitespace
        const trimmedKey = privateKey.trim();
        
        // Check if it's already properly formatted
        if (trimmedKey.match(/^0x[0-9a-fA-F]{64}$/)) {
            return trimmedKey;
        }
        
        // Check if it's hex without 0x prefix
        if (trimmedKey.match(/^[0-9a-fA-F]{64}$/)) {
            return `0x${trimmedKey}`;
        }

        throw new Error('Invalid private key format. Must be 64-character hex string (with or without 0x prefix)');
    }

    async deployContract(contractData) {
        if (!this.initialized) await this.initialize();

        try {
            // Validate contract data
            if (!contractData.freelancerAddress || 
                !contractData.bidAmount || 
                !contractData.deadline || 
                !contractData.jobTitle || 
                !contractData.jobDescription) {
                throw new Error('Missing required contract data');
            }

            // Convert values to correct formats
            const deadlineUnix = Math.floor(new Date(contractData.deadline).getTime() / 1000);
            const bidAmountWei = ethers.utils.parseEther(contractData.bidAmount.toString());

            // Deploy the contract
            const contract = await this.sdk.deployer.deployContractFromUri(
                process.env.CONTRACT_URI,
                [
                    contractData.freelancerAddress,
                    bidAmountWei,
                    deadlineUnix,
                    contractData.jobTitle,
                    contractData.jobDescription
                ]
            );

            console.log(`📜 Contract deployed at ${contract.address}`);
            console.log(`🔗 Transaction hash: ${contract.deployTransaction.hash}`);

            return {
                address: contract.address,
                transactionHash: contract.deployTransaction.hash
            };
        } catch (err) {
            console.error('❌ Contract deployment failed:', err.message);
            throw new Error(`Deployment failed: ${err.message}`);
        }
    }

    async getContractState(contractId) {
        if (!this.initialized) await this.initialize();

        try {
            if (isNaN(contractId)) {
                throw new Error('Contract ID must be a number');
            }

            const contractData = await this.contract.call("getContract", [contractId]);
            
            return {
                status: ["created", "client_signed", "freelancer_signed", "work_submitted", "completed", "disputed"][contractData.status],
                client: contractData.client,
                freelancer: contractData.freelancer,
                clientApproved: contractData.clientApproved,
                freelancerApproved: contractData.freelancerApproved,
                workSubmissionHash: contractData.workSubmissionHash,
                bidAmount: ethers.utils.formatEther(contractData.bidAmount),
                deadline: new Date(contractData.deadline.toNumber() * 1000),
                fundsDeposited: ethers.utils.formatEther(contractData.fundsDeposited)
            };
        } catch (err) {
            console.error('❌ Failed to get contract state:', err.message);
            throw new Error(`Failed to get contract state: ${err.message}`);
        }
    }

    async signContract(contractId) {
        if (!this.initialized) await this.initialize();

        try {
            const tx = await this.contract.call("signContract", [contractId]);
            const receipt = await tx.wait();
            
            console.log(`✅ Contract ${contractId} signed successfully`);
            console.log(`🔗 Transaction hash: ${receipt.transactionHash}`);
            
            return {
                success: true,
                transactionHash: receipt.transactionHash
            };
        } catch (err) {
            console.error('❌ Failed to sign contract:', err.message);
            throw new Error(`Signing failed: ${err.message}`);
        }
    }

    async depositFunds(contractId, amount) {
        if (!this.initialized) await this.initialize();

        try {
            const tx = await this.contract.call("depositFunds", [contractId], {
                value: ethers.utils.parseEther(amount.toString())
            });
            const receipt = await tx.wait();
            
            console.log(`💰 ${amount} ETH deposited to contract ${contractId}`);
            console.log(`🔗 Transaction hash: ${receipt.transactionHash}`);
            
            return {
                success: true,
                transactionHash: receipt.transactionHash
            };
        } catch (err) {
            console.error('❌ Failed to deposit funds:', err.message);
            throw new Error(`Deposit failed: ${err.message}`);
        }
    }

    async submitWork(contractId, workHash) {
        if (!this.initialized) await this.initialize();

        try {
            if (!workHash || typeof workHash !== 'string') {
                throw new Error('Invalid work hash');
            }

            const tx = await this.contract.call("submitWork", [contractId, workHash]);
            const receipt = await tx.wait();
            
            console.log(`📤 Work submitted to contract ${contractId}`);
            console.log(`🔗 Transaction hash: ${receipt.transactionHash}`);
            
            return {
                success: true,
                transactionHash: receipt.transactionHash
            };
        } catch (err) {
            console.error('❌ Failed to submit work:', err.message);
            throw new Error(`Work submission failed: ${err.message}`);
        }
    }

    async approveWork(contractId) {
        if (!this.initialized) await this.initialize();

        try {
            const tx = await this.contract.call("approveWork", [contractId]);
            const receipt = await tx.wait();
            
            console.log(`👍 Work approved for contract ${contractId}`);
            console.log(`🔗 Transaction hash: ${receipt.transactionHash}`);
            
            return {
                success: true,
                transactionHash: receipt.transactionHash
            };
        } catch (err) {
            console.error('❌ Failed to approve work:', err.message);
            throw new Error(`Work approval failed: ${err.message}`);
        }
    }

    async raiseDispute(contractId) {
        if (!this.initialized) await this.initialize();

        try {
            const disputeFee = await this.contract.call("disputeFee");
            const tx = await this.contract.call("raiseDispute", [contractId], {
                value: disputeFee
            });
            const receipt = await tx.wait();
            
            console.log(`⚖️ Dispute raised for contract ${contractId}`);
            console.log(`🔗 Transaction hash: ${receipt.transactionHash}`);
            
            return {
                success: true,
                transactionHash: receipt.transactionHash
            };
        } catch (err) {
            console.error('❌ Failed to raise dispute:', err.message);
            throw new Error(`Dispute raising failed: ${err.message}`);
        }
    }
}

module.exports = new ContractUtils();