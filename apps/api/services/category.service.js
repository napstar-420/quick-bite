const RestaurantCategoryModel = require('../models/restaurant-category.model');

async function createCategory(data) {
  const restaurantCategory = await RestaurantCategoryModel.create(data);
  return restaurantCategory;
}

async function getCategories(filters = {}, projection = 'name') {
  return RestaurantCategoryModel.find(filters, projection);
}

module.exports = {
  createCategory,
  getCategories,
};
