const { ethers } = require('ethers');
// Removed dotenv require as it's now in web3Utils
// require('dotenv').config();
const { CONTRACT_ABI } = require('../config/contractABI');
const JobContractAddress = process.env.CONTRACT_ADDRESS || '0x960Ea62774d166FF796415451ca4410a3A8693eb'; // Still need contract address

// Import getProvider and getSigner from web3Utils
const { getProvider, getSigner } = require('./web3Utils');

// Remove provider and contract variables as they will be obtained from web3Utils
// let provider;
// let contract;

// Network configuration for Vanguard
const vanguardNetwork = {
    name: 'Vanguard',
    chainId: 78600,
    ensAddress: null
};

// Helper function to validate addresses
const validateAddress = (address) => {
    if (!ethers.utils.isAddress(address)) {
        throw new Error(`Invalid address: ${address}`);
    }
    return ethers.utils.getAddress(address); // Normalize to checksum address
};

// Update createContract to use getSigner
const createContract = async (contractData, signer) => {
    try {
        // Get provider and signer from centralized utility
        const provider = getProvider();
        const signerInstance = getSigner(); // Use getSigner here

        // Use the JobContractAddress and ABI with the obtained signer/provider
        const contractInstance = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signerInstance);

        // Validate and normalize addresses
        const freelancerAddress = validateAddress(contractData.freelancerAddress);
        const signerAddress = validateAddress(await signerInstance.getAddress());

        const tx = await contractInstance.createContract(
            freelancerAddress,
            ethers.utils.parseEther(contractData.bidAmount.toString()),
            Math.floor(new Date(contractData.deadline).getTime() / 1000),
            contractData.jobTitle,
            contractData.jobDescription
        );

        const receipt = await tx.wait();
        const event = receipt.events?.find(e => e.event === 'ContractCreated');

        if (!event) throw new Error('ContractCreated event missing');

        return {
            address: JobContractAddress,
            contractId: event.args.contractId.toString(),
            transactionHash: tx.hash
        };
    } catch (error) {
        console.error('Create contract error:', {
            error,
            message: error.message,
            data: error.data,
            code: error.code,
            stack: error.stack
        });
        
        // Enhanced error handling
        let errorMessage = 'Contract creation failed';
        if (error.code === 'UNSUPPORTED_OPERATION') {
            errorMessage = 'Network operation not supported';
        } else if (error.code === 'INVALID_ARGUMENT') {
            errorMessage = 'Invalid address provided';
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            errorMessage = 'Insufficient funds for transaction';
        }
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};

