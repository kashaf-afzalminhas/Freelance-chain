const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');
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
// Add this to your jobs.js routes
router.get('/my-jobs', auth, jobController.getMyJobs);

module.exports = router;