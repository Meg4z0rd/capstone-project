import React, { useRef } from 'react';
import { ImagePlus, X, ChevronRight, ScanFace, Loader2 } from 'lucide-react';
import Button from '../atoms/Button';
import SkinTypeButton from '../atoms/SkinTypeButton';
import ConcernTag from '../atoms/ConcernTag';
import ConfirmationRow from '../atoms/ConfirmationRow';
import { SKIN_TYPES, CONCERNS, SectionCard } from './AnalysisSteps.utils';

const AnalysisSteps = ({ step, setStep, image, dragOver, setDragOver, imageError, loadImage, removeImage, skinType, setSkinType, concerns, toggleConcern, prompt, setPrompt, loading, apiError, handleAnalyze, MAX_FILE_MB, ACCEPTED, queueMessage }) => {
  const fileRef = useRef();

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1: Upload Foto Wajah */}
      <SectionCard step={1} active={step === 1} done={step > 1} title="Upload Foto Wajah">
        {!image ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) loadImage(f);
            }}
            onClick={() => fileRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl py-14 px-6 cursor-pointer transition-all duration-200
              ${dragOver ? 'border-primary bg-primary-light' : 'border-neutral-200 bg-neutral-50 hover:border-primary hover:bg-primary-light'}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
              <ImagePlus size={24} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-900">
                Seret foto ke sini, atau <span className="text-primary">klik untuk pilih</span>
              </p>
              <p className="text-xs text-neutral-400 mt-1">JPG, PNG, WebP · Maks. {MAX_FILE_MB}MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED.join(',')}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) loadImage(f);
                e.target.value = '';
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-neutral-100 aspect-square max-h-72">
              <img src={image.preview} alt="Preview" className="object-cover w-full h-full" />
              <button onClick={removeImage} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 text-neutral-600 cursor-pointer">
                <X size={14} />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              ✓ {image.file.name} · {(image.file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        )}
        {imageError && <p className="text-sm text-red-500 mt-2">⚠️ {imageError}</p>}
      </SectionCard>

      {/* Step 2: Detail Kondisi Kulit */}
      {step >= 2 && (
        <SectionCard step={2} active={step === 2} done={step > 2} title="Detail Kondisi Kulit">
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-900">
                Jenis Kulit <span className="text-neutral-400 font-normal">(opsional)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SKIN_TYPES.map((t) => (
                  <SkinTypeButton key={t.id} title={t.label} description={t.desc} isSelected={skinType === t.id} onClick={() => setSkinType(t.id === skinType ? '' : t.id)} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-900">
                Masalah yang Dirasakan <span className="text-neutral-400 font-normal">(opsional)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {CONCERNS.map((c) => (
                  <ConcernTag key={c.id} label={c.label} isSelected={concerns.includes(c.id)} onClick={() => toggleConcern(c.id)} />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prompt" className="text-sm font-medium text-neutral-900">
                Catatan Tambahan <span className="text-neutral-400 font-normal">(opsional)</span>
              </label>
              <textarea
                id="prompt"
                rows={3}
                placeholder="Contoh: kulit terasa kering ketarik setelah cuci muka..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm bg-white outline-none resize-none focus:ring-2 focus:ring-primary transition-all duration-200"
              />
              <p className="text-xs text-neutral-400 text-right">{prompt.length}/500</p>
            </div>

            <Button variant="outline" size="sm" onClick={() => setStep(3)} disabled={!image}>
              <span className="flex items-center gap-1">
                Lanjut ke Konfirmasi <ChevronRight size={14} />
              </span>
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Step 3: Konfirmasi Akhir */}
      {step >= 3 && !loading && (
        <SectionCard step={3} active done={false} title="Konfirmasi & Analisis">
          <div className="flex flex-col gap-4">
            <div className="bg-neutral-50 rounded-xl p-4 flex flex-col gap-1.5">
              <ConfirmationRow label="Foto" value={image?.file.name} isTruncate />
              {skinType && <ConfirmationRow label="Jenis kulit" value={SKIN_TYPES.find((t) => t.id === skinType)?.label} />}
              {concerns.length > 0 && <ConfirmationRow label="Masalah" value={concerns.map((id) => CONCERNS.find((c) => c.id === id)?.label).join(', ')} />}
              {prompt && <ConfirmationRow label="Catatan" value={prompt} />}
            </div>

            {apiError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">⚠️ {apiError}</p>}

            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="w-full py-3.5 rounded-pill font-medium text-base bg-primary text-white hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ScanFace size={16} /> Analisis Sekarang
            </button>
          </div>
        </SectionCard>
      )}

      {/* Global AI Processing Loading View */}
      {loading && (
        <div className="bg-white rounded-2xl border p-8 flex flex-col items-center gap-3 shadow-sm border-primary/20">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm font-medium text-neutral-900">{queueMessage || 'Model AI sedang memproses gambar kulitmu…'}</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisSteps;
