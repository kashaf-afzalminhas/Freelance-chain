const express = require('express');
const {
    createContract,
    getContract,
    signContract
} = require('../controllers/contractController');
const auth = require('../middleware/auth'); // Keep using auth.js as is

const router = express.Router();

// Apply auth middleware directly (since it's the default export)
router.post('/', auth, createContract);
router.get('/', auth, getContract);
router.get('/:id', auth, getContract);
router.post('/:id/sign', auth, signContract);

module.exports = router;