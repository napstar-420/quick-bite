const { customAlphabet } = require("nanoid");
const bcrypt = require("bcrypt");
const config = require('../config')

function genUserId() {
  return customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 16);
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(config.SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

module.exports = { genUserId, hashPassword, comparePassword };
