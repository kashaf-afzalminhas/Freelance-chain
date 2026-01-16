const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['user', 'job', 'contract', 'content'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  evidence: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link', 'text']
    },
    url: String,
    description: String
  }],
  adminNotes: [{
    note: String,
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    action: {
      type: String,
      enum: ['warning', 'suspension', 'ban', 'no_action']
    },
    details: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report; 