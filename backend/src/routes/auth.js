const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const {
  register,
  registerRules,
  login,
  loginRules,
  forgotPassword,
  forgotPasswordRules,
  resetPassword,
  resetPasswordRules,
  updateProfile,
  updateProfileRules,
  changePassword,
  changePasswordRules,
  getMe,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { generateToken } = require("../utils/jwt");

// Email / Password
router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.post("/forgot-password", forgotPasswordRules, forgotPassword);
router.post("/reset-password", resetPasswordRules, resetPassword);
router.get("/me", authenticate, getMe);

// Profile (butuh token)
router.put("/update-profile", authenticate, updateProfileRules, updateProfile);
router.put(
  "/change-password",
  authenticate,
  changePasswordRules,
  changePassword,
);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    try {
      const token = generateToken({ id: req.user.id, email: req.user.email });
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(
        `${frontendUrl}/auth/callback?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&avatar=${encodeURIComponent(req.user.avatar ?? "")}`,
      );
    } catch (err) {
      const logger = require("../utils/logger");
      logger.error({ err }, "Google callback failed");
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
    }
  },
);

module.exports = router;
