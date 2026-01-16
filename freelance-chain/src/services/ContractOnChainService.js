// ContractOnChainService.js - Updated version
import { ethers } from 'ethers';
// Removed import of contractUtils as it's a backend file
// import * as contractUtils from './contractUtils';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../utils/contract';

// Removed import of useWeb3 as it's a hook and cannot be used here
// import { useWeb3 } from '../context/Web3Context';

// Removed initialize as it was related to backend contractUtils
// const initialize = async () => {
//     // Removed backend initialization logic
// };

// Helper function to validate addresses
const validateAddress = (address) => {
  if (!ethers.utils.isAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  return ethers.utils.getAddress(address); // Normalize to checksum address
};

// Removed VGToken contract address and ABI
// const VG_TOKEN_ADDRESS = "...";
// const VG_TOKEN_ABI = [ ... ];

// Vanguard network configuration - Keep this as it's needed for network checks
const VANGUARD_NETWORK = {
  chainId: '0x13308', // 78600 in hex
  chainName: 'Vanguard Testnet',
  nativeCurrency: {
    name: 'Vanguard',
    symbol: 'VG',
    decimals: 18
  },
  rpcUrls: ['https://rpc-vanguard.vanarchain.com'],
  blockExplorerUrls: ['https://explorer-vanguard.vanarchain.com']
};

// Removed debugTokenInfo function
// async function debugTokenInfo(...) { ... }

// Constants for retry logic
const MAX_RETRIES = 5;
const INITIAL_DELAY = 2000; // 2 seconds
const MAX_DELAY = 30000; // 30 seconds

// Helper function to calculate delay with jitter
const calculateDelay = (attempt) => {
  const delay = Math.min(INITIAL_DELAY * Math.pow(2, attempt), MAX_DELAY);
  const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
  return delay + jitter;
};

// Helper function to check if error should trigger a retry
const shouldRetry = (error) => {
  return (
    error.code === -32005 || // Rate limit error
    error.message?.includes('rate limit') ||
    error.message?.includes('too many requests') ||
    error.message?.includes('timeout') ||
    error.message?.includes('network error') ||
    error.message?.includes('nonce too low') || // Common MetaMask error
    error.message?.includes('already known') // Transaction already in pool
  );
};

// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function createContractOnChain({
  freelancerAddress,
  bidAmount,
  deadline,
  jobTitle,
  jobDescription,
  provider,
  signer
}) {
  let lastError;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      if (!provider || !signer) {
        console.error('Provider or signer missing:', { provider, signer });
        throw new Error('Wallet not connected');
      }

      // Enhanced parameter validation based on smart contract requirements
      if (!freelancerAddress) {
        throw new Error('Freelancer address is required');
      }
      const validatedFreelancerAddress = validateAddress(freelancerAddress);
      if (!validatedFreelancerAddress || validatedFreelancerAddress === ethers.constants.AddressZero) {
        throw new Error(`Invalid freelancer address provided: ${freelancerAddress}`);
      }

      if (!bidAmount || typeof bidAmount !== 'number' || bidAmount <= 0) {
        throw new Error(`Bid amount must be a positive number: ${bidAmount}`);
      }
      
      if (!deadline) {
        throw new Error('Deadline is required');
      }
      
      // Convert deadline to Unix timestamp (seconds) and validate
      const deadlineDate = new Date(deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      
      if (isNaN(deadlineDate.getTime())) {
        throw new Error(`Invalid deadline date provided: ${deadline}`);
      }
      if (deadlineTimestamp <= currentTimestamp) {
        throw new Error(`Deadline must be in the future. Provided: ${deadlineDate.toLocaleString()}`);
      }

      if (!jobTitle || jobTitle.trim() === '') {
        throw new Error('Job title is required');
      }
      if (!jobDescription || jobDescription.trim() === '') {
        throw new Error('Job description is required');
      }

      const signerAddress = await signer.getAddress();
      console.log('Signer address:', signerAddress);

      // Validate that freelancer is not the same as client (msg.sender)
      if (validatedFreelancerAddress.toLowerCase() === signerAddress.toLowerCase()) {
        throw new Error('Client cannot be the same as freelancer');
      }

      // Create a new provider with basic configuration
      const customProvider = new ethers.providers.Web3Provider(window.ethereum);

      // Convert bidAmount to wei (for native currency)
      const bidAmountWei = ethers.utils.parseEther(bidAmount.toString());
      console.log('Bid amount in wei:', bidAmountWei.toString());

      // Add a small delay before checks
      await sleep(1500); // Wait for 1.5 seconds

      // Verify signer is on the correct network before checking balance
      const network = await signer.getChainId();
      console.log('Signer connected to chain ID:', network);
      const expectedChainId = parseInt(VANGUARD_NETWORK.chainId, 16);
      console.log('Expected Vanguard chain ID:', expectedChainId);

      if (network !== expectedChainId) {
        throw new Error(`Network mismatch: Signer is on chain ID ${network}, but expected ${expectedChainId} (${VANGUARD_NETWORK.chainName}). Please switch to the correct network in MetaMask.`);
      }

      // Check native coin balance
      try {
        const balance = await signer.getBalance();
        console.log('Raw native balance:', balance.toString());
        console.log('Formatted native balance:', ethers.utils.formatEther(balance), 'VG');
        console.log('Required amount:', ethers.utils.formatEther(bidAmountWei), 'VG');

        // Check if balance is less than bid amount + a small buffer for gas
        const gasBuffer = ethers.utils.parseEther('0.01'); // Add a small buffer for gas
        const totalRequired = bidAmountWei.add(gasBuffer);

        if (balance.lt(totalRequired)) {
          throw new Error(`Insufficient native balance. Required: ${ethers.utils.formatEther(totalRequired)} VG (Bid + gas), Available: ${ethers.utils.formatEther(balance)} VG`);
        }
      } catch (error) {
        console.error('Error checking native balance:', error);
        throw new Error(`Failed to verify native balance: ${error.message}`);
      }

      // Initialize contract with signer
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log('Creating contract with parameters:', {
        freelancerAddress: validatedFreelancerAddress,
        bidAmountWei: bidAmountWei.toString(),
        deadlineTimestamp,
        jobTitle,
        jobDescription
      });

      // Estimate gas before sending transaction
      try {
        const gasEstimate = await contract.estimateGas.createContract(
          validatedFreelancerAddress,
          bidAmountWei,
          deadlineTimestamp,
          jobTitle,
          jobDescription
        );
        console.log('Estimated gas:', gasEstimate.toString());
      } catch (error) {
        console.error('Gas estimation failed:', error);
        if (error.message && error.message.includes('execution reverted')) {
          const revertReason = error.message.split('execution reverted:')[1];
          throw new Error(revertReason ? `Gas estimation failed: Contract execution reverted - ${revertReason}` : 'Gas estimation failed: Contract execution reverted without a reason string. Check contract parameters.');
        } else {
          throw new Error(`Failed to estimate gas: ${error.message}`);
        }
      }

      // Call the contract's createContract function with explicit gas limit
      const tx = await contract.createContract(
        validatedFreelancerAddress,
        bidAmountWei,
        deadlineTimestamp,
        jobTitle,
        jobDescription,
        {
          gasLimit: 800000 // Further increased gas limit as a troubleshooting step
        }
      );

      console.log('Transaction sent:', tx.hash);

      // Wait for transaction confirmation with more detailed logging
      console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      // Log all events from the receipt
      console.log('All events in receipt:', receipt.events);

      // Look for the ContractCreated event with more detailed logging
      const event = receipt.events?.find(e => {
        console.log('Checking event:', {
          eventName: e.event,
          args: e.args
        });
        return e.event === 'ContractCreated';
      });

      if (!event) {
        console.error('ContractCreated event not found in receipt events:', receipt.events);
        // Try to get the contract ID from the transaction logs
        const contractCount = await contract.getContractCount().then(count => count.toNumber());
        const potentialContractId = contractCount > 0 ? contractCount - 1 : null;
        console.log('Attempting fallback with contract count:', { contractCount, potentialContractId });

        if (potentialContractId !== null) {
          try {
            const fetchedContractState = await contract.getContract(potentialContractId);
            console.log('Fallback: Successfully fetched contract state with ID:', potentialContractId, fetchedContractState);
            if (fetchedContractState.client.toLowerCase() === signerAddress.toLowerCase() &&
                fetchedContractState.freelancer.toLowerCase() === validatedFreelancerAddress.toLowerCase()) {
              console.log('Fallback: Client and freelancer match. Using fallback contract ID.');
              return {
                contractId: potentialContractId.toString(),
                txHash: tx.hash
              };
            } else {
              console.log('Fallback: Client or freelancer mismatch. Fallback failed.');
            }
          } catch (fetchError) {
            console.error('Fallback: Error fetching contract state with potential ID:', potentialContractId, fetchError);
          }
        }

        throw new Error('Contract creation event not found in transaction receipt.');
      }

      console.log('ContractCreated event found:', event.args);
      if (event.args && event.args.contractId !== undefined) {
        return {
          contractId: event.args.contractId.toString(),
          txHash: tx.hash
        };
      } else {
        console.error('ContractCreated event found, but contractId argument is missing or undefined:', event.args);
        const contractCount = await contract.getContractCount().then(count => count.toNumber());
        const finalFallbackContractId = contractCount > 0 ? contractCount - 1 : null;
        if (finalFallbackContractId !== null) {
          console.log('Final fallback: Using contract count - 1:', finalFallbackContractId);
          return {
            contractId: finalFallbackContractId.toString(),
            txHash: tx.hash
          };
        } else {
          throw new Error('ContractCreated event found but missing contractId, and fallback failed.');
        }
      }

    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;

      if (!shouldRetry(error)) {
        throw error; // Don't retry if it's not a retryable error
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay = calculateDelay(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw lastError;
}

// Update depositFundsOnChain to send native value
export const depositFundsOnChain = async (contractId, amount, signer) => {
    try {
        console.log('Depositing funds on chain for contract:', contractId);

        if (!signer) {
             throw new Error('Signer is required to deposit funds');
        }

        // Create a new provider with basic configuration
        const customProvider = new ethers.providers.Web3Provider(window.ethereum);

        // Get signer from the custom provider
        const customSigner = customProvider.getSigner();
        
        const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, customSigner);

        // Call the depositFunds smart contract function directly, sending native value
        const tx = await contractWithSigner.depositFunds(contractId, {
            value: ethers.utils.parseEther(amount.toString())
        });
        await tx.wait();

        console.log('Funds deposited successfully');
        return { success: true };

    } catch (error) {
        console.error('Error depositing funds on chain:', error);
        let errorMessage = 'Failed to deposit funds.';
         if (error.reason) {
             errorMessage = `Deposit failed: ${error.reason}`;;
        } else if (error.data && error.data.message) {
             errorMessage = `Deposit failed: ${error.data.message}`;;
        } else if (error.message) {
             errorMessage = `Deposit failed: ${error.message}`;;
        }
         // If the error is related to insufficient funds for gas or value
        if (error.code === 'INSUFFICIENT_FUNDS') {
            errorMessage = 'Insufficient native coin balance for transaction or deposit amount.';
        } else if (error.message && error.message.includes('execution reverted')) {
            errorMessage = `Deposit failed: ${error.message.split('execution reverted:')[1] || error.message}`;;
        }

        throw new Error(errorMessage);
    }
};

export const signContractOnChain = async (contractId, signerData) => {
  let lastError;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      const { signer, provider } = signerData;
      if (!signer || !provider) {
        throw new Error('Signer or provider not provided');
      }

      // Initialize contract with signer
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Add a small delay before signing
      await sleep(1500);

      // Estimate gas before sending transaction
      try {
        const gasEstimate = await contract.estimateGas.freelancerSign(contractId);
        console.log('Estimated gas for signing:', gasEstimate.toString());
      } catch (error) {
        console.error('Gas estimation failed:', error);
        if (error.message && error.message.includes('execution reverted')) {
          const revertReason = error.message.split('execution reverted:')[1];
          throw new Error(revertReason ? `Gas estimation failed: ${revertReason}` : 'Gas estimation failed: Contract execution reverted');
        }
        throw error;
      }

      // Send transaction with explicit gas limit
      const tx = await contract.freelancerSign(contractId, {
        gasLimit: 200000 // Increased gas limit
      });

      console.log('Signing transaction sent:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Verify the contract state after signing
      const contractState = await contract.getContract(contractId);
      if (!contractState.freelancerSigned) {
        throw new Error('Contract signing verification failed');
      }

      return {
        success: true,
        transactionHash: tx.hash,
        contractState
      };

    } catch (error) {
      console.error(`Signing attempt ${attempt + 1} failed:`, error);
      lastError = error;

      if (!shouldRetry(error)) {
        throw error; // Don't retry if it's not a retryable error
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay = calculateDelay(attempt);
        console.log(`Retrying signing in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw lastError;
};

// getContractStateOnChain remains similar, adjust bidAmount/fundsDeposited if needed
export const getContractStateOnChain = async (contractAddress, contractId, signer = null) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer || provider);

        console.log('Getting contract state on chain for contract ID:', contractId);

        const state = await contract.getContract(contractId);

        const statusMap = ['Created', 'ClientSigned', 'FreelancerSigned', 'WorkSubmitted', 'Completed', 'Disputed'];
        const readableStatus = statusMap[state.status] || 'Unknown';

        // bidAmount is now in native currency, format using formatEther
        const bidAmountEth = ethers.utils.formatEther(state.bidAmount);

        const deadlineDate = new Date(state.deadline.toNumber() * 1000);

        return {
            client: state.client,
            freelancer: state.freelancer,
            bidAmount: bidAmountEth,
            deadline: deadlineDate,
            jobTitle: state.jobTitle,
            jobDescription: state.jobDescription,
            status: readableStatus,
            workSubmissionHash: state.workSubmissionHash,
            fundsDeposited: state.fundsDeposited,
            clientSigned: state.clientApproved,
            freelancerApproved: state.freelancerApproved
        };

    } catch (error) {
        console.error('Error getting contract state:', error);
        let errorMessage = 'Failed to get contract state';
        
        if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
            errorMessage = 'Failed to estimate gas. Please try again or contact support.';
        } else if (error.code === 'CALL_EXCEPTION') {
            errorMessage = 'Failed to read contract state. Please check contract address and ID.';
        } else if (error.message && error.message.includes('execution reverted')) {
            errorMessage = `Contract read failed: ${error.message.split('execution reverted:')[1] || error.message}`;
        }
        
        throw new Error(errorMessage);
    }
};

// Add submitWorkOnChain function
export const submitWorkOnChain = async (contractId, workHash, signer, provider) => {
    try {
        console.log('[submitWorkOnChain] Attempting to submit work for contract:', contractId, 'with hash:', workHash);
        console.log('[submitWorkOnChain] Signer details:', {
            hasSigner: !!signer,
            signerType: signer ? typeof signer : 'undefined',
            providerType: provider ? typeof provider : 'undefined'
        });

        if (!signer) {
            console.error('[submitWorkOnChain] No signer provided');
            throw new Error('Signer is required to submit work on chain');
        }

        // Log signer address
        const signerAddress = await signer.getAddress();
        console.log('[submitWorkOnChain] Signer address:', signerAddress);

        // Use the provided signer (from frontend wallet) to interact with the contract
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        // Ensure contractId is a number
        const id = typeof contractId === 'string' ? parseInt(contractId) : contractId;
        if (isNaN(id)) {
            throw new Error('Invalid contractId format');
        }

        // Fetch and log current contract state from blockchain before submitting work
        console.log('[submitWorkOnChain] Fetching current contract state from blockchain...');
        // Use the frontend provider passed as an argument
        const contractInstanceForRead = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const currentState = await contractInstanceForRead.getContract(id);
        console.log('[submitWorkOnChain] Current blockchain state:', {
            status: currentState.status.toString(), // Log raw status enum value
            freelancer: currentState.freelancer,
            client: currentState.client
        });

        // Verify the signer is the freelancer
        if (signerAddress.toLowerCase() !== currentState.freelancer.toLowerCase()) {
            console.error('[submitWorkOnChain] Signer address does not match blockchain freelancer address:', {
                signerAddress,
                blockchainFreelancer: currentState.freelancer
            });
            throw new Error('Only the contract freelancer can submit work');
        }

        // Verify contract status is BothSigned (2)
        if (currentState.status.toString() !== '2') {
            console.error('[submitWorkOnChain] Invalid contract status for work submission:', {
                currentStatus: currentState.status.toString(),
                expectedStatus: '2'
            });
            throw new Error('Contract must be signed by both parties before work can be submitted');
        }

        console.log('[submitWorkOnChain] Calling smart contract submitWork with ID:', id, 'and work hash:', workHash);
        
        // Call the smart contract's submitWork function, providing transaction overrides
        const tx = await contractInstance.submitWork(id, workHash, {
            gasLimit: 800000 // Increased gas limit to address potential gas issues
        });
        console.log('[submitWorkOnChain] Transaction sent, hash:', tx.hash);

        // Wait for transaction confirmation
        console.log('[submitWorkOnChain] Waiting for transaction confirmation...');
        const receipt = await tx.wait();
        console.log('[submitWorkOnChain] Transaction confirmed:', receipt);

        if (receipt.status === 1) {
            console.log('[submitWorkOnChain] Work submitted successfully on chain');
            return { success: true, transactionHash: tx.hash, blockNumber: receipt.blockNumber };
        } else {
            throw new Error('On-chain transaction failed');
        }

    } catch (error) {
        console.error('[submitWorkOnChain] Error submitting work on chain:', error);
        let errorMessage = 'Failed to submit work on chain.';
        
        // Enhanced error handling for common on-chain issues
        if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
             errorMessage = 'Transaction would fail on chain. Please check contract state and ensure you are the freelancer.';
             if (error.reason) { errorMessage += ` Reason: ${error.reason}`; }
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
             errorMessage = 'Insufficient native coin balance for transaction gas.';
        } else if (error.code === 'CALL_EXCEPTION') {
             errorMessage = 'Contract execution failed. Check inputs and contract state.';
             if (error.error && error.error.message) { errorMessage += ` Error: ${error.error.message}`; }
             else if (error.message && error.message.includes('execution reverted')) { 
                 const revertReason = error.message.split('execution reverted:')[1];
                 errorMessage += revertReason ? ` Revert Reason: ${revertReason.trim()}` : ' No specific revert reason.';
             }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};