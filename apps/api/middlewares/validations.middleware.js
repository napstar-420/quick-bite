const { body, query, param } = require('express-validator');

const config = require('../config');

const signinValidation = [
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Email format incorrect'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: config.PASS_MIN_LENGTH, max: config.PASS_MAX_LENGTH })
    .withMessage(
      `Password length should between ${config.PASS_MIN_LENGTH} and ${config.PASS_MAX_LENGTH}`,
    )
    .matches(config.PASS_REGEX)
    .withMessage(
      `Password should contain at least one small case letter,
      one uppercase letter, one number and one special character,
      allowed special characters are ${config.PASS_ALLOWED_SPECIAL_CHARS}`,
    ),
];

const signupValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name required')
    .isLength({ min: config.NAME_MIN_LENGTH, max: config.NAME_MAX_LENGTH })
    .withMessage(
      `Name length should between ${config.NAME_MIN_LENGTH} and ${config.NAME_MAX_LENGTH}`,
    ),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Email format incorrect'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: config.PASS_MIN_LENGTH, max: config.PASS_MAX_LENGTH })
    .withMessage(
      `Password length should between ${config.PASS_MIN_LENGTH} and ${config.PASS_MAX_LENGTH}`,
    )
    .matches(config.PASS_REGEX)
    .withMessage(
      `Password should contain at least one small case letter,
      one uppercase letter, one number and one special character,
      allowed special characters are ${config.PASS_ALLOWED_SPECIAL_CHARS}`,
    ),
];

const validateEmailParam = [
  query('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),
];

// Role validation rules
const createRoleValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Role name must be between 3 and 50 characters')
    .matches(/^[\w-]+$/)
    .withMessage('Role name can only contain letters, numbers, hyphens, and underscores'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        // Check if all permissions are strings
        const allStrings = value.every(item => typeof item === 'string');
        if (!allStrings) {
          throw new Error('All permission IDs must be strings');
        }
      }
      return true;
    }),
];

const updateRoleValidation = [
  param('id')
    .notEmpty()
    .withMessage('Role ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Role name must be between 3 and 50 characters')
    .matches(/^[\w-]+$/)
    .withMessage('Role name can only contain letters, numbers, hyphens, and underscores'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        // Check if all permissions are strings
        const allStrings = value.every(item => typeof item === 'string');
        if (!allStrings) {
          throw new Error('All permission IDs must be strings');
        }
      }
      return true;
    }),
];

// Permission validation rules
const createPermissionValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Permission name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Permission name must be between 3 and 50 characters')
    .matches(/^[\w-]+$/)
    .withMessage('Permission name can only contain letters, numbers, hyphens, and underscores'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('resource')
    .trim()
    .notEmpty()
    .withMessage('Resource is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Resource must be between 1 and 50 characters'),
  body('action')
    .trim()
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['create', 'read', 'update', 'delete', 'manage'])
    .withMessage('Action must be one of: create, read, update, delete, manage'),
];

// Role assignment validation rules
const assignRolesValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  body('roleIds')
    .isArray({ min: 1 })
    .withMessage('At least one role ID is required')
    .custom((value) => {
      if (!value.every(item => typeof item === 'string')) {
        throw new Error('All role IDs must be strings');
      }
      return true;
    }),
];

// Role removal validation rules
const removeRolesValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  body('roleIds')
    .isArray({ min: 1 })
    .withMessage('At least one role ID is required')
    .custom((value) => {
      if (!value.every(item => typeof item === 'string')) {
        throw new Error('All role IDs must be strings');
      }
      return true;
    }),
];

// Review validation rules
const createReviewValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Review content is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('restaurantId')
    .notEmpty()
    .withMessage('Restaurant ID is required'),
];

const updateReviewValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

module.exports = {
  signinValidation,
  signupValidation,
  validateEmailParam,
  createRoleValidation,
  updateRoleValidation,
  createPermissionValidation,
  assignRolesValidation,
  removeRolesValidation,
  createReviewValidation,
  updateReviewValidation,
};
