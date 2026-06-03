import { useEffect, useRef, useState } from 'react';
import { ScanFace, Zap, Sparkles, Layers } from 'lucide-react';
import FeatureCard from '../molecules/FeatureCard';

const features = [
  {
    icon: ScanFace,
    title: 'Deteksi Akurat',
    description: 'Analisis kondisi kulit menggunakan model deep learning yang dilatih dengan ribuan data medis dermatologi.',
  },
  {
    icon: Zap,
    title: 'Hasil Instan',
    description: 'Dapatkan diagnosis lengkap dalam hitungan detik — cukup upload foto wajahmu.',
  },
  {
    icon: Sparkles,
    title: 'Rekomendasi Personal',
    description: 'Saran perawatan dan produk yang disesuaikan dengan kondisi dan jenis kulitmu.',
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative w-full bg-neutral-50 py-20 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.02] rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto flex flex-col items-center gap-14">
        {/* Section header */}
        <div
          className="text-center flex flex-col items-center gap-3 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.06] border border-primary/10">
            <Layers size={12} className="text-primary" />
            <span className="text-[11px] font-medium text-primary uppercase tracking-wider">Fitur Utama</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">Semua yang kamu butuhkan</h2>
          <p className="text-neutral-400 max-w-md text-sm">LumiSkin dirancang untuk memberikan analisis kulit yang akurat, cepat, dan personal.</p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </section>
  );
};

export default FeaturesSection;
