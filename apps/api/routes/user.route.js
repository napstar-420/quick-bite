const express = require('express');
const { query, param, body } = require('express-validator');

const userController = require('../controllers/user.controller');
const authorize = require('../middlewares/authorize.middleware');
const handleValidationErrors = require('../middlewares/validation-error.middleware');
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

router.put(
  '/:id',
  authorize('user', 'update', {
    getOwnerIds: req => [req.params.id],
  }),
  [
    param('id')
      .notEmpty()
      .withMessage('ID is required')
      .isLength({ min: 1 })
      .isString()
      .withMessage('ID must be a string'),
    body('address.street')
      .optional()
      .isString()
      .withMessage('Street must be a string'),
    body('address.city')
      .optional()
      .isString()
      .withMessage('City must be a string'),
    body('address.state')
      .optional()
      .isString()
      .withMessage('State must be a string'),
    body('address.country')
      .optional()
      .isString()
      .withMessage('Country must be a string'),
    body('address.floor')
      .optional()
      .isString()
      .withMessage('Floor must be a string'),
    body('address.note')
      .optional()
      .isString()
      .withMessage('Note must be a string'),
    body('address.label')
      .optional()
      .isString()
      .withMessage('Label must be a string'),
    body('address.location.type')
      .optional()
      .equals('Point')
      .withMessage('Location type must be Point'),
    body('address.location.coordinates')
      .optional()
      .isArray()
      .withMessage('Coordinates must be an array')
      .custom((coordinates) => {
        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
          throw new Error('Coordinates must be an array of two numbers');
        }
        if (!coordinates.every(coord => typeof coord === 'number')) {
          throw new Error('Coordinates must be numbers');
        }
        return true;
      }),
    body('phone')
      .optional()
      .isString()
      .withMessage('Phone must be a string'),
    body('name')
      .optional()
      .isString()
      .withMessage('Name must be a string'),
  ],
  handleValidationErrors,
  userController.updateUser,
);

module.exports = router;
