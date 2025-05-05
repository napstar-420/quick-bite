const express = require('express');
const { query } = require('express-validator');

const menuItemsController = require('../controllers/menu-items.controller');
const validate = require('../middlewares/validation-error.middleware');

const router = express.Router();

router.get(
  '/home',
  [
    query('c')
      .isString()
      .notEmpty()
      .withMessage('Coordinates are required'),
  ],
  validate,
  menuItemsController.getHomeMenuItems,
);

module.exports = router;
