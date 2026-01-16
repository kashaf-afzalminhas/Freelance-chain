const express = require('express');
const {
    createContract,
    getContract,
    signContract,
    getUserContracts,
    depositFunds,
    submitWork,
    approveWork,
    releasePayment,
    deleteContract,
    rejectWork
} = require('../controllers/contractController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new contract
router.post('/', auth, createContract);

// Get all user's contracts
router.get('/user', auth, getUserContracts);

// Get specific contract by ID
router.get('/:id', auth, getContract);

// Sign a contract
router.post('/:id/sign', auth, signContract);

// Delete a contract
router.delete('/:id', auth, deleteContract);

// Deposit funds into contract
router.post('/:id/deposit', auth, depositFunds);

// Submit work for contract
router.post('/:id/submit-work', auth, submitWork);

// Approve work for contract
router.post('/:id/approve-work', auth, approveWork);

// Reject work for contract
router.post('/:id/reject-work', auth, rejectWork);

// Release payment for contract
router.post('/:id/release-payment', auth, releasePayment);

module.exports = router;
