const { matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const { isNil } = require('lodash');

const config = require('../config');
const { refreshTokenConfig } = require('../config/auth.config');
// Services
const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');
// Utils
const { genUserAccessToken, genUserRefreshToken } = require('../utils/auth');
const { comparePassword } = require('../utils/helpers');
const { logger } = require('../utils/logger');

/**
 * Handles user signup
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
async function signup(req, res) {
  const data = matchedData(req);
  const existingUser = await UserService.getUser(
    { email: data.email },
    'email',
  );

  if (existingUser) {
    return res
      .status(409)
      .json({ message: 'User with this email already exists' });
  }

  try {
    const newUser = await UserService.createUser(data);
    logger.debug(`New user created: ${newUser.email}`);
    const roles = await AuthService.getRoles(
      { _id: { $in: newUser.roles } },
      'name',
    );
    const accessToken = genUserAccessToken(
      newUser.id,
      roles.map(role => role.name),
    );
    const refreshToken = genUserRefreshToken(newUser.id);
    // Update refresh token
    UserService.updateUser(newUser.id, { refreshToken });
    res.cookie(
      config.REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenConfig,
    );

    return res.json({ token: accessToken, user: newUser });
  }
  catch (error) {
    logger.error(error);
    return res.sendStatus(500);
  }
}

/**
 * Handles user signin
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
async function signin(req, res) {
  const data = matchedData(req);
  const user = await UserService.getUser(
    { email: data.email },
    'name email password roles phone address',
  );

  if (isNil(user)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordsMatched = await comparePassword(data.password, user.password);

  if (!passwordsMatched) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const roles = await AuthService.getRoles(
    { _id: { $in: user.roles } },
    'name',
  );
  const accessToken = genUserAccessToken(
    user.id,
    roles.map(role => role.name),
  );
  const refreshToken = genUserRefreshToken(user.id);

  // Update refresh token
  UserService.updateUser(user.id, { refreshToken });

  res.cookie(
    config.REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    refreshTokenConfig,
  );

  return res.json({ token: accessToken, user });
}

/**
 * Generates a new access token for the user.
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (isNil(refreshToken)) {
    return res.sendStatus(401);
  }

  const user = await UserService.getUser({ refreshToken }, 'id roles name phone email address');

  if (isNil(user)) {
    return res.sendStatus(403);
  }

  try {
    jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
  }
  catch (error) {
    logger.error(error);
    await UserService.updateUser(user.id, { refreshToken: null });
    res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, refreshTokenConfig);
    return res.sendStatus(403);
  }

  const roles = await AuthService.getRoles(
    { _id: { $in: user.roles } },
    'name',
  );
  const accessToken = genUserAccessToken(
    user.id,
    roles.map(role => role.name),
  );
  // Update user lastActive
  await UserService.updateUser(user.id, { lastActive: new Date() });

  return res.json({ token: accessToken, user });
}

/**
 * Signs out the user by removing their refresh token from the database and
 * clearing the refreshToken cookie.
 * Also clear access token on client side
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
async function signout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (isNil(refreshToken)) {
    return res.sendStatus(204);
  }

  const user = await UserService.getUser({ refreshToken }, 'id');

  if (isNil(user)) {
    return res.sendStatus(204);
  }

  await UserService.updateUser(user.id, { refreshToken: null });

  res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, refreshTokenConfig);

  return res.sendStatus(204);
}

/**
 * Checks if a user with the specified email exists
 * @param {Request} req - Express request object with email query parameter
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
async function checkUserExists(req, res) {
  const data = matchedData(req);

  try {
    // Check if user exists
    const user = await UserService.getUser({ email: data.email }, 'email');

    logger.debug(`User existence check for email: ${data.email}`);

    return res.json({
      exists: !isNil(user),
      email: data.email,
    });
  }
  catch (error) {
    logger.error(`Error checking user existence: ${error.message}`);
    return res.status(500).json({
      message: 'Internal server error while checking user existence',
    });
  }
}

module.exports = {
  signin,
  signout,
  refreshToken,
  signup,
  checkUserExists,
};
