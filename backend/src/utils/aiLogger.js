const prisma = require("../config/prisma");
const logger = require("./logger");

/**
 * Mencatat hasil log aktivitas AI ke database secara asinkron
 * @param {Object} params
 * @param {number|null} params.userId - ID User jika login
 * @param {string} params.endpoint - Nama endpoint ("/analyze" atau "/api/predict-skin")
 * @param {string} params.status - "SUCCESS" atau "FAILED"
 * @param {string|null} params.prediction - Hasil kelas deteksi (Cyst, Papules, Pustules)
 * @param {number|null} params.confidence - Confidence score
 * @param {string|null} params.errorMessage - Pesan error jika gagal
 * @param {number|null} params.latencyMs - Durasi respons AI server dalam ms
 */
const logAiPrediction = async ({
  userId,
  endpoint,
  status,
  prediction = null,
  confidence = null,
  errorMessage = null,
  latencyMs = null,
}) => {
  try {
    const aiLog = await prisma.aiLog.create({
      data: {
        userId,
        endpoint,
        status,
        prediction,
        confidence,
        errorMessage,
        latencyMs,
      },
    });
    logger.info({ logId: aiLog.id, status, endpoint }, "AI performance log recorded successfully to DB");
  } catch (err) {
    logger.error({ err, endpoint }, "Failed to write AI log to database");
  }
};

module.exports = { logAiPrediction };
