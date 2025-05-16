// backend/controllers/contractController.js
const contractUtils = require('../utils/contractUtils');

exports.createContract = async (req, res) => {
    try {
        const contractData = {
            freelancerAddress: req.body.freelancerAddress,
            bidAmount: req.body.bidAmount,
            deadline: req.body.deadline,
            jobTitle: req.body.jobTitle,
            jobDescription: req.body.jobDescription
        };

        const result = await contractUtils.deployContract(contractData);
        
        res.status(201).json({
            success: true,
            contractAddress: result.address,
            transactionHash: result.transactionHash
        });
    } catch (err) {
        console.error('Error creating contract:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.getContract = async (req, res) => {
    try {
        const contractAddress = req.params.id || req.query.address;
        if (!contractAddress) {
            return res.status(400).json({
                success: false,
                error: 'Contract address is required'
            });
        }

        const contractState = await contractUtils.getContractState(contractAddress);
        res.status(200).json({
            success: true,
            data: contractState
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.signContract = async (req, res) => {
    try {
        const contractId = req.params.id;
        // Add your signing logic here
        // For example:
        // const result = await contractUtils.signContract(contractId, req.user.walletAddress);
        
        res.status(200).json({
            success: true,
            message: 'Contract signed successfully',
            contractId
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};