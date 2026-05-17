const { verifyToken } = require("../utils/jwt");
const { error } = require("../utils/response");
const UserModel = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(
        res,
        "Token tidak ditemukan. Silakan login terlebih dahulu.",
        401,
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return error(res, "User tidak ditemukan.", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return error(res, "Sesi telah berakhir. Silakan login kembali.", 401);
    }
    return error(res, "Token tidak valid.", 401);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.id);
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
};
module.exports = { authenticate, optionalAuth };
