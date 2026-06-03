const Queue = require("bull");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const AnalysisModel = require("../models/Analysis");
const cache = require("../utils/cache");
const logger = require("../utils/logger"); // Menggunakan logger pino yang sudah ada
const { logAiPrediction } = require("../utils/aiLogger");

// Konfigurasi Redis Host dari .env
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379");

// 1. Inisialisasi Queue bernama 'skin-analysis'
const analysisQueue = new Queue("skin-analysis", {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

// 2. Tentukan Worker untuk memproses antrean secara asinkron
analysisQueue.process(1, async (job) => {
  const { userId, skinType, concerns, additionalNotes, image, imagePath } = job.data;
  const mlModelUrl = process.env.ML_MODEL_URL || "http://localhost:8000";

  logger.info({ jobId: job.id, userId }, "Worker started processing skin analysis job");

  const startTime = Date.now();

  try {
    // Siapkan payload untuk dikirim ke FastAPI
    const mlPayload = {
      skinType,
      concerns,
      additionalNotes,
      ...(image ? { image } : { imagePath }),
    };

    // Panggil FastAPI model AI
    const mlResponse = await fetch(`${mlModelUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mlPayload),
    });

    const latencyMs = Date.now() - startTime;

    if (!mlResponse.ok) {
      const errBody = await mlResponse.json().catch(() => ({}));
      const errMsg = errBody?.detail ?? "Model AI gagal memproses gambar.";
      logger.error({ jobId: job.id, errBody }, "FastAPI model returned error during queue processing");

      // Catat log gagal ke DB
      await logAiPrediction({
        userId,
        endpoint: "/analyze",
        status: "FAILED",
        errorMessage: errMsg,
        latencyMs,
      });

      throw new Error(errMsg);
    }

    const mlResult = await mlResponse.json();

    // Validasi tingkat confidence di tingkat Worker
    const MIN_CONFIDENCE = parseFloat(process.env.MIN_CONFIDENCE || "0.50");
    if (mlResult.confidence != null && mlResult.confidence < MIN_CONFIDENCE) {
      const errMsg = "Gambar kurang jelas/tidak valid. Pastikan pencahayaan baik dan wajah fokus.";
      logger.warn({ jobId: job.id, confidence: mlResult.confidence }, "Confidence score too low, rejecting job");

      // Catat log gagal (confidence score rendah) ke DB
      await logAiPrediction({
        userId,
        endpoint: "/analyze",
        status: "FAILED",
        prediction: mlResult.prediction,
        confidence: mlResult.confidence,
        errorMessage: `Ditolak: Confidence ${Math.round(mlResult.confidence * 100)}% di bawah minimal.`,
        latencyMs,
      });

      throw new Error(errMsg);
    }

    // Simpan hasil ke database PostgreSQL
    let savedAnalysis = null;
    if (userId) {
      savedAnalysis = await AnalysisModel.create({
        userId,
        imagePath: imagePath || null,
        skinType,
        concerns,
        additionalNotes,
        result: mlResult,
      });

      // Hapus/invalidasi cache riwayat user
      const cachePrefix = `history:${userId}`;
      await cache.delByPrefix(cachePrefix);
      logger.info({ jobId: job.id, userId }, "User history cache invalidated");
    }

    // Catat log sukses ke DB
    await logAiPrediction({
      userId,
      endpoint: "/analyze",
      status: "SUCCESS",
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      latencyMs,
    });

    logger.info({ jobId: job.id, analysisId: savedAnalysis?.id }, "Worker completed skin analysis job successfully");

    // Return data untuk disimpan di state completed job di Redis
    return {
      result: mlResult,
      analysisId: savedAnalysis?.id ?? null,
    };

  } catch (err) {
    const latencyMs = Date.now() - startTime;
    // Pastikan log kegagalan tak terduga tercatat ke DB
    await logAiPrediction({
      userId,
      endpoint: "/analyze",
      status: "FAILED",
      errorMessage: err.message,
      latencyMs,
    });
    throw err;
  }
});

// Event listener untuk memonitor antrean jika terjadi error
analysisQueue.on("failed", (job, err) => {
  logger.error({ jobId: job.id, err: err.message }, "Job in queue failed");
});

module.exports = analysisQueue;
