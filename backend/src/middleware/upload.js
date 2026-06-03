const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || "5");
const MIN_SIZE_KB = parseInt(process.env.MIN_FILE_SIZE_KB || "200");

// Pastikan folder uploads ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP."),
      false,
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
