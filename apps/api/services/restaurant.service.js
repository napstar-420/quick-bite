const { connection } = require('../db/connect');
const MenuItemModel = require('../models/menu-item.model');
const MenuModel = require('../models/menu.model');
const RestaurantBranchModel = require('../models/restaurant-branch.model');
const RestaurantModel = require('../models/restaurant.model');
const { logger } = require('../utils/logger');

async function createRestaurant(data) {
  const restaurant = await RestaurantModel.create(data);
  return restaurant;
}

async function createBranch(data) {
  const restaurantBranch = await RestaurantBranchModel.create(data);
  return restaurantBranch;
}

async function getRestaurant(filters, projection, options) {
  const restaurant = await RestaurantModel.findOne(
    filters,
    projection,
    options,
  );
  return restaurant;
}

async function getRestaurantByID(restaurantId) {
  return RestaurantModel.findById(restaurantId);
}

async function getBranches(filters, projection, options) {
  const branches = await RestaurantBranchModel.find(
    filters,
    projection,
    options,
  );
  return branches;
}

async function getMenuByID(menuId, projection, options, populations = []) {
  const query = MenuModel.findById(menuId, projection, options);

  if (populations && populations.length) {
    for (const populate of populations) {
      query.populate(populate.path, populate.projection);
    }
  }

  return query.exec();
}

async function getMenus(filters, projection, options) {
  const menus = await MenuModel.find(filters, projection, options);
  return menus;
}

async function createMenu(data) {
  const menu = await MenuModel.create(data);
  return menu;
}

async function updateMenu(id, data) {
  return await MenuModel.findByIdAndUpdate(id, data, { new: true });
}

async function appendMenuItem(menuId, menuItemId) {
  try {
    const updatedMenu = await MenuModel.findByIdAndUpdate(
      menuId,
      { $push: { menuItems: menuItemId } },
      { new: true },
    );

    if (!updatedMenu) {
      throw new Error(`Menu with ID ${menuId} not found`);
    }

    return updatedMenu;
  }
  catch (error) {
    logger.error('Error appending menu item to menu:', error);
    throw error;
  }
}

async function getMenuItems(menuId) {
  const menu = await getMenuByID(menuId, 'menuItems', null, [
    { path: 'menuItems' },
  ]);
  return menu?.menuItems ? menu.menuItems : [];
}

async function getMenuRestaurant(menuId) {
  const menu = await MenuModel.findById(menuId, 'branches').populate({
    path: 'branches',
    select: 'restaurant',
    populate: {
      path: 'restaurant',
    },
  });

  return menu?.branches[0]?.restaurant || null;
}

async function getRestaurantOwners(restaurantId) {
  const restaurant = await getRestaurantByID(restaurantId);

  if (!restaurant) {
    return [];
  }

  const branches = await getBranches(
    { restaurant: restaurantId },
    'manager staff',
  );

  if (!branches.length) {
    return [restaurant.owner];
  }

  const staff = branches.map(b => b.staff).flat();
  return [restaurant.owner, ...branches.map(b => b.manager), ...staff];
}

async function createMenuItem(data) {
  const menuItem = await MenuItemModel.create(data);
  return menuItem;
}

async function deleteMenu(menuId) {
  const session = await connection.startSession();
  session.startTransaction();

  try {
    const menu = await MenuModel.findById(menuId).session(session);

    if (!menu) {
      await session.commitTransaction();
      return 0;
    }

    await MenuItemModel.deleteMany({ _id: { $in: menu.menuItems } }).session(
      session,
    );
    await menu.deleteOne().session(session);
    await session.commitTransaction();
    return 1;
  }
  catch (error) {
    await session.abortTransaction();
    throw error;
  }
  finally {
    session.endSession();
  }
}

async function deleteMenuItem(menuId, itemId) {
  const session = await connection.startSession();
  session.startTransaction();

  try {
    await MenuItemModel.findByIdAndDelete(itemId).session(session);
    await MenuModel.findByIdAndUpdate(
      menuId,
      {
        $pull: {
          menuItems: itemId,
        },
      },
      { new: true },
    ).session(session);
    await session.commitTransaction();
  }
  catch (error) {
    await session.abortTransaction();
    throw error;
  }
  finally {
    session.endSession();
  }
}

async function updateMenuItem(itemid, data) {
  return MenuItemModel.findByIdAndUpdate(itemid, data, { new: true });
}

module.exports = {
  createRestaurant,
  createBranch,
  getRestaurant,
  getBranches,
  getMenus,
  createMenu,
  getMenuItems,
  getMenuByID,
  getMenuRestaurant,
  getRestaurantOwners,
  createMenuItem,
  appendMenuItem,
  updateMenu,
  deleteMenu,
  updateMenuItem,
  deleteMenuItem,
};
