const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

const config = require('../config');
const MenuItemModel = require('../models/menu-item.model');
const MenuModel = require('../models/menu.model');
const RestaurantBranchModel = require('../models/restaurant-branch.model');
const CategoryModel = require('../models/restaurant-category.model');
const RestaurantModel = require('../models/restaurant.model');
const RoleModel = require('../models/role.model');
const UserModel = require('../models/user.model');
const { hashPassword } = require('../utils/helpers');
const { geocodeAddress } = require('../utils/helpers');
const { logger } = require('../utils/logger');
const { connectDB, disconnectDB } = require('./connect');
const restaurants = require('./restaurants_data.json');

const USER_PASSWORD = 'Pakistan@123';

async function createUserForRestaurant() {
  try {
    const HASHED_PASSWORD = await hashPassword(USER_PASSWORD);
    const customerRole = await RoleModel.findOne({ name: config.ROLES.CUSTOMER }, '_id');
    const restaurantOwnerRole = await RoleModel.findOne(
      { name: config.ROLES.RESTAURANT_OWNER },
      '_id',
    );

    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: HASHED_PASSWORD,
      phone: `+92${faker.string.numeric(10)}`,
      roles: [customerRole._id, restaurantOwnerRole._id],
    };

    return await UserModel.create(user);
  }
  catch (error) {
    logger.error(`Error creating user: ${error}`);
  }
}

(async () => {
  await connectDB();

  try {
    await MenuModel.deleteMany({});
    await MenuItemModel.deleteMany({});
    await RestaurantBranchModel.deleteMany({});
    await RestaurantModel.deleteMany({});
    await CategoryModel.deleteMany({});
  }
  catch (error) {
    logger.error(`Error deleting data: ${error}`);
  }

  logger.info('Deleted all existing data');

  for (const restaurant of restaurants) {
    const {
      name,
      image,
      postal_code,
      cuisines,
      price_range,
      address,
      menu: menus,
    } = restaurant;

    const categories = [];

    for (const cuisine of cuisines) {
      try {
        await CategoryModel.updateOne(
          { name: cuisine.toLowerCase().trim() },
          { $setOnInsert: { name: cuisine } },
          { upsert: true },
        );

        const createdCategory = await CategoryModel.findOne(
          { name: cuisine.toLowerCase().trim() },
          '_id',
        );

        categories.push(createdCategory._id);
      }
      catch (error) {
        logger.error(`Error creating category ${cuisine}: ${error}`);
      }
    }

    // Create restaurant
    const restaurantOwner = await createUserForRestaurant();
    const cleanName = name.split('-')[0].trim();
    const restaurantPhone = `+92${faker.string.numeric(10)}`;
    const restaurantEmail = `${name.toLowerCase().trim().replace(/\s+/g, '-')}@gmail.com`;

    const existingRestaurant = await RestaurantModel.findOne(
      { email: restaurantEmail },
      '_id',
    );

    if (existingRestaurant) {
      logger.info(`Restaurant ${name} already exists`);
      continue;
    }

    let latitude, longitude;

    try {
      const coordinates = await geocodeAddress(address);
      latitude = coordinates.latitude;
      longitude = coordinates.longitude;
    }
    catch (error) {
      logger.error(`Error geocoding address ${address}: ${error}`);
      continue;
    }

    const session = await mongoose.startSession();
    session.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
      maxTimeMS: 30000,
    });

    try {
      const createdRestaurant = (await RestaurantModel.create([{
        name: cleanName,
        email: restaurantEmail,
        phone: restaurantPhone,
        owner: restaurantOwner._id,
        logo: image,
        categories,
        priceRange: price_range,
        status: 'approved',
      }], { session }))[0];

      const branchName = name.split('-')[1]?.trim() || 'Main Branch';

      const branchAddress = {
        street: address.replace('Lahore.', '.').replace('Punjab', ''),
        city: 'Lahore',
        state: 'Punjab',
        zipCode: postal_code,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      };
      const openingHours = [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          from: '09:00',
          to: '23:00',
        },
      ];

      const createdBranch = (await RestaurantBranchModel.create([{
        name: branchName,
        restaurant: createdRestaurant._id,
        phone: restaurantPhone,
        manager: restaurantOwner._id,
        staff: [],
        openingHours,
        address: branchAddress,
        status: 'approved',
      }], { session }))[0];

      const createdMenus = [];

      // Create menu and Menu Items
      for (const menu of menus) {
        const { category: menuName, items } = menu;
        const itemsIds = [];

        if (menuName === 'Popular') {
          continue;
        }

        for (const item of items) {
          const { name, description, price, image } = item;

          const createdMenuItem = (await MenuItemModel.create([{
            name,
            description,
            price: Number(price),
            image,
          }], { session }))[0];

          itemsIds.push(createdMenuItem._id);
        }

        const createdMenu = (await MenuModel.create([{
          name: menuName,
          branches: [createdBranch._id],
          menuItems: itemsIds,
        }], { session }))[0];

        createdMenus.push(createdMenu);
      }

      await session.commitTransaction();

      logger.info(`
        --------------------------------
        Restaurant ${name} created successfully
        --------------------------------
      `);
    }
    catch (error) {
      logger.error(`Error creating restaurant ${name}: ${error}`);
      await session.abortTransaction();
      continue;
    }
    finally {
      await session.endSession();
    }
  }

  await disconnectDB();
  process.exit(0);
})();
