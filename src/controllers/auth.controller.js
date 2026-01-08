const authService = require("../services/auth.service");
const { sendVerificationEmail } = require("../services/email.service");

/**
 * Register a new user
 * POST /auth/register
 * Body: { name, email, password }
 */

exports.register = async (req, res) => {
  try {
    const { user, verificationToken } = await authService.registerUser(
      req.validatedData
    );
    await sendVerificationEmail(user.email, verificationToken, user.name);
    res.status(201).json({
      message:
        "Registration Successful! Please Check Your Email To Verify Your Account",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Server Error" + error });
  }
};

/**
 * Login user
 * POST /auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.validatedData;
    const { user, tokens } = await authService.loginUser(email, password);

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
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};
exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh Token Required" });

    const tokens = await authService.refreshSession(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    const status = error.message === "INVALID_REFRESH_TOKEN" ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.revokeToken(refreshToken, req.user._id);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Verify Email
 * GET /auth/verify-email?token=...
 */

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Verification Token is Required",
      });
    }

    // Call the service
    await authService.verifyUserEmail(token);

    res.status(200).json({
      message: "Email Verified Successfully! You Can Now Log In",
    });
  } catch (error) {
    if (error.message === "INVALID_OR_EXPIRED_TOKEN") {
      return res.status(400).json({
        message: "Invalid Or Expired Verification Token",
      });
    }

    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Server error during email verification",
    });
  }
};

/**
 * Resend verification email
 * POST /auth/resend-verification
 */
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 1. Process business logic via service
    const {
      email: userEmail,
      name,
      token,
    } = await authService.processResendVerification(email);

    // 2. Trigger side effect (sending the actual email)
    await sendVerificationEmail(userEmail, token, name);

    res.status(200).json({
      message: "Verification email sent! Please check your inbox.",
    });
  } catch (error) {
    // Handle specific business logic errors
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "ALREADY_VERIFIED") {
      return res.status(400).json({ message: "Email already verified" });
    }

    console.error("Resend verification error:", error);
    res.status(500).json({
      message: "Server error while resending verification email",
    });
  }
};
/*
 * Get User Profile after Login
 * GET /auth/getMe
 */
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * Change Password
 * POST /auth/change-password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Call service with user ID from the 'protect' middleware
    await authService.updateUserPassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    if (error.message === "INCORRECT_PASSWORD") {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
};
