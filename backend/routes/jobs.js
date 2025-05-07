const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Create a new job
router.post('/', auth, jobController.createJob);

// Get all jobs
router.get('/', jobController.getJobs);

// Get my jobs - MUST COME BEFORE THE :id ROUTE
router.get('/my-jobs', auth, jobController.getMyJobs);

// Get a specific job
router.get('/:id', jobController.getJobById);

// Update job status
router.put('/:id/status', auth, jobController.updateJobStatus);

// Submit a proposal
router.post('/:id/proposals', auth, jobController.submitProposal);

module.exports = router;