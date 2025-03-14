const express = require('express');
const { query, param } = require('express-validator');

const userController = require('../controllers/user.controller');
const authorize = require('../middlewares/authorize.middleware');
const verifyJwt = require('../middlewares/verify-jwt.middleware');

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

router.use(verifyJwt);

router.get(
  '/:id/roles',
  authorize('user', 'read', {
    getOwnerIds: req => [req.params.id],
  }),
  userController.getUserRoles,
);

module.exports = router;
