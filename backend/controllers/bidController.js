const Bid = require("../models/Bid");
const Job = require("../models/Job");
const mongoose = require('mongoose');
exports.submitBid = async (req, res) => {
    try {
      const { jobId, proposal, bidAmount, estimatedTime, freelancerAddress } = req.body;
      const freelancerId = req.user._id; // This comes from auth middleware
  
      // Validate jobId is a valid MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid Job ID format" 
        });
      }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: "Job not found" 
      });
    }

    // Prevent duplicate bids
    const existingBid = await Bid.findOne({ jobId, freelancerId });
    if (existingBid) {
      return res.status(400).json({ 
        success: false,
        message: "You've already submitted a bid for this job" 
      });
    }

    const bid = new Bid({
        jobId,
        freelancerId,
        freelancerAddress,
        proposal,
        bidAmount,
        estimatedTime,
        status: "pending"
      });
    await bid.save();

    res.status(201).json({
      success: true,
      data: bid,
      message: "Bid submitted successfully"
    });

  } catch (error) {
    console.error("Error submitting bid:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Server error while submitting bid" 
    });
  }
};

exports.getBidsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate jobId
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Get all bids for this job
    const bids = await Bid.find({ jobId }).populate('freelancerId', 'username email');

    res.status(200).json({
      success: true,
      data: bids
    });

  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bids"
    });
  }
};