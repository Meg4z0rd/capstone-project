const express = require("express");
const router = express.Router();
const multer = require("multer");
const { predictSkin, renderTestForm } = require("../controllers/predictSkinController");

// Batasi file size upload maksimal 5MB
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Middleware untuk memblokir route ini di Production
router.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ success: false, message: "Route tidak ditemukan." });
  }
  next();
});

// GET /api/predict-skin/test - Membuka Halaman Uji Coba Test Form
router.get("/test", renderTestForm);

// POST /api/predict-skin - Memproses upload gambar biner (multipart/form-data)
router.post("/", upload.single("image"), predictSkin);

module.exports = router;
