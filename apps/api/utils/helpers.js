const bcrypt = require('bcryptjs');

const config = require('../config');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(config.SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

module.exports = { hashPassword, comparePassword };
