const express = require('express');

const partnerController = require('../controllers/partner.controller.js');
const authorize = require('../middlewares/authorize.middleware.js');
const handleValidationErrors = require('../middlewares/validation-error.middleware.js');
const {
  createMenuValidation,
  createMenuItemValidations,
  updateMenuValidation,
  updateMenuItemValidations,
} = require('../middlewares/validations.middleware.js');
const verifyPartner = require('../middlewares/verify-partner.middleware.js');
const RestaurantService = require('../services/restaurant.service.js');

async function getMenuOwnerIds(req) {
  const { menuId } = req.params;
  const restaurant = await RestaurantService.getMenuRestaurant(menuId);

  if (!restaurant) {
    return [];
  }

  return RestaurantService.getRestaurantOwners(restaurant._id);
}

const router = express.Router();

router.use(verifyPartner);

router.get(
  '/restaurant',
  authorize('restaurant', 'read', { getOwnerIds: req => [req.user_id] }),
  partnerController.getRestaurant,
);

// TODO: Update permission for menus and branches
router.get(
  '/branches',
  authorize('restaurant', 'read', { getOwnerIds: req => [req.user_id] }),
  partnerController.getBranches,
);

router.get(
  '/restaurant/menus',
  authorize('restaurant', 'read', { getOwnerIds: req => [req.user_id] }),
  partnerController.getMenus,
);

router.get(
  '/restaurant/menus/:menuId/items',
  authorize('restaurant', 'read', {
    getOwnerIds: getMenuOwnerIds,
  }),
  partnerController.getMenuItems,
);

router.post(
  '/restaurant/menus',
  authorize('restaurant', 'update', { getOwnerIds: req => [req.user_id] }),
  createMenuValidation,
  handleValidationErrors,
  partnerController.createMenu,
);

router.post(
  '/restaurant/menus/:menuId/items',
  authorize('restaurant', 'update', {
    getOwnerIds: getMenuOwnerIds,
  }),
  createMenuItemValidations,
  handleValidationErrors,
  partnerController.createMenuItem,
);

router.put(
  '/restaurant/menus/:menuId',
  authorize('restaurant', 'update', {
    getOwnerIds: getMenuOwnerIds,
  }),
  updateMenuValidation,
  handleValidationErrors,
  partnerController.updateMenu,
);

router.put(
  '/restaurant/menus/:menuId/items/:itemId',
  authorize('restaurant', 'update', {
    getOwnerIds: getMenuOwnerIds,
  }),
  updateMenuItemValidations,
  handleValidationErrors,
  partnerController.updateMenuItem,
);

router.delete(
  '/restaurant/menus/:menuId',
  authorize('restaurant', 'delete', {
    getOwnerIds: getMenuOwnerIds,
  }),
  partnerController.deleteMenu,
);

router.delete(
  '/restaurant/menus/:menuId/items/:itemId',
  authorize('restaurant', 'delete', {
    getOwnerIds: getMenuOwnerIds,
  }),
  partnerController.deleteMenuItem,
);

module.exports = router;
