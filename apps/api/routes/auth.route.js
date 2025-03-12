const express = require('express');

const authController = require('../controllers/auth.controller');
const validations = require('../middlewares/validations.middleware');

const router = express.Router();

router.post(
  '/signup',
  validations.signupValidation,
  authController.signup,
);
router.post('/signin', validations.signinValidation, authController.signin);
router.get('/refresh', authController.refreshToken);
router.post('/signout', authController.signout);
router.get('/check-user', validations.validateEmailParam, authController.checkUserExists);

module.exports = router;
