const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  register,
  login,
  refreshAccessToken,
  logout,
  verifyEmail,
  resendVerification,
} = require("../controllers/auth.controller");

const { validate } = require("../middlewares/validation");

const {
  userRegistrationSchema,
  userLoginSchema,
} = require("../validator/auth.validator");
const User = require("../models/User");

// Public routes
router.post("/register", validate(userRegistrationSchema), register);
router.post("/login", validate(userLoginSchema), login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);
router.get("/verify-email", verifyEmail);
router.get("/resend-verification", resendVerification);
module.exports = router;
