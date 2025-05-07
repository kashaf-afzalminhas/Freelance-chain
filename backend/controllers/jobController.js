const { v4: uuidv4 } = require('uuid');
const Job = require('../models/Job');

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