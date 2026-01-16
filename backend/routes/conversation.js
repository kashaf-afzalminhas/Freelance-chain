const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/ConversationController");

// Create a new conversation
router.post("/", conversationController.createConversation);

// Get all conversations for a specific user
router.get("/:userId", conversationController.getUserConversations);

// Get a specific conversation between two users
router.get("/find/:firstUserId/:secondUserId", conversationController.getConversationBetweenUsers);

// Get a conversation by its ID
router.get("/conversation/:id", conversationController.getConversationById);

module.exports = router;