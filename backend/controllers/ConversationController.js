const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({
      participants: userId,
    }).sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

exports.createConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Validate senderId and receiverId
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        lastMessage: "",
      });

      await conversation.save();
    }

    res.status(201).json(conversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ message: "Failed to start conversation", error: err.message });
  }
};

exports.getConversationById = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the conversation ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(id).populate("participants", "-password");
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (err) {
    console.error("Error fetching conversation by ID:", err);
    res.status(500).json({ message: "Failed to fetch conversation", error: err.message });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.log("Querying conversations for userId:", userId); // Debugging

    // Use `new` to create an ObjectId instance
    const conversations = await Conversation.find({
      participants: new mongoose.Types.ObjectId(userId),
    }).sort({ updatedAt: -1 });

    console.log("Fetched conversations:", conversations); // Debugging

    res.json(conversations);
  } catch (err) {
    console.error("Error fetching user conversations:", err);
    res.status(500).json({ message: "Failed to fetch user conversations", error: err.message });
  }
};

exports.getConversationBetweenUsers = async (req, res) => {
  try {
    const { firstUserId, secondUserId } = req.params;
    const conversation = await Conversation.findOne({
      participants: { $all: [firstUserId, secondUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (err) {
    console.error('Error fetching conversation between users:', err);
    res.status(500).json({ message: "Failed to fetch conversation", error: err.message });
  }
};

