const prisma = require("../config/prisma");
const logger = require("../utils/logger");

// Batas kuota per fitur (per 5 jam)
const DAILY_LIMITS = {
  analysis: parseInt(process.env.DAILY_ANALYSIS_LIMIT || "5"),
  chat: parseInt(process.env.DAILY_CHAT_LIMIT || "10"),
};

const WINDOW_SIZE_MS = 5 * 60 * 60 * 1000; // 5 Jam dalam milisekon

/**
 * Mendapatkan awal dari window 5 jam saat ini
 */
const getCurrentQuotaWindow = () => {
  const now = Date.now();
  const windowStartTimestamp = Math.floor(now / WINDOW_SIZE_MS) * WINDOW_SIZE_MS;
  return new Date(windowStartTimestamp);
};

/**
 * Mengecek dan menambah kuota penggunaan user untuk window 5 jam saat ini.
 * @param {number} userId
 * @param {string} feature - "analysis" atau "chat"
 * @returns {{ allowed: boolean, used: number, limit: number, remaining: number }}
 */
const checkAndIncrementQuota = async (userId, feature) => {
  const currentWindow = getCurrentQuotaWindow();
  const limit = DAILY_LIMITS[feature];

  if (!limit) {
    logger.warn({ feature }, "Unknown feature for quota check");
    return { allowed: true, used: 0, limit: 0, remaining: 0 };
  }

  // Upsert: buat record jika belum ada di window 5 jam ini, atau ambil yang sudah ada
  const quota = await prisma.usageQuota.upsert({
    where: {
      userId_feature_quotaDate: {
        userId,
        feature,
        quotaDate: currentWindow,
      },
    },
    create: {
      userId,
      feature,
      quotaDate: currentWindow,
      usageCount: 0,
    },
    update: {},
  });

  const used = quota.usageCount;
  const remaining = Math.max(0, limit - used);

  if (used >= limit) {
    return { allowed: false, used, limit, remaining: 0 };
  }

  // Increment penggunaan
  await prisma.usageQuota.update({
    where: { id: quota.id },
    data: { usageCount: { increment: 1 } },
  });

  return { allowed: true, used: used + 1, limit, remaining: remaining - 1 };
};

/**
 * Mendapatkan info kuota user untuk window 5 jam saat ini tanpa menambah counter
 * @param {number} userId
 * @param {string} feature - "analysis" atau "chat"
 * @returns {{ used: number, limit: number, remaining: number }}
 */
const getQuotaInfo = async (userId, feature) => {
  const currentWindow = getCurrentQuotaWindow();
  const limit = DAILY_LIMITS[feature];

  const quota = await prisma.usageQuota.findUnique({
    where: {
      userId_feature_quotaDate: {
        userId,
        feature,
        quotaDate: currentWindow,
      },
    },
  });

  const used = quota?.usageCount || 0;
  return { used, limit, remaining: Math.max(0, limit - used) };
};

/**
 * Express middleware factory untuk mengecek kuota sebelum request diproses
 * @param {string} feature - "analysis" atau "chat"
 */
const requireQuota = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return next(); // Jika user belum login, lewati pengecekan kuota
      }

      const result = await checkAndIncrementQuota(req.user.id, feature);

      if (!result.allowed) {
        return res.status(429).json({
          success: false,
          message: `Kuota ${feature === "analysis" ? "analisis foto" : "konsultasi chat"} kamu sudah habis (${result.limit}x per 5 jam). Kuota kamu akan otomatis di-reset setiap 5 jam sekali!`,
          quota: {
            used: result.used,
            limit: result.limit,
            remaining: 0,
          },
        });
      }

      // Lampirkan info kuota ke request agar bisa digunakan controller
      req.quota = result;
      next();
    } catch (err) {
      logger.error({ err, feature }, "Failed to check usage quota");
      next(); // Jangan blokir request jika ada error di sistem kuota
    }
  };
};

module.exports = { checkAndIncrementQuota, getQuotaInfo, requireQuota, DAILY_LIMITS };
