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

module.exports = {
  createRestaurant,
  createBranch,
};
