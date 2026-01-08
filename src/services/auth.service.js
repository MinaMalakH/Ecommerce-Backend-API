const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const crypto = require("crypto");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");

exports.registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("EMAIL_EXISTS");

  const user = new User({
    name,
    email,
    password,
    isActive: false,
    isEmailVerified: false,
  });
  const verificationToken = user.generateEmailVerificationToken();

  // Save user to database
  await user.save();

  return { user, verificationToken };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive || !user.isEmailVerified) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("INVALID_CREDENTIALS");

  const tokens = await this.issueTokens(user);
  return { user, tokens };
};

exports.refreshSession = async (oldRefreshToken) => {
  const storedToken = await RefreshToken.findOne({
    refreshToken: oldRefreshToken,
  });
  if (!storedToken) throw new Error("INVALID_REFRESH_TOKEN");

  const user = await User.findById(storedToken.userId);
  if (!user || !user.isActive) throw new Error("USER_NOT_FOUND");

  // Token Rotation
  await storedToken.deleteOne();

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: user._id,
    refreshToken: newRefreshToken,
    expiresAt,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

exports.revokeToken = async (refreshToken, userId) => {
  const result = await RefreshToken.deleteOne({ refreshToken, userId });
  if (result.deletedCount === 0) throw new Error("TOKEN_NOT_FOUND");
  return true;
};

exports.issueTokens = async (user) => {
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

exports.sendVerifyEmail = async (email) => {
  try {
    if (!email) {
      const err = new Error("Email is Required");
      err.statusCode = 400;
      throw err;
    }
    const user = await User.findOne({ email: email.tolowerCase() });
    if (!user) {
      const err = new Error("User Not Found With This Email");
      err.statusCode = 404;
      throw err;
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Verify a user's email using a token
 */
exports.verifyUserEmail = async (token) => {
  // Hash the token from URL to match the version in the database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with this token and ensure it hasn't expired
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("INVALID_OR_EXPIRED_TOKEN");
  }

  // Update User status and clear verification fields
  user.isEmailVerified = true;
  user.isActive = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();
  return user;
};

/**
 * Logic to generate a new verification token for an existing user
 */
exports.processResendVerification = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.isEmailVerified) {
    // Note: using isEmailVerified to match your previous code
    throw new Error("ALREADY_VERIFIED");
  }

  // Generate new token (using the method defined on your User model)
  const verificationToken = user.generateEmailVerificationToken();
  await user.save();

  return {
    email: user.email,
    name: user.name,
    token: verificationToken,
  };
};

/**
 * Change user password and invalidate sessions
 */
exports.updateUserPassword = async (userId, currentPassword, newPassword) => {
  // 1. Fetch user with password field
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("USER_NOT_FOUND");

  // 2. Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("INCORRECT_PASSWORD");

  // 3. Update password (pre-save hooks in Model will hash this)
  user.password = newPassword;
  await user.save();

  // 4. Security: Delete all refresh tokens for this user
  // This forces the user to log in again on all devices
  await RefreshToken.deleteMany({ userId: user._id });

  return true;
};
