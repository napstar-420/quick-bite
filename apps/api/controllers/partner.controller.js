const { matchedData } = require('express-validator');

const RestaurantService = require('../services/restaurant.service');
const { logger } = require('../utils/logger');

async function getRestaurant(req, res) {
  const restaurant = await RestaurantService.getRestaurant({
    _id: req.restaurant_id,
  });

  if (!restaurant) {
    return res.status(404).json({ message: 'No restaurant found' });
  }

  res.status(200).json(restaurant);
}

async function getBranches(req, res) {
  const branches = await RestaurantService.getBranches({
    restaurant: req.restaurant_id,
  });

  if (!branches.length) {
    return res.status(404).json({ message: 'No branches found' });
  }

  res.status(200).json(branches);
}

async function getMenus(req, res) {
  const restaurantBranches = await RestaurantService.getBranches(
    { restaurant: req.restaurant_id },
    'id',
  );

  const menus = await RestaurantService.getMenus({
    branches: { $in: restaurantBranches.map(b => b._id) },
  });

  return res.json(menus);
}

async function createMenu(req, res) {
  const data = matchedData(req);
  const branchIds = data.branches;

  try {
    const existingBranches = await RestaurantService.getBranches(
      { _id: { $in: branchIds } },
      'id',
    );

    if (existingBranches.length !== branchIds.length) {
      const existingBranchIds = existingBranches.map(branch =>
        branch._id.toString(),
      );
      const nonExistentBranches = branchIds.filter(
        id => !existingBranchIds.includes(id.toString()),
      );
      res
        .status(400)
        .json({
          message: `The following branch IDs do not exist: ${nonExistentBranches.join(', ')}`,
        });
    }

    const menu = await RestaurantService.createMenu(data);
    return res.json(menu);
  }
  catch (error) {
    logger.error('Error while creating menu', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}

module.exports = {
  getRestaurant,
  getBranches,
  getMenus,
  createMenu,
};
