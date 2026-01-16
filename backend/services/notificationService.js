const { Notification, NotificationSettings } = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Initialize onlineUsers Map
const onlineUsers = new Map();

// Configure nodemailer with error handling
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} catch (error) {
  console.warn('Email service not configured properly:', error.message);
  transporter = null;
}

// Add user to online users
const addOnlineUser = (userId, socketId) => {
  if (!userId || !socketId) {
    console.warn('Invalid userId or socketId provided to addOnlineUser');
    return;
  }
  onlineUsers.set(userId.toString(), socketId);
  console.log(`User ${userId} added to online users. Current online users:`, Array.from(onlineUsers.entries()));
};

// Remove user from online users
const removeOnlineUser = (userId) => {
  if (!userId) {
    console.warn('Invalid userId provided to removeOnlineUser');
    return;
  }
  onlineUsers.delete(userId.toString());
  console.log(`User ${userId} removed from online users. Current online users:`, Array.from(onlineUsers.entries()));
};

// Get user's socket ID
const getUserSocketId = (userId) => {
  if (!userId) {
    console.warn('Invalid userId provided to getUserSocketId');
    return null;
  }
  return onlineUsers.get(userId.toString());
};

// Get all online users
const getOnlineUsers = () => {
  return onlineUsers;
};

// Get user's notification settings
const getUserNotificationSettings = async (userId) => {
  try {
    let settings = await NotificationSettings.findOne({ userId });
    if (!settings) {
      settings = await NotificationSettings.create({ userId });
    }
    return settings;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return null;
  }
};

// Update user's notification settings
const updateNotificationSettings = async (userId, settings) => {
  try {
    const updatedSettings = await NotificationSettings.findOneAndUpdate(
      { userId },
      { $set: settings },
      { new: true, upsert: true }
    );
    return updatedSettings;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return null;
  }
};

// Create and send notification
const notify = async (userId, type, content, link, io, senderId = null, isAdmin = false) => {
  let formattedContent = content;
  try {
    // For admin notifications, skip user settings check
    if (!isAdmin) {
      // Get user's notification settings
      const settings = await getUserNotificationSettings(userId);
      if (!settings) {
        console.warn(`No notification settings found for user: ${userId}`);
        return null;
      }

      // Check if push notifications are enabled for this type
      const shouldSendPush = settings.pushNotifications.enabled && 
                            settings.pushNotifications.types[type];

      // Check if email notifications are enabled for this type
      const shouldSendEmail = settings.emailNotifications.enabled && 
                             settings.emailNotifications.types[type];
    }

    let sender = null;
    
    // If senderId is provided, get sender's information
    if (senderId) {
      sender = await User.findById(senderId).select('name profileImage');
      if (sender) {
        // Format content based on notification type
        switch (type) {
          case 'message':
            formattedContent = `${sender.name}: ${content}`;
            break;
          case 'bid':
            formattedContent = `${sender.name} placed a bid on your job`;
            break;
          case 'job_hired':
            formattedContent = `${sender.name} hired you for a job`;
            break;
          case 'contract_created':
            formattedContent = `${sender.name} created a contract with you`;
            break;
          case 'work_submitted':
            formattedContent = `${sender.name} submitted work for your job`;
            break;
          case 'work_approved':
            formattedContent = `${sender.name} approved your submitted work`;
            break;
          case 'dispute':
            formattedContent = `${sender.name} rejected work: ${content}`;
            break;
          default:
            formattedContent = content;
        }
      }
    }

    // Create notification in database
    const notification = new Notification({
      userId: isAdmin ? null : userId,
      isAdmin,
      type,
      content: formattedContent,
      link,
      senderId
    });

    if (sender) {
      notification.senderId = sender;
    }

    await notification.save();

    // Send real-time notification if enabled and not admin
    if (!isAdmin && shouldSendPush) {
      const socketId = getUserSocketId(userId);
      if (socketId && io) {
        try {
          const populatedNotification = await Notification.findById(notification._id)
            .populate('senderId', 'name profileImage');
          io.to(socketId).emit('notification', populatedNotification);
        } catch (socketError) {
          console.warn('Failed to send socket notification:', socketError.message);
        }
      }
    }

    // Send email notification if enabled and not admin
    if (!isAdmin && shouldSendEmail && transporter) {
      try {
        const user = await User.findById(userId);
        if (user && user.email) {
          await sendEmailNotification(user.email, formattedContent, link);
        }
      } catch (emailError) {
        console.warn('Failed to send email notification:', emailError.message);
      }
    }

    return notification;
  } catch (error) {
    console.error('Error in notify:', error);
    return null;
  }
};

