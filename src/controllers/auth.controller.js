const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");

exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token Required" });
  }

  // Step 1: Validate the old refresh token in DB
  const storedToken = await RefreshToken.findOne({
    refreshToken: refreshToken,
  });
  if (!storedToken) {
    return res.status(403).json({ message: "Invalid Refresh Token" });
  }

  const user = await User.findById(storedToken.userId);
  if (!user || !user.isActive) {
    return res.status(403).json({ message: "User Not Found" });
  }

  // Step 2: Delete old refresh token (rotation)
  await storedToken.deleteOne();

  // Step 3: Generate new access & refresh tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  await RefreshToken.create({
    userId: user._id,
    refreshToken: newRefreshToken,
    expiresAt,
  });

  // Step 4: Return new tokens
  res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
  res.status(200).json({ message: "Logged out successfully" });
};
