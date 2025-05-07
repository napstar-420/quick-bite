const express = require('express');

const restaurantController = require('../controllers/restaurant.controller.js');
const authorize = require('../middlewares/authorize.middleware.js');
const handleValidationErrors = require('../middlewares/validation-error.middleware.js');
const {
  createRestaurantValidation,
} = require('../middlewares/validations.middleware.js');
const verifyJwt = require('../middlewares/verify-jwt.middleware.js');

const router = express.Router();

router.get(
  '/branch/:id',
  restaurantController.getRestaurantBranch,
);

router.use(verifyJwt);

router.post(
  '/',
  authorize('restaurant', 'create'),
  createRestaurantValidation,
  handleValidationErrors,
  restaurantController.createRestaurant,
);

module.exports = router;
