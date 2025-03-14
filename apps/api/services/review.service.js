const ReviewModel = require('../models/review.model');

async function getReviewUserId(reviewId) {
  const review = await ReviewModel.findById(reviewId).populate('user', 'id');
  return review ? review.user.id : null;
}

module.exports = { getReviewUserId };
