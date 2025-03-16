const { customAlphabet } = require('nanoid');

const config = require('../config');

const idGenerator = customAlphabet(
  config.ID_ALPHABETS,
  config.ID_LENGTH,
);

const genUserId = idGenerator;

const genRoleId = customAlphabet(
  config.ROLE_ID_ALPHABETS,
  config.ROLE_ID_LENGTH,
);

const genPermissionId = customAlphabet(
  config.PERMISSION_ID_ALPHABETS,
  config.PERMISSION_ID_LENGTH,
);

function genRestaurantId() {
  return `${config.RESTAURANT_ID_PREFIX}${idGenerator()}`;
};

function genRestaurantBranchId() {
  const idGenerator = customAlphabet(
    config.ID_ALPHABETS,
    config.ID_LENGTH,
  );

  return `${config.RESTAURANT_BRANCH_ID_PREFIX}${idGenerator()}`;
};

const genReviewId = customAlphabet(
  config.USER_ID_ALPHABETS,
  config.USER_ID_LENGTH,
);

module.exports = {
  genUserId,
  genRoleId,
  genPermissionId,
  genReviewId,
  genRestaurantId,
  genRestaurantBranchId,
};
