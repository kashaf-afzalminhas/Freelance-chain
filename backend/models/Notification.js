const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['message', 'bid', 'job_hired', 'contract_created', 'work_submitted', 'work_approved', 'info', 'warning', 'error'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Accept any string that starts with / or http(s)://
        return v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://');
      },
      message: props => `${props.value} must start with / or http(s)://`
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

const notificationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  pushNotifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    types: {
      message: {
        type: Boolean,
        default: true
      },
      bid: {
        type: Boolean,
        default: true
      },
      job_hired: {
        type: Boolean,
        default: true
      },
      contract_created: {
        type: Boolean,
        default: true
      },
      work_submitted: {
        type: Boolean,
        default: true
      },
      work_approved: {
        type: Boolean,
        default: true
      },
      info: {
        type: Boolean,
        default: true
      },
      warning: {
        type: Boolean,
        default: true
      },
      error: {
        type: Boolean,
        default: true
      }
    }
  },
  emailNotifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    types: {
      message: {
        type: Boolean,
        default: true
      },
      bid: {
        type: Boolean,
        default: true
      },
      job_hired: {
        type: Boolean,
        default: true
      },
      contract_created: {
        type: Boolean,
        default: true
      },
      work_submitted: {
        type: Boolean,
        default: true
      },
      work_approved: {
        type: Boolean,
        default: true
      },
      info: {
        type: Boolean,
        default: true
      },
      warning: {
        type: Boolean,
        default: true
      },
      error: {
        type: Boolean,
        default: true
      }
    }
  }
}, { timestamps: true });

// Add index for better query performance
notificationSettingsSchema.index({ userId: 1 });

// Add method to check if a notification type is enabled
notificationSettingsSchema.methods.isNotificationEnabled = function(category, type) {
  return this[category].enabled && this[category].types[type];
};

const Notification = mongoose.model('Notification', notificationSchema);
const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

module.exports = {
  Notification,
  NotificationSettings
}; 