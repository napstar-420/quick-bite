const jwt = require("jsonwebtoken");

const config = require("../config");

function genUserAccessToken(id) {
  return jwt.sign(
    { id },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXP,
    },
  );
}

function genUserRefreshToken(id) {
  return jwt.sign(
    { id },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXP,
    },
  );
}

module.exports = {
  genUserAccessToken,
  genUserRefreshToken,
};
