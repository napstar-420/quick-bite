const { matchedData } = require('express-validator');

const Review = require('../models/review.model');
const { logger } = require('../utils/logger');

/**
 * Get all reviews
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getAllReviews(req, res) {
  try {
    // TODO: Add pagination
    const reviews = await Review.find();
    return res.status(200).json(reviews);
  }
  catch (error) {
    logger.error(`Get all reviews error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Get a review by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function getReviewById(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(200).json(review);
  }
  catch (error) {
    logger.error(`Get review by ID error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Create a new review
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function createReview(req, res) {
  try {
    const { title, content, rating, restaurantId } = matchedData(req);

    const review = new Review({
      title,
      content,
      rating,
      restaurantId,
      userId: req.user._id, // Set the current user as the owner
      userName: req.user.name,
    });

    await review.save();
    return res.status(201).json(review);
  }
  catch (error) {
    logger.error(`Create review error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Update a review
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function updateReview(req, res) {
  try {
    const { title, content, rating } = matchedData(req);

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update fields
    if (title)
      review.title = title;
    if (content)
      review.content = content;
    if (rating)
      review.rating = rating;

    await review.save();
    return res.status(200).json(review);
  }
  catch (error) {
    logger.error(`Update review error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Delete a review
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();
    return res.status(200).json({ message: 'Review deleted successfully' });
  }
  catch (error) {
    logger.error(`Delete review error: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Helper method to get a review for authorization checks
 * This method is used by the authorization middleware
 * @param {string} reviewId - The review ID
 * @returns {Promise<string|null>} The review object user ID or null
 */
async function getReviewForAuth(reviewId) {
  try {
    return await Review.findById(reviewId).populate('user', 'id').select('user');
  }
  catch (error) {
    logger.error(`Get review for auth error: ${error.message}`);
    return null;
  }
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewForAuth,
};
