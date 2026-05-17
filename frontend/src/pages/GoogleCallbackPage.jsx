import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  // Pastikan efek hanya jalan SEKALI — tidak peduli perubahan referensi
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const avatar = searchParams.get('avatar');
    const error = searchParams.get('error');

    if (error || !token) {
      const msg =
        error === 'google_failed' ? 'Login dengan Google dibatalkan atau gagal. Coba lagi.' :
        error === 'token_failed'  ? 'Gagal membuat sesi. Coba lagi.' :
        'Terjadi kesalahan saat login Google.';
      setErrorMsg(msg);
      return;
    }

    login({ name, email, avatar: avatar || null }, token);
    navigate('/', { replace: true });

  // Dependency array kosong = hanya jalan sekali saat mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 max-w-sm w-full flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div>
            <p className="text-base font-medium text-neutral-900">Login Gagal</p>
            <p className="text-sm text-neutral-400 mt-1">{errorMsg}</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-primary text-white font-medium py-2.5 rounded-pill hover:bg-primary-dark transition-colors duration-200 text-sm"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="text-primary animate-spin" />
        <p className="text-sm text-neutral-400">Memproses login Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
