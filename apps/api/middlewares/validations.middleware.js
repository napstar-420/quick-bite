const { body, query, param } = require('express-validator');

const config = require('../config');

const VALID_DAYS = Object.values(config.DAYS_OF_WEEK);

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
    .withMessage(
      'Role name can only contain letters, numbers, hyphens, and underscores',
    ),
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
  param('id').notEmpty().withMessage('Role ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Role name must be between 3 and 50 characters')
    .matches(/^[\w-]+$/)
    .withMessage(
      'Role name can only contain letters, numbers, hyphens, and underscores',
    ),
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
    .withMessage(
      'Permission name can only contain letters, numbers, hyphens, and underscores',
    ),
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
  body('userId').notEmpty().withMessage('User ID is required'),
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
  body('userId').notEmpty().withMessage('User ID is required'),
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
  body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
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

const createRestaurantValidation = [
  // Basic restaurant info
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Restaurant name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Restaurant name must be between 3 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email format is incorrect'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Phone number format is incorrect'),

  body('category').trim().notEmpty().withMessage('Category is required'),

  body('priceRange').trim().notEmpty().withMessage('Price range is required'),

  // Restaurant details
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 3, max: 300 })
    .withMessage('Description must be between 3 and 300 characters'),

  body('logo')
    .trim()
    .notEmpty()
    .withMessage('Logo URL is required')
    .isURL()
    .withMessage('Logo must be a valid URL'),

  body('coverImage')
    .trim()
    .notEmpty()
    .withMessage('Cover image URL is required')
    .isURL()
    .withMessage('Cover image must be a valid URL'),

  // Branch information
  body('branchName')
    .trim()
    .notEmpty()
    .withMessage('Branch name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Branch name must be between 3 and 100 characters'),

  body('branchPhone')
    .trim()
    .notEmpty()
    .withMessage('Branch phone is required')
    .isMobilePhone()
    .withMessage('Branch phone format is incorrect'),

  body('branchCoverImage')
    .trim()
    .notEmpty()
    .withMessage('Branch cover image URL is required')
    .isURL()
    .withMessage('Branch cover image must be a valid URL'),

  // Opening hours validation
  body('openingHours')
    .isArray()
    .withMessage('Opening hours must be an array')
    .notEmpty()
    .withMessage('At least one opening hours entry is required')
    .custom((timeSlots) => {
      // Track which days have been used
      const usedDays = new Set();

      // Check each time slot
      for (const slot of timeSlots) {
        if (!slot.days || !Array.isArray(slot.days))
          continue;

        for (const day of slot.days) {
          if (usedDays.has(day)) {
            throw new Error(
              `Day "${day}" appears in multiple time slots. Each day can only be used once.`,
            );
          }
          usedDays.add(day);
        }
      }

      return true;
    }),

  body('openingHours.*.days')
    .isArray()
    .withMessage('Days must be an array')
    .notEmpty()
    .withMessage('At least one day must be selected')
    .custom((days) => {
      // Check if all provided days are valid
      const allValid = days.every(day => VALID_DAYS.includes(day));
      if (!allValid) {
        throw new Error(`Days must be one of: ${VALID_DAYS.join(', ')}`);
      }

      // Check for duplicate days within a single time slot
      const uniqueDays = new Set(days);
      if (uniqueDays.size !== days.length) {
        throw new Error('Duplicate days are not allowed in a single time slot');
      }

      return true;
    }),

  body('openingHours.*.from')
    .notEmpty()
    .withMessage('Opening time is required')
    .matches(/^([01]?\d|2[0-3]):00$/)
    .withMessage('Opening time must be in format HH:00'),

  body('openingHours.*.to')
    .notEmpty()
    .withMessage('Closing time is required')
    .matches(/^([01]?\d|2[0-3]):00$/)
    .withMessage('Closing time must be in format HH:00')
    .custom((value, { req, path }) => {
      // Extract the index from the path (e.g., "openingHours[0].to" -> 0)
      const index = path.match(/\[(\d+)\]/)[1];
      const fromTime = req.body.openingHours[index].from;

      // Skip validation for 24/7 slots
      if (fromTime === '00:00' && value === '00:00') {
        return true;
      }

      // Convert times to comparable values
      const fromHour = Number.parseInt(fromTime.split(':')[0]);
      const toHour = Number.parseInt(value.split(':')[0]);

      // Check if "to" time is greater than "from" time
      if (toHour <= fromHour) {
        throw new Error('Closing time must be after opening time');
      }

      return true;
    }),

  // Address validation
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required')
    .isLength({ min: 3 })
    .withMessage('Street address must be at least 3 characters'),

  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 3 })
    .withMessage('City must be at least 3 characters'),

  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State/Province is required')
    .isLength({ min: 2 })
    .withMessage('State/Province must be at least 2 characters'),

  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip/Postal code is required')
    .isLength({ min: 3 })
    .withMessage('Zip/Postal code must be at least 3 characters'),

  body('address.location')
    .notEmpty()
    .withMessage('Location coordinates are required'),

  body('address.location.type')
    .equals('Point')
    .withMessage('Location type must be "Point"'),

  body('address.location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage(
      'Coordinates must be an array with exactly 2 elements [longitude, latitude]',
    )
    .custom((value) => {
      const [longitude, latitude] = value;

      // Validate longitude (-180 to 180)
      if (longitude < -180 || longitude > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }

      // Validate latitude (-90 to 90)
      if (latitude < -90 || latitude > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }

      return true;
    }),
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
  createRestaurantValidation,
};
