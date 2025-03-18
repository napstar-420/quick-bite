const MenuModel = require('../models/menu.model');
const RestaurantBranchModel = require('../models/restaurant-branch.model');
const RestaurantModel = require('../models/restaurant.model');

async function createRestaurant(data) {
  const restaurant = await RestaurantModel.create(data);
  return restaurant;
}

async function createBranch(data) {
  const restaurantBranch = await RestaurantBranchModel.create(data);
  return restaurantBranch;
}

async function getRestaurant(filters, projection, options) {
  const restaurant = await RestaurantModel.findOne(filters, projection, options);
  return restaurant;
}

async function getBranches(filters, projection, options) {
  const branches = await RestaurantBranchModel.find(filters, projection, options);
  return branches;
}

async function getMenus(filters, projection, options) {
  const menus = await MenuModel.find(filters, projection, options);
  return menus;
}

async function createMenu(data) {
  const menu = await MenuModel.create(data);
  return menu;
}

module.exports = {
  createRestaurant,
  createBranch,
  getRestaurant,
  getBranches,
  getMenus,
  createMenu,
};
