const express = require('express');

const verifyJwt = require('./middlewares/verify-jwt.middleware');
const adminRouter = require('./routes/admin.routes.js');
const authRouter = require('./routes/auth.route.js');
const categoryRouter = require('./routes/category.route.js');
const partnerRouter = require('./routes/partner.route.js');
const restaurantRouter = require('./routes/restaurant.route.js');
const roleRouter = require('./routes/role.routes.js');
const userRouter = require('./routes/user.route.js');

const router = express.Router();

router.get('/', (_, res) => {
  res.json({ message: 'Hi from QuickBite' });
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);

router.use(verifyJwt);

router.use('/restaurant', restaurantRouter);
router.use('/partner', partnerRouter);
router.use('/admin', adminRouter);

router.get('/protected', (_, res) => {
  res.json({ message: 'Protected route' });
});

// Role and permission management routes
router.use('/roles', roleRouter);

module.exports = router;
