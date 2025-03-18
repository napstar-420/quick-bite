const RestaurantService = require('../services/restaurant.service');
const { logger } = require('../utils/logger');

async function verifyPartner(req, res, next) {
  const { user_id } = req;

  try {
    const restaurant = await RestaurantService.getRestaurant({ owner: user_id }, 'id');

    if (restaurant) {
      req.restaurant_id = restaurant._id;
      return next();
    }

    const branches = await RestaurantService.getBranches({
      $or: [
        { manager: user_id },
        { staff: { $elemMatch: { $eq: user_id } } },
      ],
    }, 'id');

    if (branches && branches.length) {
      req.restaurant_id = branches[0].restaurant;
      return next();
    }

    logger.debug('Partner verified');

    // User is not an owner, manager, or staff member
    return res.status(403).json({ message: 'Forbidden: Not authorized as restaurant partner' });
  }
  catch (error) {
    logger.debug(error);
    return res.status(403).json({ message: 'Forbidden' });
  }
}

module.exports = verifyPartner;
