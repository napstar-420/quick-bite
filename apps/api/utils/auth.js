const jwt = require('jsonwebtoken');

const config = require('../config');

/**
 * Generate an access token for a user
 * @param {string} id - User ID
 * @param {Array<string>} roles - User roles
 * @returns {string} - JWT access token
 */
function genUserAccessToken(id, roles = []) {
  return jwt.sign({ id, roles }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXP,
  });
}

/**
 * Generate a refresh token for a user
 * @param {string} id - User ID
 * @returns {string} - JWT refresh token
 */
function genUserRefreshToken(id) {
  return jwt.sign({ id }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXP,
  });
}

module.exports = {
  genUserAccessToken,
  genUserRefreshToken,
};
