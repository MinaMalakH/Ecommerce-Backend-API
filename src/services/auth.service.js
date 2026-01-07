const RefreshToken = require("../models/RefreshToken");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");

const issueTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

  await RefreshToken.create({
    userId: user._id,
    refreshToken: refreshToken,
    expiresAt: refreshTokenExpiry,
  });
  return { accessToken, refreshToken };
};

module.exports = { issueTokens };
