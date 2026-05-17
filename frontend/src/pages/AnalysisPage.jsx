import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, ImagePlus, ChevronRight, Loader2,
  ScanFace, Sparkles, AlertCircle, CheckCircle2,
  RotateCcw, Download, ChevronDown, ChevronUp, Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyzeSkin } from '../services/api';
import Navbar from '../components/organisms/Navbar';

const SKIN_TYPES = [
  { id: 'normal', label: 'Normal', desc: 'Tidak terlalu kering atau berminyak' },
  { id: 'oily', label: 'Berminyak', desc: 'Pori besar, mudah berkilap' },
  { id: 'dry', label: 'Kering', desc: 'Terasa kencang, mudah mengelupas' },
  { id: 'combination', label: 'Kombinasi', desc: 'Berminyak di T-zone, kering di pipi' },
  { id: 'sensitive', label: 'Sensitif', desc: 'Mudah iritasi atau kemerahan' },
];

const CONCERNS = [
  { id: 'acne', label: 'Jerawat' },
  { id: 'dark_spots', label: 'Flek hitam' },
  { id: 'wrinkles', label: 'Kerutan' },
  { id: 'redness', label: 'Kemerahan' },
  { id: 'pores', label: 'Pori besar' },
  { id: 'dullness', label: 'Kusam' },
  { id: 'eyebags', label: 'Mata panda' },
  { id: 'uneven_tone', label: 'Warna tidak merata' },
];

const MAX_FILE_MB = 10;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

const fileToBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const StepBadge = ({ n, active, done }) => (
  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors duration-200
    ${done ? 'bg-primary text-white' : active ? 'bg-primary-light text-primary border-2 border-primary' : 'bg-neutral-200 text-neutral-400'}`}>
    {done ? <CheckCircle2 size={14} /> : n}
  </div>
);

const SectionCard = ({ step, active, done, title, children }) => (
  <div className={`bg-white rounded-2xl border transition-all duration-200 ${active ? 'border-primary shadow-sm' : 'border-neutral-200'}`}>
    <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100">
      <StepBadge n={step} active={active} done={done} />
      <span className="text-sm font-medium text-neutral-900">{title}</span>
      {done && !active && <CheckCircle2 size={14} className="ml-auto text-primary" />}
    </div>
    {(active || done) && <div className="p-6">{children}</div>}
  </div>
);

const AnalysisPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState('');
  const [showFullResult, setShowFullResult] = useState(false);

  const fileRef = useRef();

  const loadImage = useCallback(async (file) => {
    setImageError('');
    if (!ACCEPTED.includes(file.type)) { setImageError('Format file harus JPG, PNG, atau WebP.'); return; }
    if (file.size > MAX_FILE_MB * 1024 * 1024) { setImageError(`Ukuran file maksimal ${MAX_FILE_MB}MB.`); return; }
    const base64 = await fileToBase64(file);
    setImage({ file, preview: URL.createObjectURL(file), base64 });
    setStep((s) => Math.max(s, 2));
  }, []);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files?.[0]; if (file) loadImage(file); };
  const handleFileInput = (e) => { const file = e.target.files?.[0]; if (file) loadImage(file); e.target.value = ''; };
  const removeImage = () => { setImage(null); setResult(null); setStep(1); };
  const toggleConcern = (id) => setConcerns((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const handleAnalyze = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!image) return;
    setLoading(true); setApiError(''); setResult(null);
    try {
      const data = await analyzeSkin({ image: image.base64, skinType, concerns, additionalNotes: prompt.trim() });
      setResult(data);
      setStep(3);
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Analisis gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setImage(null); setSkinType(''); setConcerns([]); setPrompt(''); setResult(null); setApiError(''); setStep(1); setShowFullResult(false); };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">Analisis Kulit</p>
          <h1 className="text-2xl font-medium text-neutral-900">Kenali Kondisi Kulitmu</h1>
          <p className="text-sm text-neutral-400">Upload foto wajah dan lengkapi detail untuk hasil yang lebih akurat.</p>
        </div>

        {!isLoggedIn && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Lock size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 flex-1">
              Kamu perlu <Link to="/login" className="font-medium underline">masuk</Link> atau{' '}
              <Link to="/register" className="font-medium underline">daftar</Link> untuk memulai analisis.
            </p>
          </div>
        )}

        {/* Step 1 */}
        <SectionCard step={1} active={step === 1} done={step > 1} title="Upload Foto Wajah">
          {!image ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl py-14 px-6 cursor-pointer transition-all duration-200
                ${dragOver ? 'border-primary bg-primary-light' : 'border-neutral-200 bg-neutral-50 hover:border-primary hover:bg-primary-light'}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                <ImagePlus size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-900">Seret foto ke sini, atau <span className="text-primary">klik untuk pilih</span></p>
                <p className="text-xs text-neutral-400 mt-1">JPG, PNG, WebP · Maks. {MAX_FILE_MB}MB</p>
              </div>
              <input ref={fileRef} type="file" accept={ACCEPTED.join(',')} className="hidden" onChange={handleFileInput} />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden bg-neutral-100 aspect-square max-h-72">
                <img src={image.preview} alt="Preview" className="object-cover w-full h-full" />
                <button onClick={removeImage} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors">
                  <X size={14} className="text-neutral-600" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <CheckCircle2 size={13} className="text-green-500" />
                <span>{image.file.name} · {(image.file.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <div className="bg-primary-light rounded-xl px-4 py-3 text-xs text-primary-dark leading-relaxed">
                💡 <span className="font-medium">Tips:</span> Pastikan wajah terlihat jelas, pencahayaan merata, dan kamera sejajar wajah untuk hasil terbaik.
              </div>
            </div>
          )}
          {imageError && <div className="flex items-center gap-2 mt-3 text-sm text-red-500"><AlertCircle size={14} /> {imageError}</div>}
        </SectionCard>

        {/* Step 2 */}
        {step >= 2 && (
          <SectionCard step={2} active={step === 2} done={step > 2} title="Detail Kondisi Kulit">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-neutral-900">Jenis Kulit <span className="text-neutral-400 font-normal">(opsional)</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SKIN_TYPES.map((t) => (
                    <button key={t.id} type="button" onClick={() => setSkinType(t.id === skinType ? '' : t.id)}
                      className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer
                        ${skinType === t.id ? 'border-primary bg-primary-light' : 'border-neutral-200 bg-white hover:border-primary/50'}`}>
                      <span className={`text-sm font-medium ${skinType === t.id ? 'text-primary-dark' : 'text-neutral-900'}`}>{t.label}</span>
                      <span className="text-xs text-neutral-400">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-neutral-900">Masalah yang Dirasakan <span className="text-neutral-400 font-normal">(opsional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {CONCERNS.map((c) => (
                    <button key={c.id} type="button" onClick={() => toggleConcern(c.id)}
                      className={`px-3 py-1.5 rounded-pill text-xs font-medium border transition-all duration-150 cursor-pointer
                        ${concerns.includes(c.id) ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-400 border-neutral-200 hover:border-primary hover:text-primary'}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="prompt" className="text-sm font-medium text-neutral-900">Catatan Tambahan <span className="text-neutral-400 font-normal">(opsional)</span></label>
                <textarea id="prompt" rows={3} placeholder="Contoh: kulit sering kemerahan setelah cuci muka..." value={prompt}
                  onChange={(e) => setPrompt(e.target.value)} maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200" />
                <p className="text-xs text-neutral-400 text-right">{prompt.length}/500</p>
              </div>
              <button onClick={() => setStep(3)} disabled={!image}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed w-fit">
                Lanjut ke Analisis <ChevronRight size={14} />
              </button>
            </div>
          </SectionCard>
        )}

        {/* Step 3 */}
        {step >= 3 && !result && (
          <SectionCard step={3} active done={false} title="Mulai Analisis">
            <div className="flex flex-col gap-4">
              <div className="bg-neutral-50 rounded-xl p-4 flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2"><span className="text-neutral-400 w-28">Foto</span><span className="text-neutral-900 font-medium truncate">{image?.file.name}</span></div>
                {skinType && <div className="flex items-center gap-2"><span className="text-neutral-400 w-28">Jenis kulit</span><span className="text-neutral-900 font-medium">{SKIN_TYPES.find(t => t.id === skinType)?.label}</span></div>}
                {concerns.length > 0 && <div className="flex items-start gap-2"><span className="text-neutral-400 w-28 flex-shrink-0">Masalah</span><span className="text-neutral-900 font-medium">{concerns.map(id => CONCERNS.find(c => c.id === id)?.label).join(', ')}</span></div>}
                {prompt && <div className="flex items-start gap-2"><span className="text-neutral-400 w-28 flex-shrink-0">Catatan</span><span className="text-neutral-900">{prompt}</span></div>}
              </div>
              {apiError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  <AlertCircle size={14} className="flex-shrink-0" />{apiError}
                </div>
              )}
              <button onClick={handleAnalyze} disabled={!image || loading}
                className="w-full bg-primary text-white font-medium py-3.5 rounded-pill hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Menganalisis...</> : <><ScanFace size={16} /> Analisis Sekarang</>}
              </button>
              {loading && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                  <p className="text-xs text-neutral-400 text-center">Model AI sedang memproses gambar kulitmu…</p>
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {result && <ResultCard result={result} onReset={handleReset} showFull={showFullResult} setShowFull={setShowFullResult} />}
      </div>
    </div>
  );
};

/// ResultCard — murni data dari model, tanpa fallback dummy 
const SEVERITY_COLOR = { ringan: 'bg-green-100 text-green-700', sedang: 'bg-amber-100 text-amber-700', berat: 'bg-red-100 text-red-600' };

const ResultCard = ({ result, onReset, showFull, setShowFull }) => {
  const data = result?.result ?? result;
  const conditions = data?.conditions ?? [];
  const recommendations = data?.recommendations ?? [];
  const summary = data?.summary ?? '';

  if (!summary && conditions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col items-center gap-4 text-center">
        <AlertCircle size={32} className="text-amber-500" />
        <div>
          <p className="text-sm font-medium text-neutral-900">Format respons tidak dikenali</p>
          <p className="text-xs text-neutral-400 mt-1">Pastikan model mengembalikan field <code className="bg-neutral-100 px-1 rounded">summary</code>, <code className="bg-neutral-100 px-1 rounded">conditions</code>, dan <code className="bg-neutral-100 px-1 rounded">recommendations</code>.</p>
        </div>
        <button onClick={onReset} className="flex items-center gap-2 px-5 py-2.5 rounded-pill border border-neutral-200 text-sm text-neutral-900 hover:border-primary hover:text-primary transition-all duration-200">
          <RotateCcw size={14} /> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-primary shadow-sm overflow-hidden">
      <div className="bg-primary px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Sparkles size={20} className="text-white" /></div>
        <div>
          <p className="text-white font-medium text-base">Hasil Analisis Kulit</p>
          <p className="text-white/70 text-xs">Dihasilkan oleh LumiSkin AI Model</p>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {summary && <div className="bg-neutral-50 rounded-xl px-4 py-4 text-sm text-neutral-900 leading-relaxed border border-neutral-200">{summary}</div>}

        {conditions.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-neutral-900">Kondisi Terdeteksi</p>
            <div className="flex flex-col gap-2">
              {conditions.map((c, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-neutral-900">{c.name}</span>
                    {c.description && <span className="text-xs text-neutral-400">{c.description}</span>}
                    {c.confidence !== undefined && <span className="text-xs text-neutral-400">Kepercayaan: {Math.round(c.confidence * 100)}%</span>}
                  </div>
                  {c.severity && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill flex-shrink-0 ${SEVERITY_COLOR[c.severity] ?? 'bg-neutral-100 text-neutral-600'}`}>{c.severity}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-neutral-900">Rekomendasi Perawatan</p>
            <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${showFull ? '' : 'max-h-40'}`}>
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-primary-light rounded-xl px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">{i + 1}</div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-primary-dark">{r.title ?? r.name ?? r}</span>
                    {r.detail && <span className="text-xs text-neutral-600 leading-relaxed">{r.detail}</span>}
                  </div>
                </div>
              ))}
            </div>
            {recommendations.length > 2 && (
              <button onClick={() => setShowFull((v) => !v)} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline w-fit">
                {showFull ? <><ChevronUp size={13} /> Sembunyikan</> : <><ChevronDown size={13} /> Lihat semua rekomendasi</>}
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-100 pt-4">
          ⚠️ Hasil ini bersifat informatif dan bukan pengganti diagnosis dokter kulit.
        </p>
        <div className="flex gap-3">
          <button onClick={onReset} className="flex items-center gap-2 px-5 py-2.5 rounded-pill border border-neutral-200 text-sm text-neutral-900 hover:border-primary hover:text-primary transition-all duration-200">
            <RotateCcw size={14} /> Analisis Ulang
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 rounded-pill bg-primary text-white text-sm hover:bg-primary-dark transition-colors duration-200">
            <Download size={14} /> Simpan Hasil
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
