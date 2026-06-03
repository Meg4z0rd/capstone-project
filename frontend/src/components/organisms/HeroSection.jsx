import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ScanFace, MessageCircle, Shield, Zap } from 'lucide-react';
import Button from '../atoms/Button';

const HeroSection = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <section id="home" className="relative w-full bg-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.015] rounded-full blur-3xl" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, #378ADD 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div
        className="relative max-w-4xl mx-auto py-24 md:py-32 px-6 flex flex-col items-center text-center gap-8 transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10">
          <Sparkles size={13} className="text-primary" />
          <span className="text-xs font-medium text-primary tracking-wide">Analisis Kulit Berbasis AI</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-semibold text-neutral-900 leading-tight tracking-tight">
          Kenali Kulitmu,{' '}
          <br className="hidden md:block" />
          <span className="relative inline-block">
            <span className="text-primary">Rawat dengan Tepat</span>
            <span className="absolute -bottom-1.5 left-0 right-0 h-1 bg-primary/20 rounded-full" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-neutral-400 max-w-xl leading-relaxed">
          Upload foto wajahmu atau chat langsung dengan AI untuk mendapatkan{' '}
          <span className="text-neutral-600 font-medium">diagnosis kulit yang akurat</span> dan{' '}
          <span className="text-neutral-600 font-medium">rekomendasi skincare personal</span>.
        </p>

        {/* Feature pills */}
        <div className="flex gap-2 flex-wrap justify-center">
          {[
            { icon: Sparkles, label: 'Berbasis AI', color: 'bg-purple-50 text-purple-600 border-purple-200' },
            { icon: Zap, label: 'Gratis', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
            { icon: MessageCircle, label: 'Chat Real-time', color: 'bg-blue-50 text-blue-600 border-blue-200' },
          ].map((pill) => (
            <span key={pill.label} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border ${pill.color}`}>
              <pill.icon size={12} />
              {pill.label}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3 mt-2 flex-wrap justify-center">
          <Link to="/chat">
            <Button size="lg">
              <span className="flex items-center gap-2">
                <MessageCircle size={18} />
                Konsultasi Sekarang
                <ArrowRight size={16} className="ml-0.5" />
              </span>
            </Button>
          </Link>
          <Link to="/analysis">
            <Button variant="outline" size="lg">
              <span className="flex items-center gap-2">
                <ScanFace size={18} />
                Analisis Foto
              </span>
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-neutral-100">
          {[
            { icon: Shield, text: 'Privasi Terjaga' },
            { icon: Zap, text: 'Hasil Instan' },
            { icon: ScanFace, text: 'Deep Learning' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5 text-neutral-400">
              <item.icon size={13} className="text-primary/60" />
              <span className="text-xs">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </section>
  );
};

export default HeroSection;