// Update getContractState to use getProvider
const getContractState = async (contractAddress, contractId, signer, txHash = null) => {
    try {
        // Get provider from centralized utility
        const provider = getProvider();

        let contractInstance;
        console.log('[getContractState] Creating contract instance for state fetch');
        if (contractAddress) {
            // Explicitly disable CCIP Read to prevent potential ENS issues
            contractInstance = new ethers.Contract(contractAddress, CONTRACT_ABI, signer || provider, { enableCcipRead: false });
        } else {
            // Explicitly disable CCIP Read here too if contract address is not provided (uses the initialized contract)
            contractInstance = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signer || provider, { enableCcipRead: false });
        }

        // Convert contractId if needed
        let id;
        if (typeof contractId === 'string' && contractId.length === 24) {
            const Contract = require('../models/Contract');
            const contractDoc = await Contract.findById(contractId);
            if (!contractDoc) throw new Error('Contract not found in database');
            id = contractDoc.contractId;
        } else {
            try {
                id = parseInt(contractId, 10);
                if (isNaN(id) || id < 0) { throw new Error('Invalid contract ID format or value'); }
            } catch(e) { throw new Error('Invalid contract ID provided'); }
        }

        console.log('[getContractState] Fetching contract with blockchain ID:', id);

        // If we have a transaction hash, wait for it to be mined and get the block number
        let minBlockNumber = 0;
        if (txHash) {
            console.log('[getContractState] Waiting for transaction to be fully confirmed:', txHash);
            try {
                const receipt = await provider.waitForTransaction(txHash, 2);
                minBlockNumber = receipt.blockNumber;
                console.log('[getContractState] Transaction confirmed at block:', minBlockNumber);
            } catch (waitError) {
                console.warn(`[getContractState] Error waiting for transaction confirmations for ${txHash}:`, waitError.message);
            }
        }

        const MAX_RETRIES = 8;
        const BASE_DELAY_MS = 2000;
        let state = null;
        let lastError = null;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const currentBlock = await provider.getBlockNumber();
                console.log(`[getContractState] Attempt ${attempt + 1}: Current block: ${currentBlock}, Min block: ${minBlockNumber}`);

                if (txHash && minBlockNumber > 0 && currentBlock < minBlockNumber) {
                    console.log('[getContractState] Current block is behind transaction block, waiting...');
                    await new Promise(resolve => setTimeout(resolve, BASE_DELAY_MS));
                    continue;
                }

                state = await contractInstance.getContract(id, { blockTag: 'latest' });
                
                console.log('[getContractState] Raw state from blockchain for ID', id, ':', {
                    status: state.status.toString(), // Log as string to see the raw value
                    clientSigned: state.clientSigned,
                    freelancerSigned: state.bothSigned,
                    fundsDeposited: state.fundsDeposited
                });

                console.log(`[getContractState] Successfully fetched state on attempt ${attempt + 1}`);
                break;

            } catch (err) {
                lastError = err;
                console.error(`[getContractState] Error on attempt ${attempt + 1} for id ${id}:`, err.message);

                if (attempt < MAX_RETRIES - 1) {
                    const delay = BASE_DELAY_MS * Math.pow(1.5, attempt);
                    console.log(`[getContractState] Waiting for ${delay}ms before next retry.`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw new Error(`Failed to fetch contract state after ${MAX_RETRIES} attempts: ${lastError?.message}`);
                }
            }
        }

        if (!state) {
            console.error('[getContractState] Failed to fetch state after all retries completed without breaking.');
            throw new Error(`Failed to fetch contract state for ID ${id} after multiple retries.`);
        }

        // Ensure statusMap includes all possible statuses from the smart contract enum
        // enum Status { Created, ClientSigned, FreelancerSigned, BothSigned, WorkSubmitted, Completed, Disputed, Funded }
        const statusMap = ['Created', 'ClientSigned', 'BothSigned', 'WorkSubmitted', 'Completed', 'Disputed', 'Refunded'];
        const readableStatus = statusMap[state.status] || 'Unknown';
        const bidAmountEth = ethers.utils.formatEther(state.bidAmount);
        const deadlineDate = new Date(state.deadline.toNumber() * 1000);

        console.log('[getContractState] Raw chain values before override:', {
            rawClientApproved: state.clientApproved,
            rawFreelancerApproved: state.freelancerApproved,
            status: state.status
        });

        // Determine approval states based on contract status value
        // A party is 'approved' (signed) if the status is at or past their signing step.
        const blockchainState = {
            client: state.client,
            freelancer: state.freelancer,
            bidAmount: bidAmountEth,
            deadline: deadlineDate,
            jobTitle: state.jobTitle,
            jobDescription: state.jobDescription,
            status: readableStatus,
            workSubmissionHash: state.workSubmissionHash,
            fundsDeposited: Boolean(state.fundsDeposited),
            clientApproved: state.clientSigned, // Use the boolean directly from the smart contract state
            freelancerApproved: state.freelancerSigned, // Use the boolean directly from the smart contract state
        };

        console.log('[getContractState] Processed blockchain state:', {
            contractId: id,
            clientApproved: blockchainState.clientApproved,
            status: blockchainState.status,
            fundsDeposited: blockchainState.fundsDeposited
        });
        
        return blockchainState;

    } catch (error) {
        console.error('[getContractState] Fatal error:', error);
        throw error;
    }
};

