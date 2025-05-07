const express = require('express');

const router = express.Router();

const reviewController = require('../controllers/review.controller');
const authorize = require('../middlewares/authorize.middleware');
const handleValidationErrors = require('../middlewares/validation-error.middleware');
const {
  createReviewValidation,
  updateReviewValidation,
} = require('../middlewares/validations.middleware');
const verifyJwt = require('../middlewares/verify-jwt.middleware');
const { getReviewUserId } = require('../services/review.service');

router.get('/', reviewController.getAllReviews);

router.get('/:id', reviewController.getReviewById);

// All routes require authentication
router.use(verifyJwt);

router.post(
  '/',
  authorize('review', 'create'),
  createReviewValidation,
  handleValidationErrors,
  reviewController.createReview,
);

router.put(
  '/:id',
  authorize('review', 'update', {
    getOwnerId: req => getReviewUserId(req.params.id),
  }),
  updateReviewValidation,
  handleValidationErrors,
  reviewController.updateReview,
);

router.delete(
  '/:id',
  authorize('review', 'delete', {
    getOwnerIds: req => getReviewUserId(req.params.id),
  }),
  reviewController.deleteReview,
);

module.exports = router;
