const WorkSubmission = require('../models/WorkSubmission');
const Contract = require('../models/Contract');

exports.submitWork = async (req, res) => {
    try {
        const { contractId, workDescription, fileHash } = req.body;
        
        const contract = await Contract.findById(contractId);
        if (!contract) {
            return res.status(404).json({
                success: false,
                error: 'Contract not found'
            });
        }

        // Verify user is the freelancer
        if (req.user.id !== contract.freelancer.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Only the freelancer can submit work'
            });
        }

        const newSubmission = new WorkSubmission({
            contract: contractId,
            freelancer: req.user.id,
            workDescription,
            fileHash
        });

        await newSubmission.save();
        
        // Update contract status
        contract.status = 'work_submitted';
        await contract.save();

        // Call blockchain to submit work
        await submitWorkToContract(contract.contractAddress, fileHash);

        res.status(201).json({
            success: true,
            data: newSubmission
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.approveWork = async (req, res) => {
    try {
        const { submissionId } = req.body;
        
        const submission = await WorkSubmission.findById(submissionId)
            .populate('contract');
            
        if (!submission) {
            return res.status(404).json({
                success: false,
                error: 'Work submission not found'
            });
        }

        // Verify user is the client
        if (req.user.id !== submission.contract.client.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Only the client can approve work'
            });
        }

        // Update submission
        submission.status = 'approved';
        submission.approvedAt = new Date();
        await submission.save();

        // Update contract
        const contract = submission.contract;
        contract.status = 'completed';
        await contract.save();

        // Call blockchain to approve work
        await approveWorkOnContract(contract.contractAddress);

        res.status(200).json({
            success: true,
            data: submission
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};