// Update clientSignContract to use getSigner and pass bid amount
const clientSignContract = async (contractId, bidAmount, signer) => {
    try {
        // Get signer from centralized utility
        const signerInstance = getSigner();
        const provider = getProvider(); // Also get provider for wait

        const contractWithSigner = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signerInstance);

        const id = typeof contractId === 'string' ? parseInt(contractId) : contractId;
        if (isNaN(id)) throw new Error('Invalid contractId');

        console.log('[clientSignContract] Starting signing process and depositing funds for contract:', id, 'with bid amount:', bidAmount);

        // Send the transaction using the contract instance connected to the signer, passing the bid amount as value
        const tx = await contractWithSigner.clientSignAndDeposit(id, { value: ethers.utils.parseEther(bidAmount.toString()) });
        console.log('[clientSignContract] Transaction sent, hash:', tx.hash);

        // Wait for transaction confirmation using the provider
        const receipt = await provider.waitForTransaction(tx.hash, 2);
        console.log('[clientSignContract] Transaction confirmed in block:', receipt.blockNumber);

        // Fetch the updated state using the robust function and passing the transaction hash
        const updatedState = await getContractState(JobContractAddress, id, signerInstance, tx.hash); // Pass signerInstance here

        // You can add a final check here based on updatedState if needed
        if (!updatedState.clientApproved || !updatedState.fundsDeposited) {
             console.warn('[clientSignContract] Final state check after clientSignAndDeposit - clientApproved or fundsDeposited is still false.');
             // Depending on desired strictness, you could throw here or handle client-side
        } else {
             console.log('[clientSignContract] Final state check successful - clientApproved and fundsDeposited are true.');
        }

        return {
            success: true,
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            blockchainState: updatedState // Optionally return the fetched state
        };

    } catch (error) {
        console.error('[clientSignContract] Error:', error);
        throw error;
    }
};

// Update freelancerSignContract to use getSigner
const freelancerSignContract = async (contractId, signer) => {
    try {
        // Get signer from centralized utility
        const signerInstance = getSigner();
        const provider = getProvider(); // Also get provider for wait

        const contractWithSigner = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signerInstance);

        const id = typeof contractId === 'string' ? parseInt(contractId) : contractId;
        if (isNaN(id)) throw new Error('Invalid contractId');

        console.log('[freelancerSignContract] Starting signing process for contract:', id);

        // Send the transaction using the contract instance connected to the signer
        const tx = await contractWithSigner.freelancerSign(id);
        console.log('[freelancerSignContract] Transaction sent:', tx.hash);

        // Wait for transaction confirmation using the provider
        const receipt = await provider.waitForTransaction(tx.hash);
        console.log('[freelancerSignContract] Transaction confirmed in block:', receipt.blockNumber);

        // Fetch the updated state using the robust function and passing the transaction hash
        const updatedState = await getContractState(JobContractAddress, id, signerInstance, tx.hash); // Pass signerInstance here

        // Verify the state update
        if (!updatedState.freelancerApproved) {
            console.warn('[freelancerSignContract] Final state check after getContractState - freelancerApproved is still false.');
        } else {
            console.log('[freelancerSignContract] Final state check successful - freelancerApproved is true.');
        }

        return {
            success: true,
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            blockchainState: updatedState
        };
    } catch (error) {
        console.error('[freelancerSignContract] Error:', error);
        throw error;
    }
};    

// Update depositFunds to use getSigner
const depositFunds = async (contractId, signer) => {
    try {
         // Get signer from centralized utility
        const signerInstance = getSigner();
        const provider = getProvider(); // Also get provider for wait

        const contractWithSigner = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signerInstance);

        const id = typeof contractId === 'string' ? parseInt(contractId) : contractId;
        if (isNaN(id)) throw new Error('Invalid contractId');

        console.log('Depositing funds for contract ID:', id);

        // This function seems to be for the client signing and depositing. It should likely be combined with clientSignContract
        // If it's a separate deposit function, ensure it gets the amount needed.

        // Assuming depositFunds is a separate function that takes amount as an argument
        // const tx = await contractWithSigner.depositFunds(id, { value: ethers.utils.parseEther(amount.toString()) });

        // As per JobContract.sol, clientSignAndDeposit handles both signing and depositing
        // This depositFunds function in contractUtils might be redundant or used differently.
        // If it's meant to be called separately, it needs the amount.

        // Based on the original depositFunds function signature, it seems it was intended to be called with contractId and signer.
        // However, the smart contract has clientSignAndDeposit which takes value.
        // There might be a mismatch between the backend logic and the smart contract.

        // For now, let's assume this depositFunds in contractUtils is used for a different purpose or needs adjustment.
        // If this function is indeed used to deposit *after* signing, it needs the amount.

        // *** ACTION REQUIRED: Clarify the purpose and parameters of this depositFunds function in backend/utils/contractUtils.js ***
        // For now, I will comment out the transaction sending part as its purpose is unclear relative to clientSignAndDeposit.

        // const tx = await contractWithSigner.depositFunds(id); // This line is problematic as smart contract's depositFunds is payable and likely needs value
        // await tx.wait();

        console.log('Deposit funds function in contractUtils called for ID:', id, '. **Action Required: Implement correct deposit logic.**');
        return { success: true, message: "Deposit logic pending implementation" }; // Placeholder return

    } catch (error) {
        console.error('Error depositing funds:', error);
        throw error;
    }
};

