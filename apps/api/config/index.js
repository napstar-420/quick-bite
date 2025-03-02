/* eslint-disable regexp/prefer-w */
/* eslint-disable node/no-process-env */
const createConfig = require('@quick-bite/app-config/create-config');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({
  path: [
    path.join(__dirname, '.../.env'),
    path.join(__dirname, '../../../.env'),
  ],
});

const PASS_MIN_LENGTH = 8;
const PASS_MAX_LENGTH = 64;
const PASS_ALLOWED_SPECIAL_CHARS = '@$!%*?&_';

module.exports = createConfig.default({
  DB_URI: process.env.DB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PASS_MIN_LENGTH,
  PASS_MAX_LENGTH,
  PASS_ALLOWED_SPECIAL_CHARS,
  PASS_REGEX: new RegExp(
    // eslint-disable-next-line style/max-len
    `^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[${PASS_ALLOWED_SPECIAL_CHARS}])[A-Za-z\\d${PASS_ALLOWED_SPECIAL_CHARS}]{${PASS_MIN_LENGTH},${PASS_MAX_LENGTH}}$`,
  ),
  SALT_ROUNDS: 10,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'secret 2',
  ACCESS_TOKEN_EXP: '30s',
  REFRESH_TOKEN_EXP: '15m',
  REFRESH_TOKEN_COOKIE_NAME: 'refreshToken',
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 64,
  USER_ID_LENGTH: 16,
  USER_ID_ALPHABETS:
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
});
