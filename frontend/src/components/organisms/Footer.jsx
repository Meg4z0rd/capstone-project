import { Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-base font-medium text-neutral-900">
          Lumi<span className="text-primary">Skin</span>
        </span>

        <p className="text-sm text-neutral-400">© 2025 LumiSkin. Dibuat untuk DBS Capstone Project.</p>

        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-900 transition-colors duration-200">
          <Code2 size={18} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
