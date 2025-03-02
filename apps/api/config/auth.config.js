const config = require('../config');

const refreshTokenConfig = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'none',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

module.exports = { refreshTokenConfig };
