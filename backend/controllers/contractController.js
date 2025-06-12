// backend/controllers/contractController.js
const Contract = require('../models/Contract');
const contractUtils = require('../utils/contractUtils');
const notificationService = require('../services/notificationService');

// Removed redundant initialization
// initialize().catch(console.error);

// Add this mapping at the top of the file
const blockchainToDbStatus = {
    Created: 'created',
    ClientSigned: 'client_signed',
    BothSigned: 'both_signed',
    WorkSubmitted: 'work_submitted',
    Completed: 'completed',
    Disputed: 'disputed',
    Refunded: 'refunded'
};

exports.createContract = async (req, res) => {
    try {
        console.log('Received contract creation request:', req.body);
        
        // Validate required fields
        const requiredFields = ['jobId', 'bidId', 'freelancerId', 'freelancerAddress', 'bidAmount', 'jobTitle', 'jobDescription', 'deadline'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required field: ${field}`
                });
            }
        }

        // Create contract in database first
        try {
            console.log('Preparing contract data for database save:', {
                job: req.body.jobId,
                bid: req.body.bidId,
                client: req.user._id,
                freelancer: req.body.freelancerId,
                contractAddress: req.body.contractAddress,
                contractId: req.body.contractId,
                bidAmount: req.body.bidAmount,
                jobTitle: req.body.jobTitle,
                jobDescription: req.body.jobDescription,
                deadline: req.body.deadline,
                transactionHash: req.body.transactionHash
            });

            const contract = new Contract({
                job: req.body.jobId,
                bid: req.body.bidId,
                client: req.user._id,
                freelancer: req.body.freelancerId,
                contractAddress: req.body.contractAddress,
                contractId: req.body.contractId,
                bidAmount: req.body.bidAmount,
                jobTitle: req.body.jobTitle,
                jobDescription: req.body.jobDescription,
                deadline: req.body.deadline,
                transactionHash: req.body.transactionHash,
                status: 'created'
            });

            await contract.save();
            console.log('Contract successfully saved to database with ID:', contract._id);

            res.status(201).json({
                success: true,
                data: contract
            });
        } catch (dbError) {
            console.error('Error saving contract to database:', dbError);
            throw dbError;
        }
    } catch (err) {
        console.error('Error in createContract function:', err);
        res.status(500).json({
            success: false,
            error: err.message || 'Failed to create contract'
        });
    }
};

exports.getUserContracts = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('Fetching contracts for user:', userId);
        
        const contracts = await Contract.find({
            $or: [
                { client: userId },
                { freelancer: userId }
            ]
        })
        .populate('client', 'name walletAddress')
        .populate('freelancer', 'name walletAddress')
        .populate('job', 'title description')
        .lean();

        console.log('Found contracts:', contracts.length);

        const contractsWithState = await Promise.all(
            contracts.map(async (contract) => {
                try {
                    if (!contract.contractAddress || !contract.contractId) {
                        console.log('No contract address or ID for contract:', contract._id);
                        return null;
                    }

                    console.log('Fetching blockchain state for contract:', contract._id, 'contractId:', contract.contractId);
                    const blockchainState = await contractUtils.getContractState(
                        contract.contractAddress,
                        contract.contractId
                    );
                    console.log('Blockchain state fetched:', contract._id, 'blockchainState:', blockchainState);
                    if (!blockchainState) {
                        console.warn('Skipping contract with null blockchain state:', contract._id);
                        return null;
                    }

                    // Map blockchain status to DB status
                    const dbStatus = blockchainToDbStatus[blockchainState.status];
                    if (dbStatus && dbStatus !== contract.status) {
                        // Update status in DB (need to use findByIdAndUpdate since contract is lean)
                        // Use $set for explicit update fields
                        await Contract.findByIdAndUpdate(contract._id, { $set: { status: dbStatus } });
                        contract.status = dbStatus; // Update lean object locally
                    }

                    // Determine signed/approved states directly from the blockchain status value
                    const isClientCurrentlySigned = blockchainState.status === 'ClientSigned' || blockchainState.status === 'BothSigned';
                    const isFreelancerCurrentlySigned = blockchainState.status === 'FreelancerSigned' || blockchainState.status === 'BothSigned';

                    // Update signed and approved flags with retry logic - Always update with $set
                    // Set flags to true if the status indicates they have signed. Once true, they remain true.
                    const currentContract = await Contract.findById(contract._id);
                    const finalClientSigned = currentContract.clientSigned || isClientCurrentlySigned;
                    const finalFreelancerSigned = currentContract.freelancerSigned || isFreelancerCurrentlySigned;
                    const finalClientApproved = currentContract.clientApproved || isClientCurrentlySigned;
                    const finalFreelancerApproved = currentContract.freelancerApproved || isFreelancerCurrentlySigned;

                    const MAX_UPDATE_RETRIES = 3;
                    const UPDATE_RETRY_DELAY_MS = 500;

                    for (let attempt = 0; attempt < MAX_UPDATE_RETRIES; attempt++) {
                        try {
                            const updatedDoc = await Contract.findByIdAndUpdate(contract._id, {
                                $set: {
                                    clientSigned: finalClientSigned,
                                    freelancerSigned: finalFreelancerSigned,
                                    clientApproved: finalClientApproved,
                                    freelancerApproved: finalFreelancerApproved,
                                    updatedAt: new Date()
                                }
                            }, { new: true }).lean(); // Use {new: true} and .lean() to get the updated document

                            // Update the lean contract object with confirmed DB values
                            if(updatedDoc) {
                                contract.clientSigned = updatedDoc.clientSigned;
                                contract.freelancerSigned = updatedDoc.freelancerSigned;
                                contract.clientApproved = updatedDoc.clientApproved;
                                contract.freelancerApproved = updatedDoc.freelancerApproved;
                                // No need to update status here, it's handled separately above if changed
                            } else {
                                console.warn(`[getUserContracts] findByIdAndUpdate returned null for contract ${contract._id}`);
                            }

                            console.log(`[getUserContracts] Successfully updated DB for contract ${contract._id} on attempt ${attempt + 1}. Final flags: clientSigned=${finalClientSigned}, freelancerSigned=${finalFreelancerSigned}, clientApproved=${finalClientApproved}, freelancerApproved=${finalFreelancerApproved}`);
                            break; // Exit retry loop on success
                        } catch (err) {
                            console.error(`[getUserContracts] Attempt ${attempt + 1} failed for contract update ${contract._id}:`, err);
                            if (attempt < MAX_UPDATE_RETRIES - 1) {
                                await new Promise(res => setTimeout(res, UPDATE_RETRY_DELAY_MS));
                            } else {
                                console.error(`[getUserContracts] Failed to update DB for contract ${contract._id} after ${MAX_UPDATE_RETRIES} attempts.`);
                                // Optionally throw or handle final failure
                                throw new Error(`Failed to update contract ${contract._id} in DB.`);
                            }
                        }
                    }

                    return {
                        ...contract,
                        // Ensure the returned object reflects the latest DB state after update
                        clientApproved: contract.clientApproved,
                        freelancerApproved: contract.freelancerApproved,
                        clientSigned: contract.clientSigned,
                        BothSigned: contract.freelancerSigned,
                        blockchainState: blockchainState // Include blockchainState as extra info
                    };
                } catch (err) {
                    console.error(`Error fetching blockchain state for contract ${contract._id}:`, err.message);
                    return null;
                }
            })
        );

        // Filter out nulls
        const filteredContracts = contractsWithState.filter(Boolean);

        console.log('Sending response with contracts:', filteredContracts.length);
        res.status(200).json({
            success: true,
            data: filteredContracts
        });
    } catch (err) {
        console.error('Error getting user contracts:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch contracts'
        });
    }
};

exports.getContract = async (req, res) => {
    try {
        const { id } = req.params;
        
        // First try to find the contract in the database
        const contract = await Contract.findById(id)
            .populate('client freelancer job bid');
        
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        try {
            // Add a small delay before fetching blockchain state
            await new Promise(resolve => setTimeout(resolve, 3000)); // Add a 3-second delay

            // Get the blockchain state of the contract
            const blockchainState = await contractUtils.getContractState(
                contract.contractAddress,
                contract.contractId
            );

            // Map blockchain status to DB status
            const dbStatus = blockchainToDbStatus[blockchainState.status];
            if (dbStatus && dbStatus !== contract.status) {
                contract.status = dbStatus;
                await contract.save();
            }

            // Update signed flags based on blockchain state
            contract.clientSigned = blockchainState.clientSigned;
            contract.freelancerSigned = blockchainState.freelancerSigned;
            contract.updatedAt = new Date();
            await contract.save();

            res.status(200).json({
                success: true,
                data: contract
            });
        } catch (blockchainError) {
            console.error('Error fetching blockchain state:', blockchainError);
            // Return database state if blockchain fetch fails
            res.status(200).json({
                success: true,
                data: contract,
                warning: 'Could not fetch blockchain state'
            });
        }
    } catch (err) {
        console.error('Error in getContract:', err);
        res.status(500).json({
            success: false,
            error: err.message || 'Failed to fetch contract'
        });
    }
};

exports.signContract = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the contract
        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        console.log('Contract before signing:', {
            contractId: contract.contractId,
            clientApproved: contract.clientApproved,
            status: contract.status
        });

        // Convert contract ID to number for blockchain
        const contractId = parseInt(contract.contractId);
        if (isNaN(contractId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid contract ID format'
            });
        }

        // Sign the contract on the blockchain
        const signResult = await contractUtils.clientSignContract(contractId, req.signer);
        console.log('Contract signed on blockchain:', {
            contractId,
            transactionHash: signResult.transactionHash,
            blockNumber: signResult.blockNumber
        });

        // After successful on-chain signing, refetch the latest state from the blockchain
        const blockchainState = await contractUtils.getContractState(
            contract.contractAddress,
            contractId,
            req.signer,
            signResult.transactionHash
        );
        console.log('Blockchain state after signing:', {
            contractId,
            clientApproved: blockchainState.clientApproved,
            status: blockchainState.status,
            fundsDeposited: blockchainState.fundsDeposited
        });

        if (!blockchainState) {
            console.warn('Blockchain state is null after signing.');
            return res.status(200).json({
                success: true,
                data: contract.toObject(),
                warning: 'Blockchain state could not be refetched after signing.'
            });
        }

        // Map blockchain status to DB status
        const dbStatus = blockchainToDbStatus[blockchainState.status];

        // Determine signed/approved states from the *processed* blockchainState (derived from status in contractUtils)
        const isClientSigned = blockchainState.clientApproved;
        const isFreelancerSigned = blockchainState.freelancerApproved;

        // ✅ Always explicitly update with $set
        await Contract.findByIdAndUpdate(contract._id, {
            $set: {
                status: dbStatus, // Update status based on blockchain
                clientSigned: isClientSigned,
                freelancerSigned: isFreelancerSigned,
                clientApproved: isClientSigned, // Sync approved with signed based on this flow
                freelancerApproved: isFreelancerSigned, // Sync approved with signed based on this flow
                updatedAt: new Date()
            }
        });

        // ✅ Post-save check
        const updated = await Contract.findById(contract._id).lean();
        console.log('Post-save verification:', {
            contractId: contractId,
            clientSigned: updated.clientSigned,
            freelancerSigned: updated.freelancerSigned
        });

        console.log('Database contract updated:', {
            contractId: contract.contractId,
            status: updated.status, // Use status from the updated document
            clientSigned: updated.clientSigned,
            freelancerSigned: updated.freelancerSigned
        });

        // Combine database and refetched blockchain data
        const updatedContractData = {
            ...contract.toObject(),
            blockchainState: blockchainState,
            clientApproved: isClientSigned,
            freelancerApproved: isFreelancerSigned,
            clientSigned: isClientSigned,
            freelancerSigned: isFreelancerSigned
        };

        console.log('Final contract data:', {
            contractId: contract.contractId,
            status: updatedContractData.status,
            clientApproved: updatedContractData.clientApproved,
            freelancerApproved: updatedContractData.freelancerApproved,
            blockchainState: {
                status: updatedContractData.blockchainState.status,
                clientApproved: updatedContractData.blockchainState.clientApproved,
                freelancerApproved: updatedContractData.blockchainState.freelancerApproved
            }
        });

        res.status(200).json({
            success: true,
            data: updatedContractData
        });
    } catch (err) {
        console.error('Error in signContract endpoint:', err);
        let errorMessage = 'Failed to sign contract';
        if (err.message) {
            errorMessage += `: ${err.message}`;
        } else if (err.reason) {
            errorMessage += `: ${err.reason}`;
        }
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
};

exports.depositFunds = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        await contractUtils.depositFunds(contract.contractId, amount);
        
        contract.status = 'funded';
        await contract.save();

        res.status(200).json({
            success: true,
            message: 'Funds deposited successfully',
            data: contract
        });
    } catch (err) {
        console.error('Error depositing funds:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.submitWork = async (req, res) => {
    try {
        const { id } = req.params;
        const { workHash } = req.body;

        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        await contractUtils.submitWork(contract.contractId, workHash);
        
        contract.status = 'work_submitted';
        await contract.save();

        res.status(200).json({
            success: true,
            message: 'Work submitted successfully',
            data: contract
        });
    } catch (err) {
        console.error('Error submitting work:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.approveWork = async (req, res) => {
    try {
        const { id } = req.params;

        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        await contractUtils.approveWork(contract.contractId);
        
        contract.status = 'work_approved';
        await contract.save();

        res.status(200).json({
            success: true,
            message: 'Work approved successfully',
            data: contract
        });
    } catch (err) {
        console.error('Error approving work:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.releasePayment = async (req, res) => {
    try {
        const { id } = req.params;

        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        await contractUtils.releasePayment(contract.contractId);
        
        contract.status = 'completed';
        await contract.save();

        res.status(200).json({
            success: true,
            message: 'Payment released successfully',
            data: contract
        });
    } catch (err) {
        console.error('Error releasing payment:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.rejectWork = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason, transactionHash } = req.body;

        if (!rejectionReason) {
            return res.status(400).json({
                success: false,
                error: 'Rejection reason is required'
            });
        }

        // Find contract by contractId (number) instead of _id
        const contract = await Contract.findOne({ contractId: parseInt(id) });
        
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        // Update contract status and rejection details
        const updatedContract = await Contract.findOneAndUpdate(
            { contractId: parseInt(id) },
            {
                $set: {
                    status: 'disputed',
                    rejectionReason: rejectionReason,
                    rejectionTransactionHash: transactionHash,
                    updatedAt: new Date()
                }
            },
            { new: true }
        ).populate('client', 'name walletAddress')
         .populate('freelancer', 'name walletAddress')
         .populate('job', 'title description');

        if (!updatedContract) {
            return res.status(500).json({
                success: false,
                error: 'Failed to update contract status'
            });
        }

        // Create a notification for the admin
        await notificationService.notify(
            null, // No specific user ID for admin notifications
            'dispute',
            `Contract #${updatedContract.contractId} has been rejected by the client. Reason: ${rejectionReason}`,
            `/admin/disputes/${updatedContract._id}`,
            null, // No socket.io instance in this context
            req.user._id, // Sender ID (the client who rejected)
            true // This is an admin notification
        );

        res.json({
            success: true,
            data: updatedContract
        });
    } catch (err) {
        console.error('Error in rejectWork:', err);
        res.status(500).json({
            success: false,
            error: err.message || 'Failed to reject work'
        });
    }
};

exports.deleteContract = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the contract
        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        // Only allow deletion if contract is in 'created' state
        if (contract.status !== 'created') {
            return res.status(400).json({
                success: false,
                error: 'Can only delete contracts in created state'
            });
        }

        // Delete the contract
        await Contract.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Contract deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting contract:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};