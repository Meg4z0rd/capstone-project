import { Code2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="text-lg font-semibold text-neutral-900 no-underline">
              Lumi<span className="text-primary">Skin</span>
            </Link>
            <p className="text-xs text-neutral-400 max-w-[240px] text-center md:text-left leading-relaxed">
              Analisis kulit berbasis AI untuk rekomendasi skincare yang personal dan akurat.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Navigasi</span>
              <Link to="/" className="text-sm text-neutral-400 hover:text-primary transition-colors no-underline">Beranda</Link>
              <Link to="/cara-kerja" className="text-sm text-neutral-400 hover:text-primary transition-colors no-underline">Cara Kerja</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Fitur</span>
              <Link to="/analysis" className="text-sm text-neutral-400 hover:text-primary transition-colors no-underline">Analisis Foto</Link>
              <Link to="/chat" className="text-sm text-neutral-400 hover:text-primary transition-colors no-underline">Chat AI</Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-6" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-400 flex items-center gap-1">
            © {new Date().getFullYear()} LumiSkin · Dibuat dengan <Heart size={10} className="text-red-400 fill-red-400" /> untuk DBS Capstone Project
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-900 transition-colors duration-200 no-underline"
          >
            <Code2 size={14} />
            <span>Source Code</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
