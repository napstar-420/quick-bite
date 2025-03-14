const { matchedData } = require('express-validator');
const { isNil } = require('lodash');

const UserService = require('../services/user.service');
const { logger } = require('../utils/logger');

async function getUsers(req, res) {
  const data = matchedData(req);
  const {
    page = 1,
    limit = 10,
    projection = 'name email phone lastActive createdAt',
    ...filters
  } = data;

  try {
    const result = await UserService.getUsers(filters, projection, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    });
    res.json(result);
  }
  catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
}

async function getUser(req, res) {
  const data = matchedData(req);

  try {
    const result = await UserService.getUserByID(
      data.id,
      '-password -refreshToken -id -__v',
    );

    if (isNil(result)) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(result);
  }
  catch (error) {
    logger.error('Server error', error);
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
}

module.exports = { getUsers, getUser };
