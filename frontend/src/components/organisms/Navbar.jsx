import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ScanFace, MessageCircle, UserCircle } from 'lucide-react';
import { useState } from 'react';
import Button from '../atoms/Button';
import UserAvatar from '../atoms/UserAvatar';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAnalysis = location.pathname === '/analysis';
  const isChat = location.pathname === '/chat';

  const navLinks = [
    { label: 'Beranda', sectionId: 'home' },
    { label: 'Fitur', sectionId: 'features' },
    { label: 'Cara Kerja', sectionId: 'how-it-works' },
  ];

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // Jika sedang di halaman lain, navigasi ke landing page dulu lalu scroll
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="w-full bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-medium text-neutral-900 no-underline">
          Lumi<span className="text-primary">Skin</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => scrollToSection(link.sectionId)}
                className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {isLoggedIn && !isChat && (
            <Link to="/chat">
              <Button size="sm" variant="ghost">
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={14} />
                  Konsultasi
                </span>
              </Button>
            </Link>
          )}
          {isLoggedIn && !isAnalysis && (
            <Link to="/analysis">
              <Button size="sm" variant="outline">
                <span className="flex items-center gap-1.5">
                  <ScanFace size={14} />
                  Analisis Foto
                </span>
              </Button>
            </Link>
          )}

          {isLoggedIn ? (
            <div className="relative">
              {/* Trigger — foto Google atau inisial */}
              <button onClick={() => setDropdownOpen((v) => !v)} className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-pill border border-neutral-200 hover:border-primary transition-all duration-200 cursor-pointer bg-white">
                <UserAvatar user={user} size="sm" />
                <span className="text-sm font-medium text-neutral-900 max-w-[110px] truncate">{user?.name?.split(' ')[0] ?? user?.email ?? 'Akun'}</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />

                  <div className="absolute right-0 mt-2 w-60 bg-white border border-neutral-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                    {/* Header dropdown — foto besar + nama + email */}
                    <div className="px-4 py-4 border-b border-neutral-100 flex items-center gap-3">
                      <UserAvatar user={user} size="md" />
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name ?? 'Pengguna'}</p>
                        <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                        {/* Badge login via Google */}
                        {user?.avatar && (
                          <span className="inline-flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                            <svg width="9" height="9" viewBox="0 0 48 48">
                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            Masuk via Google
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors no-underline">
                        <UserCircle size={15} className="text-primary" />
                        Lihat Profil
                      </Link>
                      <Link to="/chat" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors no-underline">
                        <MessageCircle size={15} className="text-primary" />
                        Konsultasi AI
                      </Link>
                      <Link to="/analysis" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors no-underline">
                        <ScanFace size={15} className="text-primary" />
                        Analisis Foto
                      </Link>
                    </div>

                    <div className="border-t border-neutral-100 py-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                        <LogOut size={15} />
                        Keluar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
