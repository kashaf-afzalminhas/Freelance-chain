const Bid = require("../models/Bid");
const Job = require("../models/Job");
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'bids');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'bidMedia-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'application/pdf', 
    'video/mp4', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} are allowed.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
}).array('bidMedia', 5); // Allow up to 5 files

// Get top bids for a job
exports.getTopBids = async (req, res) => {
  try {
    const { jobId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format"
      });
    }

    const topBids = await Bid.find({ jobId, status: 'pending' })
      .sort({ bidAmount: 1 })
      .limit(limit)
      .select('bidAmount createdAt');

    res.status(200).json({
      success: true,
      data: topBids
    });

  } catch (error) {
    console.error("Error fetching top bids:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching top bids"
    });
  }
};

// Get single bid details
exports.getBidDetails = async (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.user._id;

    const bid = await Bid.findById(bidId)
      .populate('jobId', 'title description clientId')
      .populate('freelancerId', 'username email profilePicture name');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found"
      });
    }

    // Check if user has permission to view this bid
    const isClient = String(bid.jobId.clientId) === String(userId);
    const isFreelancer = String(bid.freelancerId._id) === String(userId);

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this bid"
      });
    }

    res.status(200).json({
      success: true,
      data: bid
    });

  } catch (error) {
    console.error("Error fetching bid details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bid details"
    });
  }
};

// Handle file upload middleware
exports.uploadBidMedia = (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    // Log successful file upload
    if (req.files && req.files.length > 0) {
      console.log('Files uploaded successfully:', req.files.map(f => f.filename));
    }
    next();
  });
};

// Helper function to map mimetype to schema type
function getMediaType(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.startsWith('video/')) return 'video';
  if (
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) return 'document';
  return 'document';
}

// Helper function to get file URL
const getFileUrl = (filename) => {
  return `/uploads/bids/${filename}`;
};

// Submit a new bid
exports.submitBid = async (req, res) => {
  try {
    const { jobId, proposal, bidAmount, estimatedTime, freelancerAddress } = req.body;
    const freelancerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format"
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const existingBid = await Bid.findOne({ jobId, freelancerId });
    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: "You've already submitted a bid for this job"
      });
    }

    // Process uploaded files
    const bidMedia = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        bidMedia.push({
          url: getFileUrl(file.filename),
          type: getMediaType(file.mimetype),
          name: file.originalname,
          size: file.size,
          uploadedAt: new Date()
        });
      });
    }

    // Create new bid with media
    const bid = new Bid({
      jobId,
      freelancerId,
      freelancerAddress,
      proposal,
      bidAmount,
      estimatedTime,
      bidMedia,
      status: "pending"
    });

    await bid.save();

    // Log successful bid creation
    console.log('Bid created successfully:', {
      bidId: bid._id,
      jobId,
      freelancerId,
      mediaCount: bidMedia.length,
      mediaUrls: bidMedia.map(m => m.url)
    });

    res.status(201).json({
      success: true,
      data: bid,
      message: "Bid submitted successfully"
    });

  } catch (error) {
    console.error("Error submitting bid:", error);
    
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

// Get bids for a specific job
exports.getBidsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const bids = await Bid.find({ jobId })
      .populate('freelancerId', 'username email walletAddress profilePicture name')
      .sort({ createdAt: -1 });

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

// Update bid status
exports.updateBidStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bid = await Bid.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('freelancerId', 'name email profilePicture');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found"
      });
    }

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
    console.log('Backend updateBid received:', { body: req.body, files: req.files });
    const { proposal, bidAmount, estimatedTime } = req.body;
    const bidId = req.params.id;
    const freelancerId = req.user._id;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found"
      });
    }

    if (String(bid.freelancerId) !== String(freelancerId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this bid"
      });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Bid cannot be edited after being accepted, rejected, or withdrawn"
      });
    }

    // Store current bid data in history before updating
    bid.history.push({
      proposal: bid.proposal,
      bidAmount: bid.bidAmount,
      estimatedTime: bid.estimatedTime,
      bidMedia: bid.bidMedia
    });

    // Update text fields if provided
    if (proposal !== undefined) bid.proposal = proposal;
    if (bidAmount !== undefined) bid.bidAmount = bidAmount;
    if (estimatedTime !== undefined) bid.estimatedTime = estimatedTime;

    // --- Handle Media Updates ---
    let updatedMedia = [];

    // 1. Include existing files that were not removed
    const existingFilesData = req.body.existingFiles;
    if (existingFilesData) {
      let existingFilesToKeep = [];
      if (Array.isArray(existingFilesData)) {
        // If it's an array (multiple existing files)
        existingFilesToKeep = existingFilesData.map(file => JSON.parse(file));
      } else if (typeof existingFilesData === 'string') {
        // If it's a single string (one existing file)
        try {
          existingFilesToKeep = [JSON.parse(existingFilesData)];
        } catch (parseError) {
          console.error('Error parsing single existing file JSON string:', parseError);
          // Handle error if JSON parsing fails for a single file
          // Depending on requirements, you might return an error response or skip the file
        }
      }
      updatedMedia = [...existingFilesToKeep];
    }

    // 2. Add newly uploaded files from req.files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        updatedMedia.push({
          url: getFileUrl(file.filename),
          type: getMediaType(file.mimetype),
          name: file.originalname,
          size: file.size,
          uploadedAt: new Date()
        });
      });
      // Note: We are not currently deleting old files from the filesystem. 
      // This could be added later if needed for cleanup.
    }

    // Update the bidMedia array in the bid document
    bid.bidMedia = updatedMedia;
    // --- End Media Handling ---

    await bid.save();

    // Fetch the updated bid to return the complete data, including populated fields if necessary
    const updatedBid = await Bid.findById(bidId)
      .populate('jobId', 'title description budget duration') // Populate fields needed by frontend
      .populate('freelancerId', 'username email walletAddress profilePicture name');

    res.status(200).json({
      success: true,
      data: updatedBid,
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