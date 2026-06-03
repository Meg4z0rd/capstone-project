const express = require("express");
const router = express.Router();
const {
  analyze,
  getJobStatus,
  getHistory,
  getHistoryDetail,
} = require("../controllers/predicController");
const { authenticate, optionalAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { requireQuota, getQuotaInfo } = require("../middleware/usageQuota");

// GET /analyze/quota (cek sisa kuota analisis hari ini)
router.get("/quota", authenticate, async (req, res) => {
  const info = await getQuotaInfo(req.user.id, "analysis");
  res.json({ success: true, data: info });
});

// POST /analyze (wajib login + cek kuota harian)
router.post("/", authenticate, upload.single("image"), requireQuota("analysis"), analyze);

// GET /analyze/status/:jobId (mengecek status antrean)
router.get("/status/:jobId", authenticate, getJobStatus);

// GET /analyze/history (wajib login)
router.get("/history", authenticate, getHistory);

// GET /analyze/history/:id (wajib login)
router.get("/history/:id", authenticate, getHistoryDetail);

module.exports = router;
