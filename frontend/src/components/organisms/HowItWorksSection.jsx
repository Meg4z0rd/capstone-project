import { useEffect, useRef, useState } from 'react';
import { Upload, ScanFace, FileText, Sparkles, Brain } from 'lucide-react';
import SectionLabel from '../atoms/SectionLabel';
import StepCard from '../molecules/StepCard';
import AcneCatalog from '../molecules/AcneCatalog';
import SkinIngredientsGuide from '../molecules/SkinIngredientsGuide';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Foto',
    description: 'Ambil atau upload foto wajahmu dengan pencahayaan yang baik.',
  },
  {
    number: '02',
    icon: ScanFace,
    title: 'AI Menganalisis',
    description: 'Model kami memproses gambar dan mendeteksi kondisi kulitmu secara otomatis.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Terima Hasil',
    description: 'Dapatkan laporan lengkap beserta rekomendasi produk yang tepat untukmu.',
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const eduRef = useRef(null);
  const [eduVisible, setEduVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEduVisible(true); },
      { threshold: 0.1 }
    );
    if (eduRef.current) observer.observe(eduRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative w-full bg-white py-20 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto flex flex-col items-center gap-16">
        {/* Section Heading */}
        <div
          ref={ref}
          className="text-center flex flex-col items-center gap-3 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <SectionLabel icon={Sparkles}>Cara Kerja</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">Mudah dalam 3 langkah</h2>
          <p className="text-neutral-400 max-w-md text-sm">Tidak perlu keahlian khusus — cukup foto, dan LumiSkin bekerja untukmu.</p>
        </div>

        {/* ── BAGIAN A: Step Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full relative">
          {steps.map((step, index) => (
            <StepCard key={step.number} number={step.number} icon={step.icon} title={step.title} description={step.description} index={index} totalSteps={steps.length} />
          ))}
        </div>

        {/* ── BAGIAN B: Edukasi ── */}
        <div
          ref={eduRef}
          className="w-full flex flex-col gap-8 mt-4 transition-all duration-700"
          style={{
            opacity: eduVisible ? 1 : 0,
            transform: eduVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="text-center flex flex-col items-center gap-3">
            <SectionLabel icon={Brain}>Intelligence & Research</SectionLabel>
            <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">Pusat Edukasi Dermatologi</h3>
            <p className="text-sm text-neutral-400 max-w-md">Pelajari dasar ilmiah pengolahan data kami sebelum melakukan analisis mendalam.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 w-full">
            {/* Hasil Ekspor Kerja AI Path */}
            <AcneCatalog />

            {/* Hasil Analisis Kerja Data Science Path */}
            <SkinIngredientsGuide />
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </section>
  );
};

export default HowItWorksSection;
