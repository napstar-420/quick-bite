const { matchedData } = require('express-validator');

const RestaurantService = require('../services/restaurant.service');
const { logger } = require('../utils/logger');

async function getRestaurant(req, res) {
  const restaurant = await RestaurantService.getRestaurant({
    _id: req.restaurantId,
  });

  if (!restaurant) {
    return res.status(404).json({ message: 'No restaurant found' });
  }

  res.status(200).json(restaurant);
}

async function getBranches(req, res) {
  const branches = await RestaurantService.getBranches({
    restaurant: req.restaurantId,
  });

  if (!branches.length) {
    return res.status(404).json({ message: 'No branches found' });
  }

  res.status(200).json(branches);
}

async function getMenus(req, res) {
  const restaurantBranches = await RestaurantService.getBranches(
    { restaurant: req.restaurantId },
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
      res.status(400).json({
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

async function getMenuItems(req, res) {
  const { menuId } = req.params;

  try {
    const menuItems = await RestaurantService.getMenuItems(menuId);
    return res.json(menuItems);
  }
  catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function createMenuItem(req, res) {
  const data = matchedData(req);
  const { menuId } = req.params;

  try {
    const newMenuItem = await RestaurantService.createMenuItem({
      ...data,
      image: data.img_url,
    });
    await RestaurantService.appendMenuItem(menuId, newMenuItem._id);

    return res.json(newMenuItem);
  }
  catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function updateMenuItem(req, res) {
  const data = matchedData(req);
  const { itemId } = req.params;

  try {
    const updatedMenuItem = await RestaurantService.updateMenuItem(
      itemId,
      data,
    );

    if (!updatedMenuItem) {
      return res
        .status(404)
        .json({ message: `Menu item not found for ID: ${itemId}` });
    }

    return res.json(updatedMenuItem);
  }
  catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function updateMenu(req, res) {
  const data = matchedData(req);
  const { menuId } = req.params;

  try {
    const updatedMenu = await RestaurantService.updateMenu(menuId, data);

    if (updatedMenu) {
      return res.json(updatedMenu);
    }

    return res.status(404).json({ message: 'Menu not found' });
  }
  catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function deleteMenu(req, res) {
  const { menuId } = req.params;
  try {
    const result = await RestaurantService.deleteMenu(menuId);

    if (result) {
      return res.json({ message: 'Menu deleted successfully' });
    }

    return res
      .status(204)
      .json({ message: `Menu not found for ID: ${menuId}` });
  }
  catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function deleteMenuItem(req, res) {
  const { menuId, itemId } = req.params;

  try {
    await RestaurantService.deleteMenuItem(menuId, itemId);
    return res.json({ message: 'Menu item deleted successfully' });
  }
  catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

module.exports = {
  getRestaurant,
  getBranches,
  getMenus,
  createMenu,
  getMenuItems,
  createMenuItem,
  updateMenu,
  deleteMenu,
  updateMenuItem,
  deleteMenuItem,
};
