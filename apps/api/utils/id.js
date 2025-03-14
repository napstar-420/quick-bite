const { customAlphabet } = require('nanoid');

const config = require('../config');

const genUserId = customAlphabet(
  config.USER_ID_ALPHABETS,
  config.USER_ID_LENGTH,
);

const genRoleId = customAlphabet(
  config.ROLE_ID_ALPHABETS,
  config.ROLE_ID_LENGTH,
);

const genPermissionId = customAlphabet(
  config.PERMISSION_ID_ALPHABETS,
  config.PERMISSION_ID_LENGTH,
);

const genReviewId = customAlphabet(
  config.USER_ID_ALPHABETS,
  config.USER_ID_LENGTH,
);

module.exports = {
  genUserId,
  genRoleId,
  genPermissionId,
  genReviewId,
};
