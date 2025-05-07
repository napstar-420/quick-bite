const { faker } = require('@faker-js/faker');
const axios = require('axios');

const config = require('../config');
// const PermissionModel = require('../models/permission.model');
// const CategoryModel = require('../models/restaurant-category.model');
const RoleModel = require('../models/role.model');
const UserModel = require('../models/user.model');
// const { getRole } = require('../services/auth.service');
const { hashPassword } = require('../utils/helpers');
const { logger } = require('../utils/logger');
const { connectDB, disconnectDB } = require('./connect');

const TOTAL_USERS = 10;
const USER_PASSWORD = 'Pakistan@123';
const ADMIN_PASSWORD = 'Pakistan@123';
const SUPER_ADMIN_PASSWORD = 'Pakistan@123';
// Using OpenStreetMap's Nominatim API which doesn't require an API key
// Note: Please respect their usage policy:
// https://operations.osmfoundation.org/policies/nominatim/
// Maximum of 1 request per second
const NOMINATIM_DELAY_MS = 1100; // Adding a little buffer to be safe

async function seedData() {
  await connectDB();
  await deleteData();
  // await seedPermissions();
  // await seedRoles();
  await seedUsers();
  // await seedCategories();
  await disconnectDB();
}

async function deleteData() {
  try {
    // await UserModel.deleteMany();
    // await CategoryModel.deleteMany();
    // await RoleModel.deleteMany();
    // await PermissionModel.deleteMany();
    logger.debug('Emptied DB for fresh seeding');
  }
  catch (error) {
    logger.error('Error while empty DB', error);
  }
}

