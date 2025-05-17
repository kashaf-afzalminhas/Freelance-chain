// backend/controllers/contractController.js
const Contract = require('../models/Contract');
const contractUtils = require('../utils/contractUtils');

// Initialize contract utils when the application starts
(async () => {
    try {
        await contractUtils.initialize();
        console.log('Contract utilities initialized successfully');
    } catch (err) {
        console.error('Failed to initialize contract utilities:', err);
    }
})();

exports.createContract = async (req, res) => {
    try {
        const contractData = {
            freelancerAddress: req.body.freelancerAddress,
            bidAmount: req.body.bidAmount,
            deadline: req.body.deadline,
            jobTitle: req.body.jobTitle,
            jobDescription: req.body.jobDescription
        };

        // Deploy contract to blockchain
        const result = await contractUtils.deployContract(contractData);
        
        // Create contract in database
        const contract = new Contract({
            job: req.body.jobId,
            bid: req.body.bidId,
            client: req.user._id, // Assuming req.user is set by auth middleware
            freelancer: req.body.freelancerId,
            contractAddress: result.address,
            bidAmount: req.body.bidAmount,
            jobTitle: req.body.jobTitle,
            jobDescription: req.body.jobDescription,
            deadline: req.body.deadline,
            transactionHash: result.transactionHash
        });

        await contract.save();
        
        res.status(201).json({
            success: true,
            data: contract
        });
    } catch (err) {
        console.error('Error creating contract:', err);
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
                    if (!contract.contractAddress) {
                        console.log('No contract address for contract:', contract._id);
                        return {
                            ...contract,
                            blockchainState: null
                        };
                    }

                    console.log('Fetching blockchain state for contract:', contract._id);
                    const blockchainState = await contractUtils.getContractState(contract.contractAddress);
                    console.log('Blockchain state fetched:', contract._id);
                    
                    return {
                        ...contract,
                        blockchainState: {
                            status: blockchainState.status,
                            clientApproved: blockchainState.clientApproved,
                            freelancerApproved: blockchainState.freelancerApproved,
                            workSubmissionHash: blockchainState.workSubmissionHash,
                            bidAmount: blockchainState.bidAmount,
                            deadline: blockchainState.deadline
                        }
                    };
                } catch (err) {
                    console.error(`Error fetching blockchain state for contract ${contract._id}:`, err.message);
                    return {
                        ...contract,
                        blockchainState: null
                    };
                }
            })
        );

        console.log('Sending response with contracts:', contractsWithState.length);
        res.status(200).json({
            success: true,
            data: contractsWithState
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
            // Get the blockchain state of the contract
            const blockchainState = await contractUtils.getContractState(contract.contractAddress);
            
            // Update contract status based on blockchain state
            if (blockchainState.status !== contract.status) {
                contract.status = blockchainState.status;
                await contract.save();
            }

            // Combine database and blockchain data
            const contractData = {
                ...contract.toObject(),
                blockchainState
            };

            res.status(200).json({
                success: true,
                data: contractData
            });
        } catch (err) {
            console.error('Error fetching blockchain state:', err);
            // Return database data if blockchain fetch fails
            res.status(200).json({
                success: true,
                data: contract,
                warning: 'Blockchain state not available'
            });
        }
    } catch (err) {
        console.error('Error getting contract:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.signContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { signerAddress } = req.body;

        // Find the contract
        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        // Sign the contract on the blockchain
        const result = await contractUtils.signContract(contract.contractAddress, signerAddress);

        // Update the contract status in the database
        if (signerAddress === contract.client.walletAddress) {
            contract.clientSigned = true;
            contract.status = 'client_signed';
        } else if (signerAddress === contract.freelancer.walletAddress) {
            contract.freelancerSigned = true;
            contract.status = 'freelancer_signed';
        }

        if (contract.clientSigned && contract.freelancerSigned) {
            contract.status = 'freelancer_signed';
        }

        await contract.save();
        
        res.status(200).json({
            success: true,
            message: 'Contract signed successfully',
            data: contract
        });
    } catch (err) {
        console.error('Error signing contract:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};