// Update submitWork to use getSigner and getProvider
const submitWork = async (contractAddress, contractId, fileHash, signer) => {
    try {
        // Get signer and provider from centralized utility
        const signerInstance = getSigner();
        const provider = getProvider();

        console.log('[submitWork] Starting work submission with params:', {
            contractAddress,
            contractId,
            fileHash,
            signerAddress: await signerInstance.getAddress()
        });

        // Create a contract instance with the obtained signer
        const contractInstance = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signerInstance);

        const smartContractId = contractId.toString();

        // Get current contract state before submission
        console.log('[submitWork] Fetching current contract state...');
        const currentState = await contractInstance.getContract(smartContractId);
        console.log('[submitWork] Current contract state:', {
            status: currentState.status.toString(),
            freelancer: currentState.freelancer,
            client: currentState.client,
            workSubmissionHash: currentState.workSubmissionHash,
            fundsDeposited: currentState.fundsDeposited,
            clientSigned: currentState.clientSigned,
            freelancerSigned: currentState.freelancerSigned
        });

        // Verify contract state
        if (currentState.status.toString() !== '2') { // 2 is BothSigned
            throw new Error(`Invalid contract status. Expected BothSigned (2), got ${currentState.status.toString()}`);
        }

        // Verify signer is freelancer
        const signerAddress = await signerInstance.getAddress();
        if (signerAddress.toLowerCase() !== currentState.freelancer.toLowerCase()) {
            throw new Error(`Signer address (${signerAddress}) does not match contract freelancer (${currentState.freelancer})`);
        }

        console.log('[submitWork] Attempting to submit work to smart contract...');
        
        // Estimate gas first
        try {
            const gasEstimate = await contractInstance.estimateGas.submitWork(smartContractId, fileHash);
            console.log('[submitWork] Gas estimate:', gasEstimate.toString());
        } catch (estimateError) {
            console.error('[submitWork] Gas estimation failed:', {
                error: estimateError.message,
                code: estimateError.code,
                reason: estimateError.reason,
                data: estimateError.data
            });
            throw estimateError;
        }

        // Send transaction with explicit gas limit
        const tx = await contractInstance.submitWork(smartContractId, fileHash, {
            gasLimit: 500000 // Increased gas limit
        });
        console.log('[submitWork] Transaction sent, hash:', tx.hash);

        // Wait for transaction confirmation
        console.log('[submitWork] Waiting for transaction confirmation...');
        const receipt = await provider.waitForTransaction(tx.hash);
        console.log('[submitWork] Transaction confirmed:', {
            blockNumber: receipt.blockNumber,
            status: receipt.status,
            gasUsed: receipt.gasUsed.toString()
        });

        if (receipt.status === 1) {
            console.log('[submitWork] Work submitted successfully');
            return true;
        } else {
            throw new Error('Transaction failed');
        }
    } catch (error) {
        console.error('[submitWork] Error submitting work:', {
            error: error.message,
            code: error.code,
            reason: error.reason,
            data: error.data,
            stack: error.stack
        });
        throw error;
    }
};

// Update approveWork to use getSigner
const approveWork = async (contractId, signer) => {
    try {
        // Get signer from centralized utility
        const signerInstance = getSigner();
        const provider = getProvider(); // Also get provider for wait

        const contractWithSigner = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signerInstance);

        const id = typeof contractId === 'string' ? parseInt(contractId) : contractId;
        if (isNaN(id)) throw new Error('Invalid contractId');

        console.log('Approving work for contract ID:', id);
        const tx = await contractWithSigner.approveWork(id);

        console.log('Waiting for transaction confirmation...');
        const receipt = await provider.waitForTransaction(tx.hash);

        if (receipt.status === 1) {
            console.log('Work approved successfully:', receipt.transactionHash);
            return true;
        } else {
            throw new Error('Transaction failed');
        }
    } catch (error) {
        console.error('Error approving work:', error);
        throw error;
    }
};

