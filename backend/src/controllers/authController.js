const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { sendResetPasswordEmail } = require("../utils/email");
const { success, error } = require("../utils/response");
const prisma = require("../config/prisma");

// Validation Rules
const registerRules = [
  body("name").trim().notEmpty().withMessage("Nama wajib diisi."),
  body("email")
    .isEmail()
    .withMessage("Format email tidak valid.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter."),
];

const loginRules = [
  body("email")
    .isEmail()
    .withMessage("Format email tidak valid.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password wajib diisi."),
];

const forgotPasswordRules = [
  body("email")
    .isEmail()
    .withMessage("Format email tidak valid.")
    .normalizeEmail(),
];

const resetPasswordRules = [
  body("token").notEmpty().withMessage("Token tidak valid."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter."),
];

const updateProfileRules = [
  body("name").trim().notEmpty().withMessage("Nama tidak boleh kosong."),
];

const changePasswordRules = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Password saat ini wajib diisi."),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password baru minimal 6 karakter."),
];

// Register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);
  try {
    const { name, email, password } = req.body;
    const existing = await UserModel.findByEmail(email);
    if (existing)
      return error(res, "Email sudah terdaftar. Silakan masuk.", 409);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken({ id: user.id, email: user.email });
    req.log.info({ userId: user.id, email }, "User registered");
    return success(res, { user, token }, "Registrasi berhasil!", 201);
  } catch (err) {
    req.log.error({ err, email: req.body.email }, "Register failed");
    return error(res, "Gagal mendaftarkan akun. Coba lagi.", 500);
  }
};

// Login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) {
      req.log.warn({ email }, "Login failed - email not found");
      return error(res, "Email atau password salah.", 401);
    }
    if (!user.password) {
      req.log.warn({ email }, "Login failed - Google account");
      return error(
        res,
        "Akun ini terdaftar via Google. Silakan login dengan Google.",
        401,
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.log.warn({ email }, "Login failed - wrong password");
      return error(res, "Email atau password salah.", 401);
    }
    const { password: _pw, ...safeUser } = user;
    const token = generateToken({ id: user.id, email: user.email });
    req.log.info({ userId: user.id, email }, "Login successful");
    return success(res, { user: safeUser, token }, "Login berhasil!");
  } catch (err) {
    req.log.error({ err, email: req.body.email }, "Login failed");
    return error(res, "Gagal login. Coba lagi.", 500);
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);
  try {
    const { email } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user)
      return success(
        res,
        {},
        "Link reset password telah dikirim ke email kamu (jika terdaftar).",
      );

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      await sendResetPasswordEmail(email, resetLink, user.name);
      req.log.info({ userId: user.id, email }, "Password reset email sent");
    } catch (emailErr) {
      req.log.error({ err: emailErr, email }, "Failed to send reset email");
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)
        return error(
          res,
          "Konfigurasi email server belum diatur. Hubungi admin.",
          500,
        );
      return error(res, "Gagal mengirim email. Coba beberapa saat lagi.", 500);
    }

    return success(res, {}, "Link reset password telah dikirim ke email kamu.");
  } catch (err) {
    req.log.error({ err, email: req.body.email }, "Forgot password failed");
    return error(res, "Gagal memproses permintaan. Coba lagi.", 500);
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);
  try {
    const { token, password } = req.body;

    const stored = await prisma.passwordResetToken.findFirst({
      where: { token, used: false },
    });

    if (!stored)
      return error(res, "Token tidak valid atau sudah digunakan.", 400);
    if (new Date() > new Date(stored.expiresAt)) {
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      return error(res, "Token sudah kadaluarsa. Minta link reset baru.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updatePassword(stored.userId, hashedPassword);

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });

    req.log.info({ userId: stored.userId }, "Password reset completed");
    return success(res, {}, "Password berhasil diubah. Silakan login.");
  } catch (err) {
    req.log.error({ err }, "Reset password failed");
    return error(res, "Gagal reset password. Coba lagi.", 500);
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);
  try {
    const { name } = req.body;
    const updatedUser = await UserModel.updateName(req.user.id, name.trim());
    req.log.info({ userId: req.user.id, name: name.trim() }, "Profile updated");
    return success(res, { user: updatedUser }, "Nama berhasil diperbarui.");
  } catch (err) {
    req.log.error({ err, userId: req.user.id }, "Update profile failed");
    return error(res, "Gagal memperbarui nama. Coba lagi.", 500);
  }
};

// Change Password
const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findByEmail(req.user.email);
    if (!user.password)
      return error(
        res,
        "Akun Google tidak bisa mengubah password di sini.",
        400,
      );
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return error(res, "Password saat ini salah.", 401);
    const hashed = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(req.user.id, hashed);
    req.log.info({ userId: req.user.id }, "Password changed");
    return success(res, {}, "Password berhasil diubah.");
  } catch (err) {
    req.log.error({ err, userId: req.user.id }, "Change password failed");
    return error(res, "Gagal mengubah password. Coba lagi.", 500);
  }
};

// Get Me
const getMe = async (req, res) => {
  return success(res, { user: req.user }, "Data user berhasil diambil.");
};

// Exports
module.exports = {
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
};
