const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  lastMessage: {
    type: String,
    default: "",
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map(),
  }
}, { timestamps: true });

ConversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", ConversationSchema);