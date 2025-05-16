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

exports.updateBidStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const bid = await Bid.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate('freelancerId', 'name email');
  
      if (!bid) {
        return res.status(404).json({
          success: false,
          message: "Bid not found"
        });
      }
  
      // Optional: Update job status if bid is accepted
      if (status === 'accepted') {
        await Job.findByIdAndUpdate(bid.jobId, { status: 'in_progress' });
      }
  
      res.status(200).json({
        success: true,
        data: bid,
        message: "Bid status updated successfully"
      });
    } catch (error) {
      console.error("Error updating bid status:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating bid status"
      });
    }
  };

  // Get all bids for the current freelancer
exports.getMyBids = async (req, res) => {
    try {
      const bids = await Bid.find({ freelancerId: req.user._id })
        .populate('jobId', 'title description budget duration')
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        data: bids
      });
    } catch (error) {
      console.error("Error fetching freelancer bids:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching bids"
      });
    }
  };
  
  // Update a bid
  exports.updateBid = async (req, res) => {
    try {
      const { proposal, bidAmount, estimatedTime } = req.body;
      const bidId = req.params.id;
      const freelancerId = req.user._id;
  
      // Find the bid
      const bid = await Bid.findById(bidId);
      if (!bid) {
        return res.status(404).json({
          success: false,
          message: "Bid not found"
        });
      }
  
      // Verify the freelancer owns the bid
      if (String(bid.freelancerId) !== String(freelancerId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to update this bid"
        });
      }
  
      // Check if bid can be edited
      if (bid.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: "Bid cannot be edited after being accepted, rejected, or withdrawn"
        });
      }
  
      // Add current version to history before updating
      bid.history.push({
        proposal: bid.proposal,
        bidAmount: bid.bidAmount,
        estimatedTime: bid.estimatedTime
      });
  
      // Update bid fields
      bid.proposal = proposal || bid.proposal;
      bid.bidAmount = bidAmount || bid.bidAmount;
      bid.estimatedTime = estimatedTime || bid.estimatedTime;
  
      await bid.save();
  
      res.status(200).json({
        success: true,
        data: bid,
        message: "Bid updated successfully"
      });
    } catch (error) {
      console.error("Error updating bid:", error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          message: messages.join(', ')
        });
      }
  
      res.status(500).json({
        success: false,
        message: "Server error while updating bid"
      });
    }
  };