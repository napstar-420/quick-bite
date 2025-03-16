const { faker } = require('@faker-js/faker');
const axios = require('axios');

const config = require('../config');
const CategoryModel = require('../models/restaurant-category.model');
const UserModel = require('../models/user.model');
const { getRole } = require('../services/auth.service');
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
  await seedUsers();
  await seedCategories();
  await disconnectDB();
}

async function deleteData() {
  try {
    await UserModel.deleteMany();
    await CategoryModel.deleteMany();
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

async function seedUsers() {
  const users = [];
  const HASHED_PASSWORD = await hashPassword(USER_PASSWORD);

  logger.info(`Starting to generate ${TOTAL_USERS} users with addresses...`);
  logger.info(
    'This may take a few minutes due to API rate limiting (1 request/second)',
  );

  const role = await getRole({ name: config.ROLES.CUSTOMER }, 'id');
  const adminRole = await getRole({ name: config.ROLES.ADMIN }, 'id');
  const superAdminRole = await getRole({ name: config.ROLES.SUPER_ADMIN }, 'id');

  for (let i = 0; i < TOTAL_USERS; i++) {
    try {
      const address = await getRandomAddress();
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: HASHED_PASSWORD,
        phone: faker.phone.number({ style: 'international' }),
        addresses: [address],
        lastActive: faker.date.past(1),
        createdAt: faker.date.past(1),
        updatedAt: faker.date.past(1),
        roles: [role.id],
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
    addresses: [],
    roles: [adminRole.id],
  });

  // Add super admin user
  users.push({
    name: 'Super Admin',
    email: 'superadmin@quickbite.com',
    password: await hashPassword(SUPER_ADMIN_PASSWORD),
    phone: '+923011234567',
    addresses: [],
    roles: [superAdminRole.id],
  });

  try {
    await UserModel.insertMany(users);
    logger.info(`${users.length} users seeded successfully.`);
  }
  catch (error) {
    logger.error('Error seeding users', error);
  }
}

async function seedCategories() {
  const categories = [];

  for (let i = 0; i < 50; i++) {
    categories.push({ name: faker.food.ethnicCategory() });
  }

  const filteredCategories = categories.filter(
    (category, index, self) =>
      index === self.findIndex(t => t.name === category.name),
  );

  try {
    await CategoryModel.insertMany(filteredCategories);
    logger.info(`${filteredCategories.length} categories seeded successfully.`);
  }
  catch (error) {
    logger.error('Error seeding categories', error);
  }
}

seedData()
  .then(() => {
    logger.info('Data seeded successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Error while seeding data', error);
    process.exit(1);
  });
