const ReviewModel = require('../models/review.model');

/**
 * Get the user ID of the review owner
 * @param {string} reviewId - The review ID
 * @returns {Promise<string|null>} The user ID of the review owner or null
 */
async function getReviewUserId(reviewId) {
  const review = await ReviewModel.findById(reviewId).populate('user', 'id');
  return review ? review.user.id : null;
}

module.exports = { getReviewUserId };
