const jwt = require("jsonwebtoken");
const { issueTokens } = require("../services/auth.service");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");

/**
 * Register a new user
 * POST /auth/register
 * Body: { name, email, password }
 */

exports.register = async (req, res) => {
  const { name, email, password } = req.validatedData;

  try {
    // Step 1: Check if email already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Step 2: Create New User (Password is hashed automatically)
    const user = await User.create({ name, email, password });

    // Step 3: Issue tokens
    const tokens = await issueTokens(user);

    // Step 4: return user info (exclude password) + Tokens
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Login user
 * POST /auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  const { email, password } = req.validatedData;

  try {
    // Step 1 : Find user by email (include password for verification)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Step 2: Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Step 3: Issue Tokens
    const tokens = await issueTokens(user);

    // Step 4: Return user info (without password) + tokens
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.refreshAccessToken = async (req, res) => {
  try {
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

    // Step 3: Delete old refresh token (rotation)
    await storedToken.deleteOne();

    // Step 4: Generate new access & refresh tokens
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
  } catch (error) {
    res.status(500).json({ message: "Error" + error });
  }
};

exports.logout = async (req, res) => {
  try {
    // 1. Get refresh token from httpOnly cookie (not body)
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        message: "No refresh token provided",
      });
    }
    // 2. Verify the token belongs to the authenticated user
    const tokenRecord = await RefreshToken.findOne({
      refreshToken: refreshToken,
      userId: req.user._id, // From protect middleware
    });

    if (!tokenRecord) {
      // Token doesn't exist or doesn't belong to this user
      return res.status(400).json({
        message: "Invalid refresh token",
      });
    }
    // 3. Delete the refresh token from database
    await RefreshToken.deleteOne({
      refreshToken: refreshToken,
      userId: req.user._id,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Error during logout",
    });
  }
};
