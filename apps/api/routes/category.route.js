const express = require('express');
const { query } = require('express-validator');

const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validation-error.middleware');

const router = express.Router();

router.get(
  '/search',
  [
    query('q')
      .isString()
      .notEmpty()
      .withMessage('Query is required')
      .isLength({ min: 3 })
      .withMessage('Query must be at least 3 characters long'),
  ],
  validate,
  categoryController.searchCategories,
);

module.exports = router;
