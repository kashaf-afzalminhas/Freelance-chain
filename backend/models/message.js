// const mongoose = require("mongoose");

// const MessageSchema = new mongoose.Schema({
//   conversationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Conversation",
//     required: true,
//   },
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// }, { timestamps: true });

// // module.exports = mongoose.model("Message", MessageSchema);
// module.exports = mongoose.models.Message || mongoose.model("Message", MessageSchema);


const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
}, { timestamps: true });

MessageSchema.pre("save", async function (next) {
  const conversation = await mongoose.model("Conversation").findById(this.conversationId);
  if (!conversation.participants.includes(this.senderId)) {
    return next(new Error("Sender must be a participant in the conversation."));
  }
  next();
});

MessageSchema.index({ conversationId: 1, timestamp: 1 });

module.exports = mongoose.models.Message || mongoose.model("Message", MessageSchema);