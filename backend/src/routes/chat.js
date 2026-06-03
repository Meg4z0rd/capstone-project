const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { chat } = require("../controllers/chatController");
const { requireQuota, getQuotaInfo } = require("../middleware/usageQuota");

// GET /chat/quota (cek sisa kuota chat hari ini)
router.get("/quota", authenticate, async (req, res) => {
  const info = await getQuotaInfo(req.user.id, "chat");
  res.json({ success: true, data: info });
});

// POST /chat (wajib login + cek kuota harian)
router.post("/", authenticate, requireQuota("chat"), chat);

module.exports = router;
