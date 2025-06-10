const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get user's notifications
router.get('/', auth, notificationController.getNotifications);

// Mark notification as read
router.patch('/:notificationId/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', auth, notificationController.markAllAsRead);

// Get notification settings
router.get('/settings', auth, notificationController.getNotificationSettings);

// Update notification settings
router.patch('/settings', auth, notificationController.updateNotificationSettings);

module.exports = router; 