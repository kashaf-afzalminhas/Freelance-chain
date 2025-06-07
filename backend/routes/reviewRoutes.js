const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Job = require('../models/Job');

// @route   POST api/reviews
// @desc    Create a review
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('jobId', 'Job ID is required').not().isEmpty(),
      check('revieweeId', 'Reviewee ID is required').not().isEmpty(),
      check('role', 'Role must be client or freelancer').isIn(['client', 'freelancer']),
      check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId, revieweeId, role, rating, comment } = req.body;

    try {
      // Check if job exists and is completed
      const job = await Job.findById(jobId);
      if (!job || job.status !== 'completed') {
        return res.status(400).json({ msg: 'Job is not completed or does not exist' });
      }

      // Check if user is involved in the job
      const isClient = job.client.toString() === req.user.id;
      const isFreelancer = job.freelancer && job.freelancer.toString() === req.user.id;
      
      if (!isClient && !isFreelancer) {
        return res.status(401).json({ msg: 'Not authorized to review this job' });
      }

      // Check if role matches the user's actual role
      if ((isClient && role !== 'client') || (isFreelancer && role !== 'freelancer')) {
        return res.status(400).json({ msg: 'Invalid role for this user' });
      }

      // Check if reviewee is the other party in the job
      const expectedReviewee = isClient ? job.freelancer : job.client;
      if (expectedReviewee.toString() !== revieweeId) {
        return res.status(400).json({ msg: 'Invalid reviewee for this job' });
      }

      // Check for existing review
      const existingReview = await Review.findOne({ jobId, reviewerId: req.user.id });
      if (existingReview) {
        return res.status(400).json({ msg: 'You have already reviewed this job' });
      }

      const review = new Review({
        jobId,
        reviewerId: req.user.id,
        revieweeId,
        role,
        rating,
        comment
      });

      await review.save();
      res.json(review);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/reviews/user/:userId
// @desc    Get all reviews for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reviews/job/:jobId
// @desc    Get review for a specific job
// @access  Public
router.get('/job/:jobId', async (req, res) => {
  try {
    const reviews = await Review.find({ jobId: req.params.jobId })
      .populate('reviewerId', 'name avatar')
      .populate('revieweeId', 'name avatar');

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;