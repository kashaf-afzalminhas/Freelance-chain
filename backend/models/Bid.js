const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  proposal: { type: String, required: true },
  bidAmount: { type: Number, required: true }, // In ETH
  estimatedTime: { type: String, required: true }, // e.g., "2 weeks"
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bid", bidSchema);