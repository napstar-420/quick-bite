const { body } = require('express-validator');

const config = require('../../config');

const VALID_DAYS = Object.values(config.DAYS_OF_WEEK);

const isAvailableValidation = body('isAvailable')
  .optional()
  .isBoolean()
  .withMessage('isAvailable should be boolean');

const addressValidation = [
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

const openingHoursValidation = [
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
];

const coverImageValidation = [
  body('coverImage')
    .trim()
    .notEmpty()
    .withMessage('Cover image URL is required')
    .isURL()
    .withMessage('Cover image must be a valid URL'),
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

  ...coverImageValidation,

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
  ...openingHoursValidation,

  // Address validation
  ...addressValidation,
];

const createBranchValidation = [
  body('name')
    .notEmpty()
    .withMessage('Branch name is required')
    .isLength({ min: 3 })
    .withMessage('Branch name should be at least 3 characters long'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isString()
    .withMessage('Not a valid phone number'),
  body('manager')
    .notEmpty()
    .withMessage('Manager name is required')
    .isString()
    .withMessage('Not a valid string'),
  ...coverImageValidation,
  ...addressValidation,
  ...openingHoursValidation,
];

const createMenuValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Menu name is required')
    .isLength({ min: 3, max: 64 })
    .withMessage('Menu name must be between 3 and 64 characters'),
  isAvailableValidation,
  body('branches').isArray({ min: 1 }).withMessage('One branch is required'),
  body('branches.*').isString().withMessage('Each branch must be a string'),
];

const updateMenuValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Menu name is required')
    .isLength({ min: 3, max: 64 })
    .withMessage('Menu name must be between 3 and 64 characters'),
  isAvailableValidation,
  body('branches')
    .optional()
    .isArray({ min: 1 })
    .withMessage('One branch is required'),
  body('branches.*').isString().withMessage('Each branch must be a string'),
];

const createMenuItemValidations = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 3 })
    .withMessage('Item name should be at least 3 characters long'),

  body('description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Item description is required')
    .isLength({ min: 3 })
    .withMessage('Description should be at least 3 characters long'),

  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('image')
    .notEmpty()
    .withMessage('Image URL is required')
    .isString()
    .withMessage('Not a valid URL'),

  isAvailableValidation,
];

const updateMenuItemValidations = [
  body('name')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 3 })
    .withMessage('Item name should be at least 3 characters long'),

  body('description')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Item description is required')
    .isLength({ min: 3 })
    .withMessage('Description should be at least 3 characters long'),

  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('image')
    .optional()
    .notEmpty()
    .withMessage('Image URL is required')
    .isString()
    .withMessage('Not a valid URL'),

  isAvailableValidation,
];

module.exports = {
  createRestaurantValidation,
  createBranchValidation,
  createMenuValidation,
  updateMenuValidation,
  createMenuItemValidations,
  updateMenuItemValidations,
};
