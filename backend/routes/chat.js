const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRecentChats } = require('../controllers/chatController');

router.get('/recent', auth, getRecentChats);

module.exports = router;