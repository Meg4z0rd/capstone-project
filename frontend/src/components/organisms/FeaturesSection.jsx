import { ScanFace, Zap, Sparkles } from 'lucide-react';
import SectionLabel from '../atoms/SectionLabel';
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
  return (
    <section id="features" className="w-full bg-neutral-50 py-20 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center flex flex-col items-center gap-2">
          <SectionLabel>Fitur Utama</SectionLabel>
          <h2 className="text-3xl font-medium text-neutral-900">Semua yang kamu butuhkan</h2>
          <p className="text-neutral-400 max-w-md">LumiSkin dirancang untuk memberikan analisis kulit yang akurat, cepat, dan personal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {features.map((feature) => (
            <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
