/* eslint-disable node/no-process-env */
const createConfig = require('@quick-bite/app-config/create-config');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({
  path: [
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../../../.env'),
  ],
});

module.exports = createConfig.default({
  DB_URI: process.env.DB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  MAP_BOX_API_KEY: process.env.MAP_BOX_API_KEY,
  SALT_ROUNDS: 10,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXP: '5s',
  REFRESH_TOKEN_EXP: '30d',
  REFRESH_TOKEN_COOKIE_NAME: 'refreshToken',
  USER_ID_LENGTH: 16,
  USER_ID_ALPHABETS:
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  ROLE_ID_LENGTH: 10,
  ROLE_ID_ALPHABETS: '1234567890',
  PERMISSION_ID_LENGTH: 10,
  PERMISSION_ID_ALPHABETS: '1234567890',
  RESTAURANT_ID_PREFIX: 'R',
  RESTAURANT_BRANCH_ID_PREFIX: 'RB',
  ID_LENGTH: 10,
  ID_ALPHABETS:
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',

  DAYS_OF_WEEK: {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
    SATURDAY: 'saturday',
    SUNDAY: 'sunday',
  },
});
