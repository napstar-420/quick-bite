const { model, Schema } = require('mongoose');

const { genReviewId } = require('../utils/id');

const ReviewSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => genReviewId(),
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    menuItem: {
      type: String,
      ref: 'MenuItem',
      required: true,
    },
    restaurantBranch: {
      type: String,
      ref: 'RestaurantBranch',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Create indexes for faster lookups
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ menuItem: 1 });
ReviewSchema.index({ restaurant: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ createdAt: 1 });

module.exports = model('Review', ReviewSchema);
