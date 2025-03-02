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
router.get('/refresh-token', authController.refreshToken);
router.get('/signout', authController.signout);

module.exports = router;
