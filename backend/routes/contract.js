const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const {
    createContract,
    clientSignAndDeposit,
    freelancerSign,
    submitWork,
    approveWork,
    rejectWork,
    raiseDispute,
    resolveDispute,
    requestRefund,
    getContractState
} = require('../utils/contractUtils');
const { getProvider, getSigner } = require('../utils/web3Utils');
const { validateAddress } = require('../utils/validationUtils');

// Create a new contract
router.post('/create', async (req, res) => {
    try {
        const { freelancerAddress, bidAmount, deadline, jobTitle, jobDescription } = req.body;
        
        if (!validateAddress(freelancerAddress)) {
            return res.status(400).json({ error: 'Invalid freelancer address' });
        }

        const signer = await getSigner();
        const contractData = {
            freelancerAddress,
            bidAmount,
            deadline,
            jobTitle,
            jobDescription
        };

        const result = await createContract(contractData, signer);
        
        const contract = new Contract({
            contractId: result.contractId,
            client: await signer.getAddress(),
            freelancer: freelancerAddress,
            bidAmount,
            deadline,
            jobTitle,
            jobDescription,
            status: 'Created',
            transactionHash: result.transactionHash
        });

        await contract.save();
        res.status(201).json(contract);
    } catch (error) {
        console.error('Error creating contract:', error);
        res.status(500).json({ error: error.message });
    }
});

// Client sign and deposit funds
router.post('/:id/client-sign', async (req, res) => {
    try {
        const { id } = req.params;
        const signer = await getSigner();
        
        await clientSignAndDeposit(id, signer);
        
        const contract = await Contract.findOne({ contractId: id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        contract.status = 'ClientSigned';
        contract.fundsDeposited = true;
        await contract.save();

        res.json(contract);
    } catch (error) {
        console.error('Error in client sign and deposit:', error);
        res.status(500).json({ error: error.message });
    }
});

// Freelancer sign contract
router.post('/:id/freelancer-sign', async (req, res) => {
    try {
        const { id } = req.params;
        const signer = await getSigner();
        
        await freelancerSign(id, signer);
        
        const contract = await Contract.findOne({ contractId: id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        contract.status = 'BothSigned';
        await contract.save();

        res.json(contract);
    } catch (error) {
        console.error('Error in freelancer sign:', error);
        res.status(500).json({ error: error.message });
    }
});

// Submit work
router.post('/:id/submit-work', async (req, res) => {
    try {
        const { id } = req.params;
        const { workHash } = req.body;
        const signer = await getSigner();
        
        await submitWork(id, workHash, signer);
        
        const contract = await Contract.findOne({ contractId: id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        contract.status = 'WorkSubmitted';
        contract.workSubmissionHash = workHash;
        await contract.save();

        res.json(contract);
    } catch (error) {
        console.error('Error submitting work:', error);
        res.status(500).json({ error: error.message });
    }
});

// Approve work
router.post('/:id/approve-work', async (req, res) => {
    try {
        const { id } = req.params;
        const signer = await getSigner();
        
        await approveWork(id, signer);
        
        const contract = await Contract.findOne({ contractId: id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        contract.status = 'Completed';
        await contract.save();

        res.json(contract);
    } catch (error) {
        console.error('Error approving work:', error);
        res.status(500).json({ error: error.message });
    }
});

// Reject work
router.post('/:id/reject-work', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const signer = await getSigner();
        
        await rejectWork(id, reason, signer);
        
        const contract = await Contract.findOne({ contractId: id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        contract.status = 'Disputed';
        contract.rejectionReason = reason;
        await contract.save();

        res.json(contract);
    } catch (error) {
        console.error('Error rejecting work:', error);
        res.status(500).json({ error: error.message });
    }
});

// Raise dispute
router.post('/:id/raise-dispute', async (req, res) => {
    try {
        const { id } = req.params;
        const signer = await getSigner();
        
        await raiseDispute(id, signer);
        
        const contract = await Contract.findOne({ contractId: id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        contract.status = 'Disputed';
        await contract.save();

        res.json(contract);
    } catch (error) {
        console.error('Error raising dispute:', error);
        res.status(500).json({ error: error.message });
    }
});

// Resolve dispute
router.post('/:id/resolve-dispute', async (req, res) => {
    try {
        const { id } = req.params;
        const { clientShare, freelancerShare } = req.body;
        const signer = await getSigner();
        
        await resolveDispute(id, clientShare, freelancerShare, signer);
        
        const contract = await Contract.findOne({ contractId: id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        contract.status = 'Completed';
        contract.disputeResolution = {
            clientShare,
            freelancerShare,
            resolvedAt: new Date()
        };
        await contract.save();

        res.json(contract);
    } catch (error) {
        console.error('Error resolving dispute:', error);
        res.status(500).json({ error: error.message });
    }
});

// Request refund
router.post('/:id/request-refund', async (req, res) => {
    try {
        const { id } = req.params;
        const signer = await getSigner();
        
        await requestRefund(id, signer);
        
        const contract = await Contract.findOne({ contractId: id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        contract.status = 'Refunded';
        await contract.save();

        res.json(contract);
    } catch (error) {
        console.error('Error requesting refund:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get contract state
router.get('/:id/state', async (req, res) => {
    try {
        const { id } = req.params;
        const signer = await getSigner();
        
        const state = await getContractState(id, signer);
        res.json(state);
    } catch (error) {
        console.error('Error getting contract state:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get contract by ID
router.get('/:id', async (req, res) => {
    try {
        const contract = await Contract.findOne({ contractId: req.params.id });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        res.json(contract);
    } catch (error) {
        console.error('Error getting contract:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all contracts for a user
router.get('/user/:address', async (req, res) => {
    try {
        const { address } = req.params;
        if (!validateAddress(address)) {
            return res.status(400).json({ error: 'Invalid address' });
        }

        const contracts = await Contract.find({
            $or: [
                { client: address },
                { freelancer: address }
            ]
        }).sort({ createdAt: -1 });

        res.json(contracts);
    } catch (error) {
        console.error('Error getting user contracts:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 