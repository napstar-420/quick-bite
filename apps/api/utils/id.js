const { customAlphabet } = require("nanoid");

const config = require("../config");

function genUserId() {
  return customAlphabet(config.USER_ID_ALPHABETS, config.USER_ID_LENGTH);
}

module.exports = { genUserId };
