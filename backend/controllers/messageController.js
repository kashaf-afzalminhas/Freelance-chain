const Message = require("../models/message");
const Conversation = require("../models/Conversation");
const notificationService = require('../services/notificationService');

exports.sendMessage = async (req, res) => {
  const { conversationId, senderId, text } = req.body;

  try {
    // Validate conversationId and senderId
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: "Sender is not a participant in the conversation" });
    }

    const message = new Message({
      conversationId,
      senderId,
      text,
      timestamp: new Date(),
    });

    await message.save();

    // Update last message and timestamp in conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: new Date(),
    });

    // Get receiver ID (the other participant)
    const receiverId = conversation.participants.find(id => id.toString() !== senderId);

    // Create notification for receiver
    await notificationService.notify(
      receiverId,
      'message',
      text,
      `/messages/${conversationId}`,
      req.app.get('io'),
      senderId
    );

    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 })
      .populate("readBy", "name email"); // Populate readBy with user details

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};

exports.markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Add userId to readBy array if not already present
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }

    res.json({ message: "Message marked as read" });
  } catch (err) {
    console.error("Error marking message as read:", err);
    res.status(500).json({ message: "Failed to mark message as read", error: err.message });
  }
};

