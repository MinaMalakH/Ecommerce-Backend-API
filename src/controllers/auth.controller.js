const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const { generateAccessToken } = require("../utils/tokens");

exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token Required" });
  }

  const storedToken = await RefreshToken.findOne({
    refreshToken: refreshToken,
  });
  if (!storedToken) {
    return res.status(403).json({ message: "Invalid Refresh Token" });
  }
  const user = await User.findById(storedToken.userId);
  if (!user) {
    return res.status(403).json({ message: "User Not Found" });
  }
  const newAccessToken = generateAccessToken(user);
  res.status(200).json({ accessToken: newAccessToken });
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.status(200).json({ message: "Logged out successfully" });
};
