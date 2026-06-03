import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyzeSkin, getAnalysisStatus, getAnalysisQuota } from '../services/api';
import Navbar from '../components/organisms/Navbar';
import SectionLabel from '../components/atoms/SectionLabel';
import AnalysisSteps from '../components/organisms/AnalysisSteps';
import ResultCard from '../components/molecules/ResultCard';

const MAX_FILE_MB = 5;
const MIN_FILE_KB = 200;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

const fileToBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const AnalysisPage = () => {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState('');
  const [showFullResult, setShowFullResult] = useState(false);

  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [queueMessage, setQueueMessage] = useState('');
  const [quota, setQuota] = useState(null); // { used, limit, remaining }

  /* ── Ambil info kuota saat halaman dimuat ── */
  useEffect(() => {
    if (token) {
      getAnalysisQuota(token).then(setQuota).catch(() => {});
    }
  }, [token]);

  const loadImage = useCallback(async (file) => {
    setImageError('');
    if (!ACCEPTED.includes(file.type)) {
      setImageError('Format file harus JPG, PNG, atau WebP.');
      return;
    }
    if (file.size < MIN_FILE_KB * 1024) {
      setImageError(`Ukuran file minimal ${MIN_FILE_KB}KB agar hasil analisis akurat.`);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setImageError(`Ukuran file maksimal ${MAX_FILE_MB}MB.`);
      return;
    }
    const base64 = await fileToBase64(file);
    setImage({ file, preview: URL.createObjectURL(file), base64 });
    setStep((s) => Math.max(s, 2));
  }, []);

  const removeImage = () => {
    setImage(null);
    setResult(null);
    setStep(1);
  };
  const toggleConcern = (id) => setConcerns((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const handleAnalyze = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!image) return;
    setLoading(true);
    setApiError('');
    setResult(null);
    setQueueMessage('Mengirim foto ke antrean server...');

    try {
      // 1. Kirim request analisis (masuk antrean)
      const initData = await analyzeSkin({
        image: image.base64,
        skinType: skinType || undefined,
        concerns,
        additionalNotes: prompt.trim(),
      }, token);

      const jobId = initData.data?.jobId;
      if (!jobId) {
        throw new Error('Gagal mendapatkan nomor antrean dari server.');
      }

      // 2. Mulai Polling untuk cek status pekerjaan asinkron
      const pollInterval = setInterval(async () => {
        try {
          const statusData = await getAnalysisStatus(jobId, token);
          const { status, result: analysisResult, queuePosition, message } = statusData.data;

          if (status === 'completed') {
            clearInterval(pollInterval);
            setResult(analysisResult);
            setStep(3);
            setLoading(false);
            setQueueMessage('');
          } else if (status === 'failed') {
            clearInterval(pollInterval);
            setApiError(statusData.message || 'Analisis gagal diproses.');
            setLoading(false);
            setQueueMessage('');
          } else {
            // Update pesan antrean (misal: "Menunggu antrean posisi ke-1...")
            setQueueMessage(message || 'Sedang memproses...');
          }
        } catch (pollErr) {
          clearInterval(pollInterval);
          setApiError(pollErr.response?.data?.message ?? 'Gagal memantau antrean.');
          setLoading(false);
          setQueueMessage('');
        }
      }, 2000); // Poll setiap 2 detik

    } catch (err) {
      // Tangkap error kuota habis (HTTP 429)
      if (err.response?.status === 429) {
        const quotaData = err.response.data?.quota;
        if (quotaData) setQuota(quotaData);
        setApiError(err.response.data?.message || 'Kuota analisis harian kamu sudah habis.');
      } else {
        setApiError(err.response?.data?.message ?? 'Analisis gagal. Hubungi backend developer.');
      }
      setLoading(false);
      setQueueMessage('');
    }
  };

  const handleReset = () => {
    setImage(null);
    setSkinType('');
    setConcerns([]);
    setPrompt('');
    setResult(null);
    setApiError('');
    setStep(1);
    setShowFullResult(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-6">
        {/* Header Title Section */}
        <div className="flex flex-col">
          <SectionLabel>Analisis Kulit</SectionLabel>
          <h1 className="text-2xl font-medium text-neutral-900">Kenali Kondisi Kulitmu</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Upload foto wajah dan lengkapi detail untuk hasil yang lebih akurat.
            {quota ? (
              <span className={`ml-2 font-semibold ${quota.remaining <= 1 ? 'text-red-500' : 'text-primary'}`}>
                (Sisa kuota: {quota.remaining}/{quota.limit} hari ini)
              </span>
            ) : null}
          </p>
        </div>

        {/* Guest Guard Lock Banner */}
        {!isLoggedIn && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Lock size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 flex-1">
              Kamu perlu{' '}
              <Link to="/login" className="font-medium underline">
                masuk
              </Link>{' '}
              or{' '}
              <Link to="/register" className="font-medium underline">
                daftar
              </Link>{' '}
              untuk memulai analisis.
            </p>
          </div>
        )}

        {/* Core Component Orchestration */}
        {!result ? (
          <AnalysisSteps
            step={step}
            setStep={setStep}
            image={image}
            dragOver={dragOver}
            setDragOver={setDragOver}
            imageError={imageError}
            loadImage={loadImage}
            removeImage={removeImage}
            skinType={skinType}
            setSkinType={setSkinType}
            concerns={concerns}
            toggleConcern={toggleConcern}
            prompt={prompt}
            setPrompt={setPrompt}
            loading={loading}
            apiError={apiError}
            handleAnalyze={handleAnalyze}
            MAX_FILE_MB={MAX_FILE_MB}
            ACCEPTED={ACCEPTED}
            queueMessage={queueMessage}
          />
        ) : (
          <ResultCard result={result} onReset={handleReset} showFull={showFullResult} setShowFull={setShowFullResult} />
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
