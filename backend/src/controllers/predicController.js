const AnalysisModel = require("../models/Analysis");
const { success, error } = require("../utils/response");

const analyze = async (req, res) => {
  try {
    const {
      skinType,
      concerns,
      additionalNotes,
      image: base64Image,
    } = req.body;

    // Pastikan ada gambar
    if (!req.file && !base64Image) {
      return error(res, "Foto wajah wajib dikirimkan.", 400);
    }

    let parsedConcerns = [];
    if (Array.isArray(concerns)) {
      parsedConcerns = concerns;
    } else if (typeof concerns === "string") {
      try {
        parsedConcerns = JSON.parse(concerns);
      } catch {
        parsedConcerns = [];
      }
    }

    // Panggil model ML
    const mlModelUrl = process.env.ML_MODEL_URL;
    if (!mlModelUrl) {
      return error(res, "ML_MODEL_URL belum dikonfigurasi di .env", 500);
    }

    // Kirim ke model server (Flask/FastAPI)
    const mlPayload = {
      skinType,
      concerns: parsedConcerns,
      additionalNotes,
      // Kirim base64 atau path file sesuai kebutuhan model
      ...(base64Image ? { image: base64Image } : { imagePath: req.file?.path }),
    };

    let mlResult;
    try {
      const mlResponse = await fetch(`${mlModelUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mlPayload),
      });

      if (!mlResponse.ok) {
        const errBody = await mlResponse.json().catch(() => ({}));
        req.log.error({ errBody, mlModelUrl }, "ML model returned error");
        return error(
          res,
          errBody?.message ?? "Model AI gagal memproses gambar.",
          502,
        );
      }

      mlResult = await mlResponse.json();
    } catch (fetchErr) {
      req.log.error({ err: fetchErr, mlModelUrl }, "ML model unreachable");
      return error(
        res,
        "Tidak dapat menghubungi model AI. Pastikan ML server berjalan.",
        503,
      );
    }

    // Simpan hasil ke database jika user sudah login
    let savedAnalysis = null;
    if (req.user) {
      savedAnalysis = await AnalysisModel.create({
        userId: req.user.id,
        imagePath: req.file?.path ?? null,
        skinType,
        concerns: parsedConcerns,
        additionalNotes,
        result: mlResult,
      });
      req.log.info(
        { userId: req.user.id, analysisId: savedAnalysis.id },
        "Analysis saved",
      );
    }

    req.log.info(
      { analysisId: savedAnalysis?.id ?? null },
      "Analysis completed",
    );
    return success(
      res,
      {
        result: mlResult,
        analysisId: savedAnalysis?.id ?? null,
      },
      "Analisis selesai",
    );
  } catch (err) {
    req.log.error({ err }, "Analysis failed");
    return error(res, "Gagal memproses analisis. Coba lagi.", 500);
  }
};

// GET /analyze/history
const getHistory = async (req, res) => {
  try {
    const history = await AnalysisModel.findByUserId(req.user.id);
    req.log.info(
      { userId: req.user.id, count: history.length },
      "History fetched",
    );
    return success(res, { history }, "Riwayat analisis berhasil diambil.");
  } catch (err) {
    req.log.error({ err, userId: req.user.id }, "Get history failed");
    return error(res, "Gagal mengambil riwayat.", 500);
  }
};

// GET /analyze/history/:id
const getHistoryDetail = async (req, res) => {
  try {
    const analysis = await AnalysisModel.findById(req.params.id, req.user.id);
    if (!analysis) return error(res, "Analisis tidak ditemukan.", 404);
    return success(res, { analysis }, "Detail analisis berhasil diambil.");
  } catch (err) {
    req.log.error(
      { err, analysisId: req.params.id },
      "Get history detail failed",
    );
    return error(res, "Gagal mengambil detail analisis.", 500);
  }
};

module.exports = { analyze, getHistory, getHistoryDetail };
