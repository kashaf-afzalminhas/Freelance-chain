const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  revieweeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'freelancer'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate reviews for the same job by same reviewer
reviewSchema.index({ jobId: 1, reviewerId: 1 }, { unique: true });

// Static method to calculate average rating for a user
reviewSchema.statics.getAverageRating = async function(userId) {
  const result = await this.aggregate([
    { $match: { revieweeId: userId } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } }
  ]);
  
  try {
    await this.model('User').findByIdAndUpdate(userId, {
      averageRating: result[0]?.averageRating || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Update user's average rating after saving a review
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.revieweeId);
});

// Update user's average rating after removing a review
reviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.revieweeId);
});

module.exports = mongoose.model('Review', reviewSchema);