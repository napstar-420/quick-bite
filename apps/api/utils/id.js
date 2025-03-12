const { customAlphabet } = require('nanoid');

const config = require('../config');

const genUserId = customAlphabet(config.USER_ID_ALPHABETS, config.USER_ID_LENGTH);

module.exports = { genUserId };
