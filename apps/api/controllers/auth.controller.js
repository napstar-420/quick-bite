const { validationResult, matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const { isNil } = require('lodash');

const config = require('../config');
const { refreshTokenConfig } = require('../config/auth.config');
const UserService = require('../services/user.service');
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
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    return res.status(400).json({ errors });
  }

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
    const accessToken = genUserAccessToken(newUser.id);
    const refreshToken = genUserRefreshToken(newUser.id);
    // Update refresh token
    UserService.updateUser(newUser.id, { refreshToken });
    res.cookie(
      config.REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenConfig,
    );

    return res.json({ accessToken });
  }
  catch {
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
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    return res.status(400).json({ errors });
  }

  const data = matchedData(req);
  const user = await UserService.getUser(
    { email: data.email },
    'name email password',
  );

  if (isNil(user)) {
    return res.sendStatus(401);
  }

  const passwordsMatched = await comparePassword(data.password, user.password);

  if (!passwordsMatched) {
    return res.sendStatus(401);
  }

  const accessToken = genUserAccessToken(user.id);
  const refreshToken = genUserRefreshToken(user.id);

  // Update refresh token
  UserService.updateUser(user.id, { refreshToken });

  res.cookie(
    config.REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    refreshTokenConfig,
  );

  return res.json({ accessToken });
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

  const user = await UserService.getUser({ refreshToken });

  if (isNil(user)) {
    return res.sendStatus(403);
  }

  try {
    jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
  }
  catch {
    return res.sendStatus(403);
  }

  const accessToken = genUserAccessToken(user.id);

  return res.json({ accessToken });
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

  const user = await UserService.getUser({ refreshToken });

  if (isNil(user)) {
    return res.sendStatus(204);
  }

  await UserService.updateUser(user.id, { refreshToken: null });

  res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, refreshTokenConfig);

  return res.sendStatus(204);
}

module.exports = {
  signin,
  signout,
  refreshToken,
  signup,
};
