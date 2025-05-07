const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.controller');
const authorize = require('../middlewares/authorize.middleware');

router.get(
  '/restaurants',
  authorize('restaurant', 'read'),
  adminController.getRestaurants,
);

router.get(
  '/restaurant/:id',
  authorize('restaurant', 'read'),
  adminController.getRestaurant,
);

router.get(
  '/restaurant/:id/branches',
  authorize('branch', 'read'),
  adminController.getRestaurantBranches,
);

router.get(
  '/restaurant/:id/menus',
  authorize('menu', 'read'),
  adminController.getRestaurantMenus,
);

router.get(
  '/restaurant/:id/menus/:menuId/items',
  authorize('menu-item', 'read'),
  adminController.getRestaurantMenuItems,
);

module.exports = router;
