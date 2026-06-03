const AnalysisModel = require("../models/Analysis");
const { success, error } = require("../utils/response");
const cache = require("../utils/cache");
const analysisQueue = require("../queues/analysisQueue");

// POST /analyze
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

    // Validasi ukuran minimum file (200 KB)
    const MIN_SIZE_KB = parseInt(process.env.MIN_FILE_SIZE_KB || "200");
    if (req.file && req.file.size < MIN_SIZE_KB * 1024) {
      return error(res, `Ukuran foto minimal ${MIN_SIZE_KB}KB agar hasil analisis akurat.`, 400);
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

    // Tambahkan tugas baru (Job) ke antrean Bull di Redis
    const jobData = {
      userId: req.user ? req.user.id : null,
      skinType,
      concerns: parsedConcerns,
      additionalNotes,
      image: base64Image || null,
      imagePath: req.file ? req.file.path : null,
    };

    const job = await analysisQueue.add(jobData, {
      attempts: 1, // Tidak perlu dicoba ulang otomatis jika ditolak/error
      removeOnComplete: 100, // Simpan 100 job terakhir agar bisa di-poll sebelum dibersihkan
      removeOnFail: 100,   // Simpan 100 job gagal terakhir
    });

    req.log.info({ jobId: job.id, userId: jobData.userId }, "Successfully enqueued skin analysis job");

    return success(
      res,
      {
        jobId: job.id,
        status: "queued",
        message: "Request analisis foto berhasil masuk ke antrean.",
      },
      "Request masuk antrean",
      202
    );
  } catch (err) {
    req.log.error({ err }, "Failed to queue analysis request");
    return error(res, "Gagal memproses analisis. Coba lagi.", 500);
  }
};

// GET /analyze/status/:jobId
const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await analysisQueue.getJob(jobId);

    if (!job) {
      // Jika job sudah tidak ditemukan (sudah terhapus) tetapi data sudah tersimpan di DB
      return error(res, "Antrean tidak ditemukan atau sudah selesai diproses.", 404);
    }

    const state = await job.getState(); // 'waiting', 'active', 'completed', 'failed', 'delayed'

    if (state === "completed") {
      // Dapatkan data hasil dari return worker
      const jobResult = job.returnvalue;
      return success(
        res,
        {
          jobId,
          status: "completed",
          result: jobResult.result,
          analysisId: jobResult.analysisId,
        },
        "Analisis selesai"
      );
    }

    if (state === "failed") {
      // Kirim alasan kegagalan job
      const failedReason = job.failedReason || "Analisis foto gagal diproses.";
      // Hapus job gagal dari redis agar memori bersih
      await job.remove();
      return error(res, failedReason, 422);
    }

    // Hitung posisi antrean jika statusnya 'waiting'
    let queuePosition = 0;
    if (state === "waiting") {
      const waitingJobs = await analysisQueue.getWaiting();
      queuePosition = waitingJobs.findIndex(j => j.id === jobId) + 1;
    }

    return success(
      res,
      {
        jobId,
        status: state, // 'waiting' atau 'active'
        queuePosition: queuePosition > 0 ? queuePosition : 1,
        message: state === "active" 
          ? "Foto sedang diproses oleh model AI..." 
          : `Menunggu giliran antrean. Anda di posisi ke-${queuePosition}.`,
      },
      "Sedang diproses"
    );
  } catch (err) {
    req.log.error({ err, jobId: req.params.jobId }, "Failed to get job status");
    return error(res, "Gagal mendapatkan status antrean.", 500);
  }
};

// GET /analyze/history
const getHistory = async (req, res) => {
  try {
    const cacheKey = `history:${req.user.id}:list`;
    const cachedHistory = await cache.get(cacheKey);

    if (cachedHistory) {
      req.log.info({ userId: req.user.id }, "History retrieved from Cache");
      return success(
        res,
        { history: cachedHistory, _cached: true },
        "Riwayat analisis berhasil diambil (Cache)."
      );
    }

    const history = await AnalysisModel.findByUserId(req.user.id);
    req.log.info(
      { userId: req.user.id, count: history.length },
      "History fetched from DB"
    );

    // Simpan ke cache selama 5 menit
    await cache.set(cacheKey, history, 300);

    return success(res, { history }, "Riwayat analisis berhasil diambil.");
  } catch (err) {
    req.log.error({ err, userId: req.user.id }, "Get history failed");
    return error(res, "Gagal mengambil riwayat.", 500);
  }
};

// GET /analyze/history/:id
const getHistoryDetail = async (req, res) => {
  try {
    const cacheKey = `history:${req.user.id}:detail:${req.params.id}`;
    const cachedDetail = await cache.get(cacheKey);

    if (cachedDetail) {
      req.log.info({ analysisId: req.params.id }, "History detail retrieved from Cache");
      return success(
        res,
        { analysis: cachedDetail, _cached: true },
        "Detail analisis berhasil diambil (Cache)."
      );
    }

    const analysis = await AnalysisModel.findById(req.params.id, req.user.id);
    if (!analysis) return error(res, "Analisis tidak ditemukan.", 404);

    // Simpan ke cache selama 10 menit
    await cache.set(cacheKey, analysis, 600);

    return success(res, { analysis }, "Detail analisis berhasil diambil.");
  } catch (err) {
    req.log.error(
      { err, analysisId: req.params.id },
      "Get history detail failed"
    );
    return error(res, "Gagal mengambil detail analisis.", 500);
  }
};

module.exports = { analyze, getJobStatus, getHistory, getHistoryDetail };
