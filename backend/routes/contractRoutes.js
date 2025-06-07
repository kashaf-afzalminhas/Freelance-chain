const express = require('express');
const {
    createContract,
    getContract,
    signContract,
    getUserContracts
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

module.exports = router;