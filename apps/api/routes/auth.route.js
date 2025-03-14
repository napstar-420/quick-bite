const express = require('express');

const authController = require('../controllers/auth.controller');
const handleValidationErrors = require('../middlewares/validation-error.middleware');
const validations = require('../middlewares/validations.middleware');

const router = express.Router();

router.post(
  '/signup',
  validations.signupValidation,
  handleValidationErrors,
  authController.signup,
);
router.post('/signin', validations.signinValidation, handleValidationErrors, authController.signin);
router.get('/refresh', authController.refreshToken);
router.post('/signout', authController.signout);
router.get(
  '/check-user',
  validations.validateEmailParam,
  handleValidationErrors,
  authController.checkUserExists,
);

module.exports = router;
