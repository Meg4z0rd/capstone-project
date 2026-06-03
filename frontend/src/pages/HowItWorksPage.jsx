import { useEffect, useRef, useState } from 'react';
import { Upload, ScanFace, FileText, Sparkles, Brain, BookOpen } from 'lucide-react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import StepCard from '../components/molecules/StepCard';
import AcneCatalog from '../components/molecules/AcneCatalog';
import SkinIngredientsGuide from '../components/molecules/SkinIngredientsGuide';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Foto',
    description: 'Ambil atau unggah foto area kulit yang bermasalah dengan pencahayaan yang optimal.',
  },
  {
    number: '02',
    icon: ScanFace,
    title: 'Analisis Multimodal',
    description: 'AI memproses data visual dan teks keluhanmu untuk mendeteksi kondisi kulit secara otomatis.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Rekomendasi Bahan',
    description: 'Dapatkan laporan analisis serta daftar bahan aktif skincare yang paling cocok untukmu.',
  },
];

const stats = [
  { value: '3', label: 'Jenis Jerawat', suffix: '' },
  { value: '9', label: 'Bahan Aktif', suffix: '+' },
  { value: '3', label: 'Tipe Kulit', suffix: '' },
];

const HowItWorksPage = () => {
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const sectionRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION — Gradient header with animated entrance
        ═══════════════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden bg-white">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl" />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle, #378ADD 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div
            ref={heroRef}
            className="relative max-w-5xl mx-auto py-20 px-6 flex flex-col items-center text-center gap-6 transition-all duration-1000"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10">
              <BookOpen size={13} className="text-primary" />
              <span className="text-xs font-medium text-primary tracking-wide">Panduan Edukasi</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-neutral-900 tracking-tight leading-tight">
              Bagaimana{' '}
              <span className="relative inline-block">
                <span className="text-primary">LumiSkin</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-full" />
              </span>{' '}
              Bekerja?
            </h1>

            <p className="text-neutral-400 max-w-xl text-base md:text-lg leading-relaxed">
              Kami menggabungkan teknologi <span className="text-neutral-600 font-medium">Deep Learning</span> untuk deteksi visual
              dengan analisis data klinis untuk memberikan rekomendasi perawatan kulit yang personal dan akurat.
            </p>

            {/* Stats strip */}
            <div className="flex items-center gap-6 md:gap-10 mt-4">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                    <span className="text-lg">{stat.suffix}</span>
                  </span>
                  <span className="text-xs text-neutral-400 mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        </section>

        {/* ═══════════════════════════════════════════════════════
            STEPS SECTION — 3-step flow with connectors
        ═══════════════════════════════════════════════════════ */}
        <section className="w-full bg-neutral-50 py-20 px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-14">
            {/* Section header */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.06] border border-primary/10">
                <Sparkles size={12} className="text-primary" />
                <span className="text-[11px] font-medium text-primary uppercase tracking-wider">Alur Analisis</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
                Mudah dalam 3 langkah
              </h2>
              <p className="text-neutral-400 max-w-md text-sm">
                Tidak perlu keahlian khusus — cukup foto, dan LumiSkin bekerja untukmu.
              </p>
            </div>

            {/* Step cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
              {steps.map((step, index) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  index={index}
                  totalSteps={steps.length}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            KNOWLEDGE SECTION — Acne catalog + Ingredients guide
        ═══════════════════════════════════════════════════════ */}
        <section ref={sectionRef} className="w-full bg-white py-20 px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-14">
            {/* Section header */}
            <div
              className="flex flex-col items-center text-center gap-2 transition-all duration-700"
              style={{
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.06] border border-primary/10">
                <Brain size={12} className="text-primary" />
                <span className="text-[11px] font-medium text-primary uppercase tracking-wider">Intelligence & Research</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
                Pusat Pengetahuan Dermatologi
              </h2>
              <p className="text-neutral-400 max-w-lg text-sm">
                Pelajari klasifikasi kondisi kulit yang kami gunakan dalam melatih model AI kami, serta bahan aktif yang direkomendasikan.
              </p>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-8">
              <AcneCatalog />
              <SkinIngredientsGuide />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