// Update raiseDispute to use getSigner and pass dispute fee
const raiseDispute = async (contractId, disputeFee, signer) => {
    try {
        console.log('Starting dispute raising process...');
        console.log('Contract ID:', contractId);
        console.log('Dispute Fee:', disputeFee);

        // Get signer from centralized utility
        const signerInstance = getSigner();
        const provider = getProvider();

        const contractWithSigner = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signerInstance);

        const id = typeof contractId === 'string' ? parseInt(contractId) : contractId;
        if (isNaN(id)) throw new Error('Invalid contractId');

        // Get current contract state
        console.log('Fetching current contract state...');
        const currentState = await contractWithSigner.getContract(id);
        console.log('Current contract state:', {
            status: currentState.status.toString(),
            statusName: ['Created', 'ClientSigned', 'BothSigned', 'WorkSubmitted', 'Disputed', 'Completed', 'Refunded'][currentState.status],
            fundsDeposited: currentState.fundsDeposited.toString(),
            client: currentState.client,
            freelancer: currentState.freelancer
        });

        // Verify contract is in a valid state for dispute
        if (currentState.status.toString() !== '3') { // 3 = WorkSubmitted
            throw new Error(`Contract must be in WorkSubmitted state to raise dispute. Current state: ${currentState.status.toString()}`);
        }

        console.log('Raising dispute for contract ID:', id, 'with fee:', disputeFee);
        const tx = await contractWithSigner.raiseDispute(id, { value: ethers.utils.parseEther(disputeFee.toString()) });

        console.log('Waiting for transaction confirmation...');
        const receipt = await provider.waitForTransaction(tx.hash);

        // Verify the state change
        console.log('Verifying state change...');
        const newState = await contractWithSigner.getContract(id);
        console.log('New contract state:', {
            status: newState.status.toString(),
            statusName: ['Created', 'ClientSigned', 'BothSigned', 'WorkSubmitted', 'Disputed', 'Completed', 'Refunded'][newState.status],
            fundsDeposited: newState.fundsDeposited.toString()
        });

        if (receipt.status === 1 && newState.status.toString() === '4') {
            console.log('Dispute raised successfully:', receipt.transactionHash);
            return {
                success: true,
                transactionHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                newState: {
                    status: newState.status.toString(),
                    statusName: ['Created', 'ClientSigned', 'BothSigned', 'WorkSubmitted', 'Disputed', 'Completed', 'Refunded'][newState.status]
                }
            };
        } else {
            throw new Error('Transaction failed or state not updated correctly');
        }
    } catch (error) {
        console.error('Error raising dispute:', {
            message: error.message,
            code: error.code,
            data: error.data,
            reason: error.reason
        });
        throw error;
    }
};

// Add rejectWork function
const rejectWork = async (contractId, rejectionReason, signer) => {
    try {
        // Get signer from centralized utility
        const signerInstance = getSigner();
        const provider = getProvider();

        const contractWithSigner = new ethers.Contract(JobContractAddress, CONTRACT_ABI, signerInstance);

        const id = typeof contractId === 'string' ? parseInt(contractId) : contractId;
        if (isNaN(id)) throw new Error('Invalid contractId');

        console.log('Rejecting work for contract ID:', id, 'with reason:', rejectionReason);
        
        // Call the smart contract's rejectWork function
        const tx = await contractWithSigner.rejectWork(id, rejectionReason);

        console.log('Waiting for transaction confirmation...');
        const receipt = await provider.waitForTransaction(tx.hash);

        if (receipt.status === 1) {
            console.log('Work rejected successfully:', receipt.transactionHash);
            return true;
        } else {
            throw new Error('Transaction failed');
        }
    } catch (error) {
        console.error('Error rejecting work:', error);
        throw error;
    }
};

// Add getContract function
const getContract = async (signer) => {
    try {
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            throw new Error('Contract address not configured');
        }

        // Import the ABI
        const contractABI = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "admin",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "adminInitialized",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "contractId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "clientShareBasisPoints",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "freelancerShareBasisPoints",
                        "type": "uint256"
                    }
                ],
                "name": "resolveDispute",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];

        // Create contract instance with signer
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );

        console.log('Contract initialized:', {
            address: contractAddress,
            signer: await signer.getAddress()
        });

        return contract;
    } catch (error) {
        console.error('Error initializing contract:', error);
        throw new Error(`Failed to initialize contract: ${error.message}`);
    }
};

