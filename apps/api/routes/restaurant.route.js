const express = require('express');

const restaurantController = require('../controllers/restaurant.controller.js');
const authorize = require('../middlewares/authorize.middleware.js');
const handleValidationErrors = require('../middlewares/validation-error.middleware.js');
const {
  createRestaurantValidation,
} = require('../middlewares/validations.middleware.js');

const router = express.Router();

router.post(
  '/',
  authorize('restaurant', 'create'),
  createRestaurantValidation,
  handleValidationErrors,
  restaurantController.createRestaurant,
);

module.exports = router;
