const express = require('express');

const partnerController = require('../controllers/partner.controller.js');
const authorize = require('../middlewares/authorize.middleware.js');
const handleValidationErrors = require('../middlewares/validation-error.middleware.js');
const { createMenuValidation } = require('../middlewares/validations.middleware.js');
const verifyPartner = require('../middlewares/verify-partner.middleware.js');

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

router.post(
  '/restaurant/menus',
  authorize('restaurant', 'update', { getOwnerIds: req => [req.user_id] }),
  createMenuValidation,
  handleValidationErrors,
  partnerController.createMenu,
);

module.exports = router;