async function resolveDispute(contractId, clientShare, freelancerShare) {
    try {
        const contract = await getContract();
        const tx = await contract.resolveDispute(
            contractId,
            clientShare, // in basis points (0-10000)
            freelancerShare // in basis points (0-10000)
        );
        const receipt = await tx.wait();
        
        // Get the DisputeResolved event
        const event = receipt.events.find(e => e.event === "DisputeResolved");
        if (!event) {
            throw new Error("DisputeResolved event not found");
        }

        return {
            success: true,
            transactionHash: tx.hash,
            clientAmount: event.args.clientAmount.toString(),
            freelancerAmount: event.args.freelancerAmount.toString(),
            resolvedBy: event.args.resolvedBy
        };
    } catch (error) {
        console.error("Error resolving dispute:", error);
        throw new Error(error.message || "Failed to resolve dispute");
    }
}

// Add a new function to verify contract state
async function verifyContractState(contractId) {
  try {
    console.log('Verifying contract state for ID:', contractId);
    
    const signer = await getSigner();
    if (!signer) {
      throw new Error('Failed to get signer');
    }

    const contract = await getContract(signer);
    if (!contract) {
      throw new Error('Failed to get contract instance');
    }

    console.log('Fetching contract details from blockchain...');
    const contractDetails = await contract.getContract(contractId);
    
    // Log detailed state information
    console.log('Contract state details:', {
      status: contractDetails.status.toString(),
      statusName: ['Created', 'ClientSigned', 'BothSigned', 'WorkSubmitted', 'Disputed', 'Completed', 'Refunded'][contractDetails.status],
      fundsDeposited: contractDetails.fundsDeposited.toString(),
      client: contractDetails.client,
      freelancer: contractDetails.freelancer,
      clientSigned: contractDetails.clientSigned,
      freelancerSigned: contractDetails.freelancerSigned,
      workSubmissionHash: contractDetails.workSubmissionHash || 'None'
    });

    // Check if contract is in dispute state
    const isDisputed = contractDetails.status.toString() === '4';
    console.log('Is contract disputed?', isDisputed);

    // If not disputed, log the current state and what's needed
    if (!isDisputed) {
      console.log('Contract is not in dispute state. Current state:', {
        status: contractDetails.status.toString(),
        statusName: ['Created', 'ClientSigned', 'BothSigned', 'WorkSubmitted', 'Disputed', 'Completed', 'Refunded'][contractDetails.status],
        requiredStatus: '4 (Disputed)'
      });
    }

    return {
      isDisputed,
      status: contractDetails.status.toString(),
      statusName: ['Created', 'ClientSigned', 'BothSigned', 'WorkSubmitted', 'Disputed', 'Completed', 'Refunded'][contractDetails.status],
      fundsDeposited: contractDetails.fundsDeposited.toString(),
      client: contractDetails.client,
      freelancer: contractDetails.freelancer,
      workSubmissionHash: contractDetails.workSubmissionHash || 'None'
    };
  } catch (error) {
    console.error('Error verifying contract state:', {
      message: error.message,
      code: error.code,
      data: error.data,
      reason: error.reason
    });
    throw error;
  }
}

// *** ACTION REQUIRED: Add similar updates for resolveDispute and requestRefund if they exist ***
// Also review the parameters for clientSignAndDeposit and raiseDispute to ensure they receive necessary amounts.

const requestRefund = async (contractId, signer) => {
    // ... (existing code) ...
};

const getEscrowBalance = async (contractId) => {
    try {
        const provider = getProvider();
        const contractInstance = new ethers.Contract(JobContractAddress, CONTRACT_ABI, provider);
        const id = typeof contractId === 'string' ? parseInt(contractId) : contractId;
        if (isNaN(id)) throw new Error('Invalid contractId');
        return await contractInstance.getEscrowBalance(id);
    } catch (error) {
        console.error('Error fetching escrow balance:', error);
        throw error;
    }
};

module.exports = {
    // Removed initialize
    createContract,
    getContractState,
    clientSignContract,
    freelancerSignContract,
    depositFunds,
    submitWork,
    approveWork,
    raiseDispute,
    rejectWork,
    resolveDispute,
    verifyContractState,
    getEscrowBalance,
    getContract // Add getContract to exports
};