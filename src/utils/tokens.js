const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_REFRESH_SECRET }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

model.exports = {
  generateAccessToken,
  generateRefreshToken,
};
