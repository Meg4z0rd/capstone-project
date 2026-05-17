const express = require("express");
const router = express.Router();
const {
  analyze,
  getHistory,
  getHistoryDetail,
} = require("../controllers/predicController");
const { authenticate, optionalAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

// POST /analyze (optional login — simpan riwayat jika login)
router.post("/", optionalAuth, upload.single("image"), analyze);

// GET /analyze/history (wajib login)
router.get("/history", authenticate, getHistory);

// GET /analyze/history/:id (wajib login)
router.get("/history/:id", authenticate, getHistoryDetail);

module.exports = router;
