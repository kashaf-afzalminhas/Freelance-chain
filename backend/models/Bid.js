const mongoose = require("mongoose");

const bidHistorySchema = new mongoose.Schema({
  proposal: String,
  bidAmount: Number,
  estimatedTime: String,
  updatedAt: { type: Date, default: Date.now }
});

const bidSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job", 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  freelancerAddress: {
    type: String,
    required: true,
    match: [/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"]
  },
  proposal: { 
    type: String, 
    required: true,
    minlength: [50, "Proposal must be at least 50 characters"]
  },
  bidAmount: { 
    type: Number, 
    required: true,
    min: [0.001, "Bid amount must be at least 0.001 ETH"]
  },
  estimatedTime: { 
    type: String, 
    required: true,
    enum: ["7 days", "14 days", "30 days", "custom"]
  },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected", "withdrawn"], 
    default: "pending" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  history: [bidHistorySchema] // Track previous versions
});

bidSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model("Bid", bidSchema);