import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ScanFace, ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden py-24 px-6">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl" />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div
        ref={ref}
        className="relative max-w-2xl mx-auto flex flex-col items-center text-center gap-8 transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
        }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
          <Sparkles size={13} className="text-white" />
          <span className="text-xs font-medium text-white/90 tracking-wide">Mulai Sekarang</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white leading-snug tracking-tight">
          Siap mengenal kulitmu{' '}
          <span className="relative inline-block">
            lebih dalam?
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/30 rounded-full" />
          </span>
        </h2>

        <p className="text-white/70 text-base max-w-md leading-relaxed">
          Chat langsung dengan AI untuk konsultasi kulit, atau upload foto untuk analisis visual yang lebih akurat.
        </p>

        {/* CTA buttons */}
        <div className="flex gap-3 mt-2 flex-wrap justify-center">
          <Link to="/chat">
            <button className="group bg-white text-primary font-semibold px-8 py-3.5 rounded-pill hover:bg-primary-light transition-all duration-300 flex items-center gap-2 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5">
              <MessageCircle size={18} />
              Mulai Konsultasi
              <ArrowRight size={16} className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <Link to="/analysis">
            <button className="group bg-transparent text-white font-semibold px-8 py-3.5 rounded-pill border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5">
              <ScanFace size={18} />
              Analisis Foto
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
