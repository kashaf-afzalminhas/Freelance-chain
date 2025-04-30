const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// Send a message
router.post("/", messageController.sendMessage);

// Get messages of a specific conversation
router.get("/:conversationId", messageController.getMessages);

// Mark a message as read
router.patch('/:messageId/read', auth, messageController.markMessageAsRead);

module.exports = router;
