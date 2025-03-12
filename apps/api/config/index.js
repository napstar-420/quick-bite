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
  SALT_ROUNDS: 10,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXP: '30s',
  REFRESH_TOKEN_EXP: '30d',
  REFRESH_TOKEN_COOKIE_NAME: 'refreshToken',
  USER_ID_LENGTH: 16,
  USER_ID_ALPHABETS:
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
});
