const { validationResult } = require('express-validator');

const { logger } = require('../utils/logger');

/**
 * Middleware to handle validation errors
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next function
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.debug(`Validation errors: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
}

module.exports = handleValidationErrors;
