const notificationService = require('../services/notificationService');
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const result = await notificationService.getUserNotifications(userId, parseInt(page), parseInt(limit));
    
    // Ensure all notifications have populated sender information
    const populatedNotifications = await Promise.all(
      result.notifications.map(async (notification) => {
        if (!notification.senderId || typeof notification.senderId === 'string') {
          return await Notification.findById(notification._id)
            .populate('senderId', 'name profileImage');
        }
        return notification;
      })
    );
    res.json({
      success: true,
      data: {
        ...result,
        notifications: populatedNotifications
      }
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    console.log(`Attempting to mark notification as read: notificationId=${notificationId}, userId=${userId}`);

    const notification = await notificationService.markAsRead(notificationId, userId);
    
    if (!notification) {
      console.warn(`Notification not found or user mismatch: notificationId=${notificationId}, userId=${userId}`);
      return res.status(404).json({
        success: false,
        message: 'Notification not found or you do not have permission to mark it as read'
      });
    }

    // Populate sender information before sending response
    const populatedNotification = await Notification.findById(notification._id)
      .populate('senderId', 'name profileImage');

    console.log(`Successfully marked notification as read: notificationId=${notificationId}`);

    res.json({
      success: true,
      data: populatedNotification
    });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
}; 