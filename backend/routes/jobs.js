const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Create a new job
router.post('/', jobController.createJob);

// Get all jobs
router.get('/', jobController.getJobs);

// Get a specific job
router.get('/:id', jobController.getJobById);

// Update job status
router.put('/:id/status', jobController.updateJobStatus);

// Submit a proposal
router.post('/:id/proposals', jobController.submitProposal);

module.exports = router;