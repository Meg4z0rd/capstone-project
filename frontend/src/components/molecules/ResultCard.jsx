import React from 'react';
import { Sparkles, AlertCircle, RotateCcw, Download, ChevronUp, ChevronDown } from 'lucide-react';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

const SEVERITY_MAP = {
  ringan: { color: 'green', label: 'Ringan' },
  sedang: { color: 'amber', label: 'Sedang' },
  berat: { color: 'red', label: 'Berat' },
};

const ResultCard = ({ result, onReset, showFull, setShowFull }) => {
  const data = result?.data?.result ?? result?.result ?? result;
  const conditions = data?.conditions ?? [];
  const recommendations = data?.recommendations ?? [];
  const summary = data?.summary ?? '';

  if (!summary && conditions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col items-center gap-4 text-center">
        <AlertCircle size={32} className="text-amber-500" />
        <div>
          <p className="text-sm font-medium text-neutral-900">Format respons tidak dikenali</p>
          <p className="text-xs text-neutral-400 mt-1">Pastikan model mengembalikan data objek yang sesuai.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <span className="flex items-center gap-2">
            <RotateCcw size={14} /> Coba Lagi
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-primary shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-primary px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-medium text-base">Hasil Analisis Kulit</p>
          <p className="text-white/70 text-xs">Dihasilkan oleh LumiSkin AI Model</p>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Summary Block */}
        {summary && <div className="bg-neutral-50 rounded-xl px-4 py-4 text-sm text-neutral-900 leading-relaxed border border-neutral-200">{summary}</div>}

        {/* Conditions Block */}
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
                  {c.severity && <Badge color={SEVERITY_MAP[c.severity?.toLowerCase()]?.color || 'gray'}>{SEVERITY_MAP[c.severity?.toLowerCase()]?.label || c.severity}</Badge>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Block */}
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
              <button onClick={() => setShowFull((v) => !v)} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline w-fit cursor-pointer">
                {showFull ? (
                  <>
                    <ChevronUp size={13} /> Sembunyikan
                  </>
                ) : (
                  <>
                    <ChevronDown size={13} /> Lihat semua rekomendasi
                  </>
                )}
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-100 pt-4">⚠️ Hasil ini bersifat informatif dan bukan pengganti diagnosis dokter kulit.</p>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <span className="flex items-center gap-2">
              <RotateCcw size={14} /> Analisis Ulang
            </span>
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.print()}>
            <span className="flex items-center gap-2">
              <Download size={14} /> Simpan Hasil
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
