const { matchedData } = require('express-validator');

const config = require('../config');
const RestaurantCategoryService = require('../services/category.service');
const RestaurantService = require('../services/restaurant.service');
const UserService = require('../services/user.service');

async function createRestaurant(req, res) {
  const data = matchedData(req);

  const user = await UserService.getUserByID(req.user_id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const categories = await RestaurantCategoryService.getCategories({
    name: data.category,
  });

  let categoryIds = [];

  if (categories.length === 0) {
    const newCategory = await RestaurantCategoryService.createCategory({
      name: data.category,
    });

    categoryIds.push(newCategory._id);
  }
  else {
    categoryIds = categories.map(category => category._id);
  }

  const restaurantData = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    owner: user.id,
    logo: data.logo,
    coverImage: data.coverImage,
    description: data.description,
    categories: categoryIds,
    priceRange: data.priceRange,
    status: config.RESTAURANT_STATUS.PENDING,
  };

  const restaurant = await RestaurantService.createRestaurant(restaurantData);

  const branchData = {
    name: data.branchName,
    restaurant: restaurant._id,
    phone: data.branchPhone,
    manager: user._id,
    address: data.address,
    openingHours: data.openingHours,
    coverImage: data.branchCoverImage,
    status: config.RESTAURANT_STATUS.PENDING,
  };

  await RestaurantService.createBranch(branchData);

  res.status(201).json({
    message: 'Restaurant created successfully',
  });
}

module.exports = {
  createRestaurant,
};
