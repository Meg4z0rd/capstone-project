import { Link } from 'react-router-dom';
import SectionLabel from '../atoms/SectionLabel';

const CTASection = () => {
  return (
    <section className="w-full bg-primary py-20 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
        <SectionLabel className="text-primary-light">Mulai Sekarang</SectionLabel>
        <h2 className="text-3xl font-medium text-white leading-snug">Siap mengenal kulitmu lebih dalam?</h2>

        <p className="text-primary-light text-base max-w-md leading-relaxed">
          Chat langsung dengan AI untuk konsultasi kulit, atau upload foto untuk analisis visual yang lebih akurat.
        </p>

        <div className="flex gap-3 mt-2 flex-wrap justify-center">
          <Link to="/chat">
            <button className="bg-white text-primary font-medium px-8 py-3 rounded-pill hover:bg-primary-light transition-colors duration-200">
              Mulai Konsultasi
            </button>
          </Link>
          <Link to="/analysis">
            <button className="bg-transparent text-white font-medium px-8 py-3 rounded-pill border border-white/40 hover:bg-white/10 transition-colors duration-200">
              Analisis Foto
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
