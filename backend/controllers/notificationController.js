const notificationService = require('../services/notificationService');
const { Notification } = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    console.log('Fetching notifications for user:', userId);

    if (!userId) {
      console.error('No user ID provided in request');
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const result = await notificationService.getUserNotifications(userId, parseInt(page), parseInt(limit));
    
    if (!result) {
      console.error('No result returned from getUserNotifications');
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }

    console.log('Notifications fetched successfully:', {
      count: result.notifications?.length,
      total: result.total,
      page: result.page
    });
    
    // Ensure all notifications have populated sender information
    const populatedNotifications = await Promise.all(
      result.notifications.map(async (notification) => {
        try {
          if (!notification.senderId || typeof notification.senderId === 'string') {
            const populated = await Notification.findById(notification._id)
              .populate('senderId', 'name profileImage');
            return populated || notification;
          }
          return notification;
        } catch (populateError) {
          console.error('Error populating notification:', populateError);
          return notification;
        }
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
    console.error('Stack trace:', error.stack);
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
    const userId = req.user._id;

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
    const userId = req.user._id;
    console.log(`Attempting to mark all notifications as read for user: ${userId}`);

    const result = await notificationService.markAllAsRead(userId);
    console.log('Mark all as read result:', result);

    if (!result) {
      console.error('Failed to mark all notifications as read');
      return res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }

    console.log(`Successfully marked all notifications as read for user: ${userId}`);
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

exports.getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const settings = await notificationService.getUserNotificationSettings(userId);
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Notification settings not found'
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error in getNotificationSettings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification settings',
      error: error.message
    });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const settings = req.body;

    const updatedSettings = await notificationService.updateNotificationSettings(userId, settings);
    
    if (!updatedSettings) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update notification settings'
      });
    }

    res.json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error in updateNotificationSettings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings',
      error: error.message
    });
  }
}; 