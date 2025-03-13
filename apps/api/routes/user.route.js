const express = require('express');
const { query, param } = require('express-validator');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limit must be a positive integer'),
    query('status')
      .optional()
      .isIn(['active', 'inactive', 'suspended'])
      .withMessage('Invalid status value'),
  ],
  userController.getUsers,
);

router.get(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('ID is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('ID must be a string'),
  ],
  userController.getUser,
);

module.exports = router;
