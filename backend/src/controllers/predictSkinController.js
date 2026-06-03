const fetch = require("node-fetch");
const logger = require("../utils/logger");
const { logAiPrediction } = require("../utils/aiLogger");

// 1. Controller untuk memproses file upload multipart/form-data
const predictSkin = async (req, res) => {
  const startTime = Date.now();
  // Ambil userId jika user melampirkan autentikasi (opsional untuk endpoint public ini)
  const userId = req.user ? req.user.id : null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File gambar wajib diunggah dengan key nama 'image'.",
      });
    }

    // Ubah buffer file gambar di RAM langsung menjadi Base64 string
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const mlModelUrl = process.env.ML_MODEL_URL || "http://localhost:8000";

    // Kirim langsung ke FastAPI AI Server
    const mlResponse = await fetch(`${mlModelUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64Image,
        skinType: req.body.skinType || undefined,
        concerns: req.body.concerns ? JSON.parse(req.body.concerns) : [],
        additionalNotes: req.body.additionalNotes || "",
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (!mlResponse.ok) {
      const errBody = await mlResponse.json().catch(() => ({}));
      const errMsg = errBody?.detail ?? "Model AI gagal memproses gambar.";
      logger.error({ errBody }, "FastAPI prediction error inside multipart endpoint");

      await logAiPrediction({
        userId,
        endpoint: "/api/predict-skin",
        status: "FAILED",
        errorMessage: errMsg,
        latencyMs,
      });

      return res.status(502).json({
        success: false,
        message: errMsg,
      });
    }

    const mlResult = await mlResponse.json();

    // Validasi tingkat confidence (minimum 50%)
    const MIN_CONFIDENCE = parseFloat(process.env.MIN_CONFIDENCE || "0.50");
    if (mlResult.confidence != null && mlResult.confidence < MIN_CONFIDENCE) {
      const errMsg = `Ditolak: Confidence ${Math.round(mlResult.confidence * 100)}% di bawah minimal.`;

      await logAiPrediction({
        userId,
        endpoint: "/api/predict-skin",
        status: "FAILED",
        prediction: mlResult.prediction,
        confidence: mlResult.confidence,
        errorMessage: errMsg,
        latencyMs,
      });

      return res.status(422).json({
        success: false,
        message: "Gambar tidak valid atau kurang jelas. Pastikan foto wajah fokus dengan pencahayaan baik.",
        confidence: mlResult.confidence,
      });
    }

    // Catat log sukses ke DB
    await logAiPrediction({
      userId,
      endpoint: "/api/predict-skin",
      status: "SUCCESS",
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      latencyMs,
    });

    return res.status(200).json({
      success: true,
      message: "Prediksi berhasil",
      data: mlResult,
    });
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    logger.error({ err }, "Multipart prediction failed");

    await logAiPrediction({
      userId,
      endpoint: "/api/predict-skin",
      status: "FAILED",
      errorMessage: err.message,
      latencyMs,
    });

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat memproses gambar.",
    });
  }
};

// 2. Controller untuk menyajikan Halaman Test Form HTML
const renderTestForm = (req, res) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LumiSkin ML Prediction Test Form</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-800 flex flex-col justify-between">

  <!-- Header -->
  <header class="bg-white border-b border-slate-200 py-5 px-6 shadow-sm">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">LS</span>
        <div>
          <h1 class="text-lg font-bold text-slate-900 leading-none">LumiSkin Testing tool</h1>
          <span class="text-xs text-slate-400 font-medium">Model AI CNN & Gemini Diagnostic Tool</span>
        </div>
      </div>
      <span class="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold border border-indigo-100">API: /api/predict-skin</span>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto w-full p-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
    
    <!-- Form Upload -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-5">
      <h2 class="text-xl font-bold text-slate-900">Uji Coba Prediksi</h2>
      
      <form id="predictionForm" class="flex flex-col gap-4">
        <!-- File Input Dropzone -->
        <div class="space-y-1">
          <label class="text-sm font-semibold text-slate-700">Foto Wajah</label>
          <div id="dropzone" class="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
            <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span class="text-sm font-medium text-slate-600 text-center"><span class="text-indigo-600 font-bold">Pilih foto</span> atau seret ke sini</span>
            <span class="text-xs text-slate-400">JPG, PNG, atau WebP (Maks. 5MB)</span>
            <input type="file" id="imageInput" name="image" accept="image/*" class="hidden" required>
          </div>
          <div id="previewContainer" class="hidden relative mt-2 rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-black/5">
            <img id="imagePreview" class="w-full h-full object-cover">
            <button type="button" id="removePreview" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md text-red-500 hover:text-red-700 hover:bg-white flex items-center justify-center font-bold">✕</button>
          </div>
        </div>

        <!-- Detail Form Fields -->
        <div class="space-y-1">
          <label class="text-sm font-semibold text-slate-700">Tipe Kulit (Opsional)</label>
          <select name="skinType" class="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 text-sm">
            <option value="">-- Pilih Jenis Kulit --</option>
            <option value="oily">Berminyak (Oily)</option>
            <option value="dry">Kering (Dry)</option>
            <option value="sensitive">Sensitif (Sensitive)</option>
            <option value="combination">Kombinasi (Combination)</option>
            <option value="normal">Normal (Normal)</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-semibold text-slate-700">Kekhawatiran Kulit (Opsional, format JSON Array)</label>
          <input type="text" name="concerns" placeholder='Contoh: ["acne", "redness"]' class="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 text-sm font-mono">
        </div>

        <div class="space-y-1">
          <label class="text-sm font-semibold text-slate-700">Catatan Tambahan (Opsional)</label>
          <textarea name="additionalNotes" placeholder="Keluhan tambahan tentang kondisi kulit Anda..." rows="2" class="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 text-sm resize-none"></textarea>
        </div>

        <button type="submit" id="submitBtn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-200 mt-2 flex items-center justify-center gap-2">
          Mulai Uji Prediksi
        </button>
      </form>
    </div>

    <!-- Panel Hasil JSON -->
    <div class="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col gap-4 relative overflow-hidden">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 class="text-lg font-bold text-indigo-400">Response Console</h2>
        <span id="responseStatus" class="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-medium">Idle</span>
      </div>

      <!-- Loading State -->
      <div id="loadingOverlay" class="hidden absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
        <svg class="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span class="text-sm font-semibold text-slate-300">Menghubungi AI Server & Memproses...</span>
      </div>

      <!-- Result Screen -->
      <div class="flex-1 flex flex-col overflow-auto max-h-[500px]">
        <pre id="jsonResult" class="text-xs font-mono text-emerald-400 bg-slate-950/50 p-4 rounded-xl flex-1 overflow-auto whitespace-pre-wrap">Silakan unggah foto wajah di sebelah kiri lalu klik tombol prediksi untuk memunculkan analisis di konsol ini.</pre>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 font-medium">
    &copy; 2026 LumiSkin Project &middot; Developed for Internal Evaluation
  </footer>

  <script>
    const dropzone = document.getElementById('dropzone');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removePreview = document.getElementById('removePreview');
    const form = document.getElementById('predictionForm');
    const submitBtn = document.getElementById('submitBtn');
    const jsonResult = document.getElementById('jsonResult');
    const responseStatus = document.getElementById('responseStatus');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Trigger File Input Click
    dropzone.addEventListener('click', () => imageInput.click());

    // Drag-over Event
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-indigo-500', 'bg-indigo-50/30');
    });

    // Drag-leave Event
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-indigo-500', 'bg-indigo-50/30');
    });

    // Drop Event
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-indigo-500', 'bg-indigo-50/30');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        imageInput.files = files;
        handleFileSelect(files[0]);
      }
    });

    // File Input Change
    imageInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });

    function handleFileSelect(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        dropzone.classList.add('hidden');
        previewContainer.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }

    // Remove Preview
    removePreview.addEventListener('click', () => {
      imageInput.value = '';
      imagePreview.src = '';
      dropzone.classList.remove('hidden');
      previewContainer.classList.add('hidden');
    });

    // Form Submit Event Handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append('image', imageInput.files[0]);
      
      const skinType = form.elements['skinType'].value;
      if (skinType) formData.append('skinType', skinType);
      
      const concerns = form.elements['concerns'].value;
      if (concerns) formData.append('concerns', concerns);
      
      const additionalNotes = form.elements['additionalNotes'].value;
      if (additionalNotes) formData.append('additionalNotes', additionalNotes);

      // Loading State On
      loadingOverlay.classList.remove('hidden');
      responseStatus.textContent = 'Memproses...';
      responseStatus.className = 'text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-medium';
      jsonResult.textContent = 'Memproses analisis...';
      jsonResult.className = 'text-xs font-mono text-slate-400 bg-slate-950/50 p-4 rounded-xl flex-1 overflow-auto whitespace-pre-wrap';

      try {
        const response = await fetch('/api/predict-skin', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        // Loading State Off
        loadingOverlay.classList.add('hidden');

        if (response.ok) {
          responseStatus.textContent = 'SUCCESS - ' + response.status;
          responseStatus.className = 'text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium';
          jsonResult.className = 'text-xs font-mono text-emerald-400 bg-slate-950/50 p-4 rounded-xl flex-1 overflow-auto whitespace-pre-wrap';
          jsonResult.textContent = JSON.stringify(data, null, 2);
        } else {
          responseStatus.textContent = 'FAILED - ' + response.status;
          responseStatus.className = 'text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-medium';
          jsonResult.className = 'text-xs font-mono text-rose-400 bg-slate-950/50 p-4 rounded-xl flex-1 overflow-auto whitespace-pre-wrap';
          jsonResult.textContent = JSON.stringify(data, null, 2);
        }
      } catch (err) {
        loadingOverlay.classList.add('hidden');
        responseStatus.textContent = 'CONNECTION ERROR';
        responseStatus.className = 'text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-medium';
        jsonResult.className = 'text-xs font-mono text-rose-400 bg-slate-950/50 p-4 rounded-xl flex-1 overflow-auto whitespace-pre-wrap';
        jsonResult.textContent = 'Gagal menghubungi server. Pastikan server backend Node.js Anda aktif.\\nError: ' + err.message;
      }
    });
  </script>
</body>
</html>
  `;
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(htmlContent);
};

module.exports = { predictSkin, renderTestForm };
