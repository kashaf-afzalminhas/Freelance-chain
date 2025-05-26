const { v4: uuidv4 } = require('uuid');
const Job = require('../models/Job');
const User = require('../models/User'); // Import User model

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new job
exports.createJob = async (req, res) => {
  try {
    const { title, description, budget, duration, skills, levels } = req.body;
    const jobData = { 
      title, 
      description, 
      budget, 
      duration, 
      skills, 
      levels,
      clientId: req.user._id // Add the authenticated user's ID
    };
    const newJob = new Job(jobData);
    await newJob.save();

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(400).json({ message: 'Failed to create job', error: error.message });
  }
};

// Update job status
exports.updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Submit proposal
exports.submitProposal = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.proposals.push({
      freelancer: req.body.freelancer,
      proposal: req.body.proposal,
      bid: req.body.bid,
    });

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// In jobController.js
exports.getMyJobs = async (req, res) => {
  try {
    console.log('Fetching jobs for user:', req.user._id);
    
    const jobs = await Job.find({ clientId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('clientId', 'name email'); // Optional: populate client info
    
    console.log(`Found ${jobs.length} jobs for user ${req.user._id}`);
    res.json(jobs);
  } catch (error) {
    console.error('Error in getMyJobs:', error);
    res.status(500).json({ 
      message: 'Server error while fetching your jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// controllers/jobController.js

// Save a job
exports.saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsave a job
exports.unsaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;

    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.json({ message: 'Job removed from saved', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get saved jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    // Only allow the client who posted the job to delete it
    if (job.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};