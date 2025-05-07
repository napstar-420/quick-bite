const express = require('express');
const { query } = require('express-validator');

const menuItemsController = require('../controllers/menu-items.controller');

const router = express.Router();

router.get(
  '/home',
  [
    query('c')
      .isString()
      .notEmpty()
      .withMessage('Coordinates are required'),
  ],
  menuItemsController.getHomeMenuItems,
);

router.get(
  '/by-ids',
  [
    query('ids')
      .isString()
      .notEmpty()
      .withMessage('Item IDs are required')
      .customSanitizer(value => value.split(',')),
  ],
  menuItemsController.getMenuItemsByIds,
);

module.exports = router;
