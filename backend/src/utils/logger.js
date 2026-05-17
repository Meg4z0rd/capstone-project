const pino = require("pino");

const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "currentPassword",
      "newPassword",
      "token",
    ],
    censor: "***REDACTED***",
  },
  transport: isDev
    ? {
        // Development: pretty print di terminal
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : {
        // Production: tulis ke file, rotasi tiap 10MB
        target: "pino-roll",
        options: {
          file: "./logs/app",
          frequency: "daily",
          size: "10m",
          mkdir: true,
        },
      },
});

module.exports = logger;
