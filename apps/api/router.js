const express = require('express');

const verifyJwt = require('./middlewares/verify-jwt.middleware');
const authRouter = require('./routes/auth.route.js');

const router = express.Router();

router.get('/', (_, res) => {
  res.json({ message: 'Hi from QuickBite' });
});

router.use('/auth', authRouter);

router.use(verifyJwt);

router.get('/protected', (_, res) => {
  res.json({ message: 'Protected route' });
});

module.exports = router;
