// routes/savedJobs.js
const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, savedJobController.saveJob);
router.get('/', authMiddleware, savedJobController.getSavedJobs);
router.delete('/:jobId', authMiddleware, savedJobController.unsaveJob);

module.exports = router;