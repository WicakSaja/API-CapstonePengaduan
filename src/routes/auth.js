import express from "express";
const router = express.Router();

import * as authController from "../controllers/authController.js";
import authValidators from "../validators/authValidators.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// Registration route
router.post(
  "/register",
  authValidators.registerValidator,
  authValidators.validate,
  authController.register
);

// Login route
router.post(
  "/login",
  authValidators.loginValidator,
  authValidators.validate,
  authController.login
);

// Logout route
router.post("/logout", authMiddleware, authController.logout);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

router.post("/forgot-password", authController.forgotPassword);

router.post(
  "/reset-password",
  authValidators.resetPasswordValidator,
  authValidators.validate,
  authController.resetPassword
);

// Get current user profile
router.get("/me", authMiddleware, authController.getProfile);

// Update current user profile
router.put(
  "/me",
  authMiddleware,
  authValidators.updateProfileValidator,
  authValidators.validate,
  authController.updateProfile
);

// Change password route
router.put(
  "/change-password",
  authMiddleware,
  authValidators.changePasswordValidator,
  authValidators.validate,
  authController.changePassword
);

export default router;