// Send email notification
const sendEmailNotification = async (email, content, link) => {
  if (!transporter) {
    console.warn('Email service not configured, skipping email notification');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'New Notification',
      html: `
        <h2>New Notification</h2>
        <p>${content}</p>
        <a href="${link}">Click here to view</a>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn('Failed to send email notification:', error.message);
  }
};

// Get user's notifications
const getUserNotifications = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ userId })
      .populate('senderId', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ userId });
    
    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return {
      notifications: [],
      total: 0,
      page,
      totalPages: 0
    };
  }
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    ).populate('senderId', 'name profileImage');
    
    if (!notification) {
      console.warn(`Notification not found or user mismatch: notificationId=${notificationId}, userId=${userId}`);
      return null;
    }
    
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  try {
    console.log(`Finding unread notifications for user: ${userId}`);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });
    console.log(`Found ${unreadCount} unread notifications`);

    if (unreadCount === 0) {
      console.log('No unread notifications to mark as read');
      return true;
    }

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      console.warn('No notifications were modified');
      return false;
    }

    console.log(`Successfully marked ${result.modifiedCount} notifications as read`);
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    console.error('Stack trace:', error.stack);
    return false;
  }
};

class NotificationService {
    // Store online users and their socket IDs
    onlineUsers = new Map();

    // Add user to online users
    addOnlineUser(userId, socketId) {
        this.onlineUsers.set(userId.toString(), socketId);
        console.log('User connected:', userId, 'Socket:', socketId);
        console.log('Online users:', Array.from(this.onlineUsers.entries()));
    }

    // Remove user from online users
    removeOnlineUser(userId) {
        this.onlineUsers.delete(userId.toString());
        console.log('User disconnected:', userId);
        console.log('Online users:', Array.from(this.onlineUsers.entries()));
    }

    // Get user's socket ID
    getUserSocketId(userId) {
        return this.onlineUsers.get(userId.toString());
    }

    // Get all online users
    getOnlineUsers() {
        return Array.from(this.onlineUsers.keys());
    }

    // Create a notification with socket.io support
    async notify(userId, type, content, link, io, senderId) {
        try {
            // Check user's notification settings
            const settings = await NotificationSettings.findOne({ userId });
            if (settings && !settings.isNotificationEnabled('pushNotifications', type)) {
                return null; // User has disabled this type of notification
            }

            const notification = new Notification({
                userId,
                senderId,
                type,
                content,
                link,
                isAdmin: false
            });

            await notification.save();

            // Emit real-time notification if socket.io is available
            if (io) {
                const socketId = this.getUserSocketId(userId);
                if (socketId) {
                    io.to(socketId).emit('notification', {
                        type,
                        content,
                        link,
                        senderId,
                        createdAt: notification.createdAt
                    });
                }
            }

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Create a notification (original method)
    async createNotification({
        userId,
        senderId,
        type,
        content,
        link,
        isAdmin = false
    }) {
        try {
            // If userId is provided, check user's notification settings
            if (userId) {
                const settings = await NotificationSettings.findOne({ userId });
                if (settings && !settings.isNotificationEnabled('pushNotifications', type)) {
                    return null; // User has disabled this type of notification
                }
            }

            const notification = new Notification({
                userId,
                senderId,
                type,
                content,
                link,
                isAdmin
            });

            await notification.save();
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Get user notifications with pagination
    async getUserNotifications(userId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            
            const [notifications, total] = await Promise.all([
                Notification.find({ 
                    $or: [
                        { userId },
                        { isAdmin: true }
                    ]
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('senderId', 'name profileImage'),
                Notification.countDocuments({ 
                    $or: [
                        { userId },
                        { isAdmin: true }
                    ]
                })
            ]);

            return {
                notifications,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Error getting user notifications:', error);
            throw error;
        }
    }

    // Mark notification as read
    async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification.findOne({
                _id: notificationId,
                userId
            });

            if (!notification) return null;

            notification.isRead = true;
            await notification.save();
            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Mark all notifications as read for a user
    async markAllAsRead(userId) {
        try {
            const result = await Notification.updateMany(
                { userId, isRead: false },
                { $set: { isRead: true } }
            );
            return result;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    // Get user notification settings
    async getUserNotificationSettings(userId) {
        try {
            let settings = await NotificationSettings.findOne({ userId });
            
            if (!settings) {
                settings = new NotificationSettings({ userId });
                await settings.save();
            }
            
            return settings;
        } catch (error) {
            console.error('Error getting notification settings:', error);
            throw error;
        }
    }

    // Update user notification settings
    async updateNotificationSettings(userId, settings) {
        try {
            const updatedSettings = await NotificationSettings.findOneAndUpdate(
                { userId },
                { $set: settings },
                { new: true, upsert: true }
            );
            return updatedSettings;
        } catch (error) {
            console.error('Error updating notification settings:', error);
            throw error;
        }
    }

    // Helper method to notify about work submission
    async notifyWorkSubmitted(contract, workHash) {
        return this.notify(
            contract.client,
            'work_submitted',
            `Work has been submitted for contract "${contract.jobTitle}"`,
            `/contracts/${contract._id}`,
            null,
            contract.freelancer
        );
    }

    // Helper method to notify about new bid
    async notifyNewBid(job, bid) {
        return this.notify(
            job.clientId,
            'bid',
            `New bid received for "${job.title}"`,
            `/jobs/${job._id}/bids`,
            null,
            bid.freelancerId
        );
    }

    // Helper method to notify about proposal acceptance
    async notifyProposalAccepted(proposal) {
        return this.notify(
            proposal.freelancerId,
            'job_hired',
            `Your proposal for "${proposal.jobId.title}" has been accepted`,
            `/proposals/${proposal._id}`,
            null,
            proposal.jobId.clientId
        );
    }

    // Helper method to notify about contract signing
    async notifyContractSigned(contract, signerType) {
        const recipientId = signerType === 'client' ? contract.freelancer : contract.client;
        const senderId = signerType === 'client' ? contract.client : contract.freelancer;
        
        return this.notify(
            recipientId,
            'contract_created',
            `Contract "${contract.jobTitle}" has been signed by the ${signerType}`,
            `/contracts/${contract._id}`,
            null,
            senderId
        );
    }

    // Helper method to notify about payment
    async notifyPayment(payment, type) {
        const recipientId = type === 'release' ? payment.freelancerId : payment.clientId;
        const senderId = type === 'release' ? payment.clientId : payment.freelancerId;
        
        return this.notify(
            recipientId,
            type === 'release' ? 'payment_released' : 'payment_requested',
            type === 'release' 
                ? `Payment has been released for contract #${payment.contractId}`
                : `Payment has been requested for contract #${payment.contractId}`,
            `/payments/${payment._id}`,
            null,
            senderId
        );
    }
}

module.exports = new NotificationService(); 