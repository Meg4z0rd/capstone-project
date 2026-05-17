const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const passport = require("./config/passport");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const analyzeRoutes = require("./routes/analyze");
const chatRoutes = require("./routes/chat");
const prisma = require("./config/prisma");

const app = express();
const PORT = process.env.PORT || 5000;

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info({ signal }, "Shutdown signal received");
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Security headers
app.use(helmet());

// Request logging
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === "/",
    },
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
    customErrorMessage: (req, res, err) => {
      return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
    },
  }),
);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Terlalu banyak percobaan daftar. Coba lagi dalam 1 jam.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Terlalu banyak permintaan reset. Coba lagi dalam 1 jam.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Terlalu banyak permintaan analisis. Coba lagi dalam 1 jam.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Terlalu banyak pesan. Tunggu sebentar.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Session
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      process.env.JWT_SECRET ||
      "lumiskin_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend LumiSkin jalan ", version: "1.0.0" });
});

// Routes + rate limiter per endpoint
app.use("/auth/login", loginLimiter);
app.use("/auth/register", registerLimiter);
app.use("/auth/forgot-password", forgotLimiter);
app.use("/auth", authRoutes);

app.use(
  "/analyze",
  analyzeLimiter,
  express.json({ limit: "20mb" }),
  analyzeRoutes,
);

app.use("/chat", chatLimiter, chatRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route tidak ditemukan." });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error({ err }, "Unhandled error");
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server.",
  });
});

// Start
app.listen(PORT, () => {
  logger.info(
    { port: PORT, env: process.env.NODE_ENV || "development" },
    "LumiSkin Backend started",
  );
});
