const { body } = require('express-validator');

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
      `Password length should between ${config.PASS_MIN_LENGTH} and ${config.PASS_MAX_LENGTH}`
    )
    .matches(config.PASS_REGEX)
    .withMessage(
      `Password should contain at least one small case letter, one uppercase letter, one number and one special character, allowed special characters are ${config.PASS_ALLOWED_SPECIAL_CHARS}`
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
      `Name length should between ${config.NAME_MIN_LENGTH} and ${config.NAME_MAX_LENGTH}`
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
      `Password length should between ${config.PASS_MIN_LENGTH} and ${config.PASS_MAX_LENGTH}`
    )
    .matches(config.PASS_REGEX)
    .withMessage(
      `Password should contain at least one small case letter, one uppercase letter, one number and one special character, allowed special characters are ${config.PASS_ALLOWED_SPECIAL_CHARS}`
    ),
];

module.exports = {
  signinValidation,
  signupValidation,
};
