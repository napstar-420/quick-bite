const menuModel = require('../models/menu.model');
const RestaurantMenuModel = require('../models/menu.model');
const RestaurantBranchModel = require('../models/restaurant-branch.model');
const RestaurantService = require('../services/restaurant.service');

async function getRestaurants(req, res) {
  const restaurants = await RestaurantService.getRestaurants(null, null, { lean: true }, [
    { path: 'categories', projection: { _id: 1, name: 1 } },
  ]);

  for (const restaurant of restaurants) {
    restaurant.categories = restaurant.categories.map(
      category => category.name,
    );

    const branchesCount = await RestaurantBranchModel.countDocuments({
      restaurant: restaurant._id,
    });

    restaurant.branchesCount = branchesCount;
  }

  return res.json(restaurants);
}

async function getRestaurant(req, res) {
  const restaurant = await RestaurantService.getRestaurant(
    { _id: req.params.id },
    null,
    { lean: true },
    [{ path: 'categories', projection: { _id: 1, name: 1 } }],
  );

  return res.json(restaurant);
}

async function getRestaurantBranches(req, res) {
  const branches = await RestaurantBranchModel.find(
    { restaurant: req.params.id },
    null,
    { lean: true },
  );
  return res.json(branches);
}

async function getRestaurantMenus(req, res) {
  // Get all branches for the restaurant
  const branches = await RestaurantBranchModel.find(
    { restaurant: req.params.id },
    { _id: 1 },
    { lean: true },
  );

  // Extract branch IDs
  const branchIds = branches.map(branch => branch._id);

  // Get all menus for the branches
  const menus = await RestaurantMenuModel.find(
    { branches: { $in: branchIds } },
    null,
    { lean: true },
  ).populate('menuItems');
  return res.json(menus);
}

async function getRestaurantMenuItems(req, res) {
  const menu = await menuModel.findOne(
    { _id: req.params.menuId },
    { menuItems: 1 },
    { lean: true },
  ).populate('menuItems');

  return res.json(menu.menuItems);
}

module.exports = {
  getRestaurants,
  getRestaurant,
  getRestaurantBranches,
  getRestaurantMenus,
  getRestaurantMenuItems,
};
