const Bid = require("../models/Bid");
const Job = require("../models/Job");

// Submit a Bid
exports.submitBid = async (req, res) => {
  const { jobId, proposal, bidAmount, estimatedTime } = req.body;
  const freelancerId = req.user._id; // From JWT auth

  try {
    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job || job.status !== "open") {
      return res.status(400).json({ error: "Job not available for bidding" });
    }

    // Prevent duplicate bids
    const existingBid = await Bid.findOne({ jobId, freelancerId });
    if (existingBid) {
      return res.status(400).json({ error: "You already bid on this job" });
    }

    // Create new bid
    const bid = new Bid({
      jobId,
      freelancerId,
      proposal,
      bidAmount,
      estimatedTime,
    });

    await bid.save();

    res.status(201).json(bid);
  } catch (error) {
    console.error("Bid submission error:", error);
    res.status(500).json({ error: "Failed to submit bid" });
  }
};

// Get all bids for a job (Client view)
exports.getBidsForJob = async (req, res) => {
  const { jobId } = req.params;
  const clientId = req.user._id;

  try {
    // Verify client owns the job
    const job = await Job.findOne({ _id: jobId, clientId });
    if (!job) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const bids = await Bid.find({ jobId }).populate("freelancerId", "name walletAddress rating");
    res.json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ error: "Failed to fetch bids" });
  }
};