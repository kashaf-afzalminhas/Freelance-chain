// external-verification.js
// Run this script independently to verify blockchain state
// require('dotenv').config();
require('dotenv').config({ path: __dirname + '/.env' });
const { ethers } = require('ethers');
const { CONTRACT_ABI } = require('./config/contractABI'); // Adjust path

const JobContractAddress = process.env.CONTRACT_ADDRESS; // Use CONTRACT_ADDRESS from .env
const vanguardNetwork = {
    name: 'Vanguard',
    chainId: 78600,
    ensAddress: null
};

async function verifyContractState(contractId, txHash = null) {
    console.log('=== EXTERNAL VERIFICATION SCRIPT ===');
    console.log(`Contract ID: ${contractId}`); // This is the blockchain contract ID (number)
    console.log(`Transaction Hash: ${txHash || 'Not provided'}`);
    console.log(`Contract Address: ${JobContractAddress}`);

    if (!JobContractAddress) {
        console.error('CONTRACT_ADDRESS not set in .env');
        process.exit(1);
    }
     if (!process.env.RPC_URL) {
        console.error('RPC_URL not set in .env');
        process.exit(1);
    }

    try {
        // Test multiple providers/endpoints if available
        // You can add backup URLs from your .env or hardcode them if necessary
        const providerUrls = [
             process.env.RPC_URL,
             // Add backup provider URLs here if you have them, e.g.:
             // process.env.BACKUP_PROVIDER_URL_1,
             // 'https://another-public-rpc.vanarchain.com', // Example public RPC if available
        ].filter(url => url); // Filter out undefined or null URLs

        if (providerUrls.length === 0) {
             console.error('No provider URLs available. Check your .env file.');
             process.exit(1);
        }

        const providers = [];
         for (const url of providerUrls) {
             try {
                  const provider = new ethers.providers.JsonRpcProvider({
                      url,
                      ...vanguardNetwork
                  }, vanguardNetwork); // Pass network config twice for robustness
                   await provider.ready;
                   providers.push(provider);
                   console.log(`Provider initialized for URL: ${url}`);
             } catch (err) {
                  console.warn(`Failed to initialize provider for URL ${url}:`, err.message);
             }
         }

        if (providers.length === 0) {
            console.error('All providers failed to initialize.');
            process.exit(1);
        }


        for (let i = 0; i < providers.length; i++) {
            console.log('\n---' + ' Testing Provider ' + (i + 1) + ': ' + providerUrls[i] + ' ---');
            const provider = providers[i];

            try {
                const network = await provider.getNetwork();
                console.log(`Connected to network: ${network.name} (${network.chainId})`);

                const currentBlock = await provider.getBlockNumber();
                console.log(`Current block: ${currentBlock}`);

                // If we have a transaction hash, verify it exists and get its block
                let txBlockNumber = null;
                if (txHash) {
                    try {
                        console.log(`Fetching receipt for transaction hash: ${txHash}`);
                        const receipt = await provider.getTransactionReceipt(txHash);
                        if (receipt) {
                            console.log(`Transaction found in block: ${receipt.blockNumber}`);
                            console.log(`Transaction status: ${receipt.status === 1 ? 'Success' : 'Failed'}`);
                             if (receipt.status !== 1) {
                                 console.error("Transaction failed on-chain.");
                             }
                            txBlockNumber = receipt.blockNumber;
                             if (currentBlock >= txBlockNumber) {
                                console.log(`Blocks since transaction: ${currentBlock - txBlockNumber}`);
                             } else {
                                console.warn(`Current block (${currentBlock}) is behind transaction block (${txBlockNumber}).`);
                             }

                        } else {
                            console.warn('Transaction receipt not found for hash:', txHash);
                        }
                    } catch (err) {
                        console.warn(`Error fetching transaction receipt: ${err.message}`);
                    }
                }

                // Create contract instance
                const contract = new ethers.Contract(JobContractAddress, CONTRACT_ABI, provider);

                // Test different block tags
                const blockTags = ['latest', 'pending'];

                for (const blockTag of blockTags) {
                    console.log('\nFetching state with blockTag: ' + blockTag);
                    try {
                        const state = await contract.getContract(contractId, { blockTag });

                        const result = {
                            blockTag,
                            clientApproved: Boolean(state.clientApproved),
                            freelancerApproved: Boolean(state.freelancerApproved),
                            fundsDeposited: Boolean(state.fundsDeposited),
                            status: state.status,
                            client: state.client,
                            freelancer: state.freelancer,
                            bidAmount: ethers.utils.formatEther(state.bidAmount),
                            deadline: new Date(state.deadline.toNumber() * 1000).toISOString(),
                            workSubmissionHash: state.workSubmissionHash || ''
                        };

                        console.log(JSON.stringify(result, null, 2));

                    } catch (err) {
                        console.warn(`Error fetching with blockTag ${blockTag}: ${err.message}`);
                    }
                }

                // Test with specific block number if we have a transaction block
                if (txBlockNumber !== null) {
                    console.log('\nFetching state from block ' + txBlockNumber + ' (Transaction Block)');
                    try {
                        const stateTxBlock = await contract.getContract(contractId, {
                            blockTag: txBlockNumber
                        });

                         console.log(`clientApproved at tx block ${txBlockNumber}: ${Boolean(stateTxBlock.clientApproved)}`);
                         // Also check block + 1
                         console.log('\nFetching state from block ' + (txBlockNumber + 1) + ' (Transaction Block + 1)');
                         const stateTxBlockPlus1 = await contract.getContract(contractId, {
                             blockTag: txBlockNumber + 1
                         });
                         console.log(`clientApproved at block ${txBlockNumber + 1}: ${Boolean(stateTxBlockPlus1.clientApproved)}`);

                    } catch (err) {
                        console.warn(`Error fetching from specific block: ${err.message}`);
                    }
                }

            } catch (err) {
                console.error(`Provider ${i + 1} failed entirely: ${err.message}`);
            }
             console.log(`--- End Provider ${i + 1} ---`);
        }

        // Additional network diagnostics
        console.log('\n===' + ' NETWORK DIAGNOSTICS (Using first healthy provider) ===');
        const mainProvider = providers[0]; // Use the first successfully initialized provider

        if (mainProvider) {
             // Check if we can get recent blocks consistently
             console.log('Checking block consistency...');
             try {
                  for (let i = 0; i < 3; i++) {
                      const blockNum = await mainProvider.getBlockNumber();
                      console.log(`Block number check ${i + 1}: ${blockNum}`);
                      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                  }
             } catch (err) {
                  console.warn('Error during block consistency check:', err.message);
             }


             // Test contract existence
             console.log('\nTesting contract code existence...');
             try {
                  const code = await mainProvider.getCode(JobContractAddress);
                  console.log(`Contract code length: ${code.length} bytes`);
                  console.log(`Contract exists: ${code !== '0x'}`);
             } catch (err) {
                  console.warn('Error fetching contract code:', err.message);
             }
        } else {
             console.warn('No healthy provider available for network diagnostics.');
        }


    } catch (error) {
        console.error('Verification script failed:', error);
    }
     console.log('\n===' + ' EXTERNAL VERIFICATION COMPLETE ===');
}

// Usage
if (require.main === module) {
    const contractIdArg = process.argv[2];
    const txHashArg = process.argv[3];

    if (!contractIdArg) {
        console.log('Usage: node external-verification.js <blockchainContractId> [transactionHash]');
        console.log('Please provide the numeric blockchain contract ID, not the MongoDB ObjectId.');
        process.exit(1);
    }

    const blockchainContractId = parseInt(contractIdArg, 10);

    if (isNaN(blockchainContractId) || blockchainContractId < 0) {
         console.error(`Invalid blockchain contract ID provided: ${contractIdArg}. Must be a non-negative number.`);
         process.exit(1);
    }


    verifyContractState(blockchainContractId, txHashArg);
}

module.exports = { verifyContractState }; 