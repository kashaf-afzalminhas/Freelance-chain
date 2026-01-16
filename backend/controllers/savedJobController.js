// controllers/savedJobController.js
const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user._id;

    // Check if already saved
    const existing = await SavedJob.findOne({ userId, jobId });
    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = new SavedJob({ userId, jobId });
    await savedJob.save();

    res.status(201).json({ 
      message: 'Job saved successfully',
      savedJob
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const savedJobs = await SavedJob.find({ userId })
      .populate({
        path: 'jobId',
        populate: {
          path: 'clientId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.json(savedJobs.map(item => item.jobId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const result = await SavedJob.findOneAndDelete({ userId, jobId });

    if (!result) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({ message: 'Job unsaved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};