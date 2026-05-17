import { Upload, ScanFace, FileText } from 'lucide-react';
import SectionLabel from '../atoms/SectionLabel';
import StepCard from '../molecules/StepCard';

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
  return (
    <section id="how-it-works" className="w-full bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center flex flex-col items-center gap-2">
          <SectionLabel>Cara Kerja</SectionLabel>
          <h2 className="text-3xl font-medium text-neutral-900">Mudah dalam 3 langkah</h2>
          <p className="text-neutral-400 max-w-md">Tidak perlu keahlian khusus — cukup foto, dan LumiSkin bekerja untukmu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
                <step.icon size={28} className="text-primary" />
              </div>

              <span className="text-xs font-medium text-primary tracking-widest uppercase">Langkah {index + 1}</span>

              <h3 className="text-base font-medium text-neutral-900">{step.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-[220px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
