const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  media: [
    {
      url: { type: String, required: true },
      type: { type: String, enum: ['image', 'video', 'pdf', 'document'], required: true },
      name: { type: String, required: true },
      size: { type: Number }, // Size in bytes
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema); 