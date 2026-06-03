import { Link } from 'react-router-dom';

const AuthShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(circle, #378ADD 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <header className="relative w-full bg-white/80 backdrop-blur-sm border-b border-neutral-200/60 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="text-xl font-semibold text-neutral-900 no-underline">
            Lumi<span className="text-primary">Skin</span>
          </Link>
        </div>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-6 py-16">
        {children}
      </main>
    </div>
  );
};

export default AuthShell;
