const refreshTokenConfig = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

module.exports = { refreshTokenConfig };