// Countries with their geographical boundaries
const countries = [
  {
    name: 'United States',
    bounds: { minLng: -125.0, maxLng: -66.0, minLat: 24.0, maxLat: 49.0 },
  },
  {
    name: 'United Kingdom',
    bounds: { minLng: -8.0, maxLng: 2.0, minLat: 49.0, maxLat: 59.0 },
  },
  {
    name: 'Canada',
    bounds: { minLng: -141.0, maxLng: -52.0, minLat: 41.0, maxLat: 70.0 },
  },
  {
    name: 'Australia',
    bounds: { minLng: 113.0, maxLng: 154.0, minLat: -43.0, maxLat: -10.0 },
  },
  {
    name: 'Germany',
    bounds: { minLng: 5.0, maxLng: 15.0, minLat: 47.0, maxLat: 55.0 },
  },
  {
    name: 'France',
    bounds: { minLng: -5.0, maxLng: 9.0, minLat: 41.0, maxLat: 51.0 },
  },
  {
    name: 'Italy',
    bounds: { minLng: 6.0, maxLng: 19.0, minLat: 36.0, maxLat: 47.0 },
  },
  {
    name: 'Spain',
    bounds: { minLng: -10.0, maxLng: 4.0, minLat: 36.0, maxLat: 44.0 },
  },
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractAddressFromNominatim(data) {
  if (!data || !data.address) {
    return {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    };
  }

  const address = data.address;

  // Extract street
  let street = '';
  if (address.road) {
    street = address.road;
    if (address.house_number) {
      street = `${address.house_number} ${street}`;
    }
  }
  else if (address.pedestrian) {
    street = address.pedestrian;
  }
  else if (address.street) {
    street = address.street;
  }

  // Extract city
  let city = '';
  if (address.city) {
    city = address.city;
  }
  else if (address.town) {
    city = address.town;
  }
  else if (address.village) {
    city = address.village;
  }
  else if (address.suburb) {
    city = address.suburb;
  }

  // Extract state/province
  let state = '';
  if (address.state) {
    state = address.state;
  }
  else if (address.province) {
    state = address.province;
  }
  else if (address.county) {
    state = address.county;
  }

  // Extract country
  const country = address.country || '';

  // Extract postal code
  const postalCode = address.postcode || '';

  return {
    street,
    city,
    state,
    country,
    postalCode,
  };
}

async function getRandomAddress() {
  // 1. Select a random country
  const country = faker.helpers.arrayElement(countries);

  // 2. Generate random coordinates within that country
  const longitude = faker.number.float({
    min: country.bounds.minLng,
    max: country.bounds.maxLng,
    precision: 0.000001,
  });

  const latitude = faker.number.float({
    min: country.bounds.minLat,
    max: country.bounds.maxLat,
    precision: 0.000001,
  });

  try {
    // 3. Use reverse geocoding to get address data from OpenStreetMap's Nominatim
    const url = 'https://nominatim.openstreetmap.org/reverse';
    const response = await axios.get(url, {
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
        zoom: 18,
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'QuickBite-Seed-Script', // Required by Nominatim's usage policy
      },
    });

    // 4. Extract address components
    const addressComponents = extractAddressFromNominatim(response.data);

    // 5. Add delay to respect Nominatim's usage policy (1 request per second)
    await delay(NOMINATIM_DELAY_MS);

    // 6. Fill in any missing components with faker data
    const finalCountry = addressComponents.country || country.name;

    return {
      label: faker.helpers.arrayElement(['Home', 'Work', 'Other']),
      title: faker.location.secondaryAddress(),
      street: addressComponents.street || faker.location.streetAddress(),
      city: addressComponents.city || faker.location.city(),
      state: addressComponents.state || faker.location.state(),
      country: finalCountry,
      zipCode: addressComponents.postalCode || faker.location.zipCode(),
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };
  }
  catch (error) {
    logger.error('Error fetching address from coordinates', error);

    // Add delay even on error to respect Nominatim's usage policy
    await delay(NOMINATIM_DELAY_MS);

    // Fallback to faker if geocoding fails
    return {
      label: faker.helpers.arrayElement(['Home', 'Work', 'Other']),
      title: faker.location.secondaryAddress(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: country.name,
      zipCode: faker.location.zipCode(),
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };
  }
}

// async function seedPermissions() {
//   logger.info('Starting to seed permissions...');

//   const permissions = [];
//   const resources = Object.values(config.RESOURCES);
//   const actions = Object.values(config.ACTIONS);
//   const scopes = Object.values(config.SCOPES);

//   // Generate all possible permission combinations
//   for (const resource of resources) {
//     for (const action of actions) {
//       for (const scope of scopes) {
//         // Skip some irrelevant combinations
//         // For example, you can't have "own" scope for some actions on some resources
//         if (action === config.ACTIONS.MANAGE && scope === config.SCOPES.OWN) {
//           continue; // Skip this combination as manage is typically global
//         }

//         permissions.push({
//           resource,
//           action,
//           scope,
//           name: `${action}:${resource}:${scope}`,
//           description: `Permission to ${action} ${scope} ${resource}.`,
//         });
//       }
//     }
//   }

//   try {
//     await PermissionModel.insertMany(permissions);
//     logger.info(`${permissions.length} permissions seeded successfully.`);
//     return permissions;
//   }
//   catch (error) {
//     logger.error('Error seeding permissions', error);
//     throw error;
//   }
// }

// async function seedRoles() {
//   logger.info('Starting to seed roles...');

//   // Get all permissions
//   const allPermissions = await PermissionModel.find({});

//   // Define role permissions
//   const rolePermissions = {
//     // Super admin gets all permissions
//     [config.ROLES.SUPER_ADMIN]: allPermissions.map(p => p._id),

//     [config.ROLES.ADMIN]: allPermissions.filter(p =>
//       p.action !== config.ACTIONS.DELETE
//       || (p.resource !== config.RESOURCES.ROLE
//         && p.resource !== config.RESOURCES.PERMISSION),
//     ).map(p => p._id),

//     [config.ROLES.RESTAURANT_OWNER]: allPermissions.filter(p =>
//       // Restaurant owners can manage their own restaurants, branches, menus, items, etc.
//       ((p.resource === config.RESOURCES.RESTAURANT
//         || p.resource === config.RESOURCES.BRANCH
//         || p.resource === config.RESOURCES.MENU
//         || p.resource === config.RESOURCES.MENU_ITEM
//         || p.resource === config.RESOURCES.DISCOUNT)
//       && (p.scope === config.SCOPES.OWN))
//       // They can read reviews of their restaurants
//     || (p.resource === config.RESOURCES.REVIEW
//       && p.action === config.ACTIONS.READ
//       && p.scope === config.SCOPES.OWN)
//       // They can read and update their own orders
//     || (p.resource === config.RESOURCES.ORDER
//       && (p.action === config.ACTIONS.READ || p.action === config.ACTIONS.UPDATE)
//       && p.scope === config.SCOPES.OWN)
//       // They can manage notifications for their restaurants
//     || (p.resource === config.RESOURCES.NOTIFICATION
//       && p.scope === config.SCOPES.OWN)
//       // They can read delivery persons assigned to their orders
//     || (p.resource === config.RESOURCES.DELIVERY_PERSON
//       && p.action === config.ACTIONS.READ
//       && p.scope === config.SCOPES.OWN),
//     ).map(p => p._id),

//     [config.ROLES.RESTAURANT_STAFF]: allPermissions.filter(p =>
//       // Staff can read and update (but not create/delete) restaurant items
//       ((p.resource === config.RESOURCES.RESTAURANT
//         || p.resource === config.RESOURCES.BRANCH
//         || p.resource === config.RESOURCES.MENU
//         || p.resource === config.RESOURCES.MENU_ITEM)
//       && (p.action === config.ACTIONS.READ || p.action === config.ACTIONS.UPDATE)
//       && p.scope === config.SCOPES.OWN)
//       // They can read and update orders
//     || (p.resource === config.RESOURCES.ORDER
//       && (p.action === config.ACTIONS.READ || p.action === config.ACTIONS.UPDATE)
//       && p.scope === config.SCOPES.OWN)
//       // They can read reviews
//     || (p.resource === config.RESOURCES.REVIEW
//       && p.action === config.ACTIONS.READ
//       && p.scope === config.SCOPES.OWN)
//       // They can read notifications
//     || (p.resource === config.RESOURCES.NOTIFICATION
//       && p.action === config.ACTIONS.READ
//       && p.scope === config.SCOPES.OWN),
//     ).map(p => p._id),

//     [config.ROLES.CUSTOMER]: allPermissions.filter(p =>
//       // Customers can manage their own user account
//       (p.resource === config.RESOURCES.USER
//         && p.scope === config.SCOPES.OWN)
//       // They can read restaurants, branches, menus, and items
//       || ((p.resource === config.RESOURCES.RESTAURANT
//         || p.resource === config.RESOURCES.BRANCH
//         || p.resource === config.RESOURCES.MENU
//         || p.resource === config.RESOURCES.MENU_ITEM)
//       && p.action === config.ACTIONS.READ)
//       // They can create, read, and update (but not delete) their own orders
//     || (p.resource === config.RESOURCES.ORDER
//       && (p.action === config.ACTIONS.CREATE
//         || p.action === config.ACTIONS.READ
//         || p.action === config.ACTIONS.UPDATE)
//       && p.scope === config.SCOPES.OWN)
//       // They can CRUD their own reviews
//     || (p.resource === config.RESOURCES.REVIEW
//       && p.scope === config.SCOPES.OWN)
//       // They can read notifications
//     || (p.resource === config.RESOURCES.NOTIFICATION
//       && p.action === config.ACTIONS.READ
//       && p.scope === config.SCOPES.OWN),
//     ).map(p => p._id),

//     [config.ROLES.DELIVERY_PERSON]: allPermissions.filter(p =>
//       // Delivery persons can manage their own user account
//       (p.resource === config.RESOURCES.USER
//         && p.scope === config.SCOPES.OWN)
//       // They can read and update orders assigned to them
//       || (p.resource === config.RESOURCES.ORDER
//         && (p.action === config.ACTIONS.READ || p.action === config.ACTIONS.UPDATE)
//         && p.scope === config.SCOPES.OWN)
//       // They can read restaurants and branches for delivery
//       || ((p.resource === config.RESOURCES.RESTAURANT
//         || p.resource === config.RESOURCES.BRANCH)
//       && p.action === config.ACTIONS.READ)
//       // They can read and update their own delivery person profile
//     || (p.resource === config.RESOURCES.DELIVERY_PERSON
//       && (p.action === config.ACTIONS.READ || p.action === config.ACTIONS.UPDATE)
//       && p.scope === config.SCOPES.OWN)
//       // They can read notifications
//     || (p.resource === config.RESOURCES.NOTIFICATION
//       && p.action === config.ACTIONS.READ
//       && p.scope === config.SCOPES.OWN),
//     ).map(p => p._id),
//   };
//
//   // Create roles with assigned permissions
//   const roles = Object.entries(config.ROLES).map(([_, name]) => ({
//     name,
//     description: `${name.replace(/-/g, ' ')} role with appropriate permissions`,
//     permissions: rolePermissions[name] || [],
//   }));

//   try {
//     await RoleModel.insertMany(roles);
//     logger.info(`${roles.length} roles seeded successfully.`);
//   }
//   catch (error) {
//     logger.error('Error seeding roles', error);
//     throw error;
//   }
// }

async function seedUsers() {
  const users = [];
  const HASHED_PASSWORD = await hashPassword(USER_PASSWORD);

  logger.info(`Starting to generate ${TOTAL_USERS} users with addresses...`);
  logger.info(
    'This may take a few minutes due to API rate limiting (1 request/second)',
  );

  // Get role IDs
  const customerRole = await RoleModel.findOne({ name: config.ROLES.CUSTOMER }, '_id');
  const adminRole = await RoleModel.findOne({ name: config.ROLES.ADMIN }, '_id');
  const superAdminRole = await RoleModel.findOne(
    { name: config.ROLES.SUPER_ADMIN },
    '_id',
  );
  const restaurantOwnerRole = await RoleModel.findOne(
    { name: config.ROLES.RESTAURANT_OWNER },
    '_id',
  );
  const restaurantStaffRole = await RoleModel.findOne(
    { name: config.ROLES.RESTAURANT_STAFF },
    '_id',
  );
  const deliveryPersonRole = await RoleModel.findOne(
    { name: config.ROLES.DELIVERY_PERSON },
    '_id',
  );

  for (let i = 0; i < TOTAL_USERS; i++) {
    try {
      const address = await getRandomAddress();
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: HASHED_PASSWORD,
        phone: faker.phone.number({ style: 'international' }),
        // address,
        lastActive: faker.date.past(1),
        createdAt: faker.date.past(1),
        updatedAt: faker.date.past(1),
        roles: [customerRole._id],
      });

      // Log progress
      if ((i + 1) % 5 === 0) {
        logger.info(`Generated ${i + 1}/${TOTAL_USERS} users`);
      }
    }
    catch (error) {
      logger.error(`Error generating user ${i}`, error);
    }
  }

  // Add admin user
  users.push({
    name: 'Admin',
    email: 'admin@quickbite.com',
    password: await hashPassword(ADMIN_PASSWORD),
    phone: '+923001234567',
    roles: [adminRole._id],
  });

  // Add super admin user
  users.push({
    name: 'Super Admin',
    email: 'superadmin@quickbite.com',
    password: await hashPassword(SUPER_ADMIN_PASSWORD),
    phone: '+923011234567',
    roles: [superAdminRole._id],
  });

  // Add a restaurant owner user
  users.push({
    name: 'Restaurant Owner',
    email: 'owner@quickbite.com',
    password: await hashPassword(USER_PASSWORD),
    phone: '+923021234567',
    roles: [restaurantOwnerRole._id],
  });

  // Add a restaurant staff user
  users.push({
    name: 'Restaurant Staff',
    email: 'staff@quickbite.com',
    password: await hashPassword(USER_PASSWORD),
    phone: '+923031234567',
    roles: [restaurantStaffRole._id],
  });

  // Add a delivery person user
  users.push({
    name: 'Delivery Person',
    email: 'delivery@quickbite.com',
    password: await hashPassword(USER_PASSWORD),
    phone: '+923041234567',
    roles: [deliveryPersonRole._id],
  });

  try {
    await UserModel.insertMany(users);
    logger.info(`${users.length} users seeded successfully.`);
  }
  catch (error) {
    logger.error('Error seeding users', error);
  }
}

// async function seedCategories() {
//   const categories = [];

//   for (let i = 0; i < 50; i++) {
//     categories.push({ name: faker.food.ethnicCategory() });
//   }

//   const filteredCategories = categories.filter(
//     (category, index, self) =>
//       index === self.findIndex(t => t.name === category.name),
//   );

//   try {
//     await CategoryModel.insertMany(filteredCategories);
//     logger.info(`${filteredCategories.length} categories seeded successfully.`);
//   }
//   catch (error) {
//     logger.error('Error seeding categories', error);
//   }
// }

seedData()
  .then(() => {
    logger.info('Data seeded successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Error while seeding data', error);
    process.exit(1);
  });
