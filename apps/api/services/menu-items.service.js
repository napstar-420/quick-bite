const MenuItemModel = require('../models/menu-item.model');
const MenuModel = require('../models/menu.model');
const RestaurantBranchModel = require('../models/restaurant-branch.model');
// const ReviewModel = require('../models/review.model');
const { logger } = require('../utils/logger');

// Return all menu items from the nearest restaurant branch to the coordinates
async function getHomeMenuItems(c) {
  const [longitude, latitude] = c.split(',');
  const coordinates = [Number(longitude), Number(latitude)];

  const restaurantBranches = await RestaurantBranchModel.find({
    'address.location': {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $minDistance: 0, // 0 meters
        $maxDistance: 10000, // 10 km
      },
    },
  }, { name: 1, restaurant: 1 }).populate({
    path: 'restaurant',
    select: 'name priceRange logo categories',
    populate: {
      path: 'categories',
      select: 'name',
    },
  });

  logger.debug(
    `Found ${restaurantBranches.length} restaurant branches near ${coordinates}`,
  );

  const restaurantMenus = await MenuModel.find({
    branches: { $in: restaurantBranches.map(branch => branch._id) },
  }, {
    menuItems: 1,
    branches: 1,
  }, {
    lean: true,
  }).populate({
    path: 'menuItems',
  }).populate({
    path: 'branches',
    select: 'restaurant',
    populate: {
      path: 'restaurant',
      select: 'name',
    },
  });

  const menuItems = restaurantMenus.flatMap((menu) => {
    return menu.menuItems.map(item => ({
      ...item,
      restaurant: menu.branches[0].restaurant.name,
    }));
  });

  return { menuItems, restaurantBranches };
}

async function getMenuItemsByIds(ids) {
  const menuItems = await MenuItemModel.find({ _id: { $in: ids } });
  return menuItems;
}

module.exports = {
  getHomeMenuItems,
  getMenuItemsByIds,
};
