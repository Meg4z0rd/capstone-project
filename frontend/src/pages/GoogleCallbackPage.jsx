import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoadingView from '../components/atoms/GoogleLoadingView';
import GoogleErrorCard from '../components/molecules/GoogleErrorCard';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const avatar = searchParams.get('avatar');
  const error = searchParams.get('error');

  let errorMsg = '';
  if (error || !token) {
    errorMsg = error === 'google_failed' ? 'Login dengan Google dibatalkan atau gagal. Coba lagi.' : error === 'token_failed' ? 'Gagal membuat sesi. Coba lagi.' : 'Terjadi kesalahan saat login Google.';
  }

  const hasRun = useRef(false);

  useEffect(() => {
    if (errorMsg) return;

    if (hasRun.current) return;
    hasRun.current = true;

    login({ name, email, avatar: avatar || null }, token);
    navigate('/', { replace: true });
  }, [errorMsg, token, name, email, avatar, login, navigate]);

  if (errorMsg) {
    return <GoogleErrorCard message={errorMsg} onBack={() => navigate('/login')} />;
  }

  return <GoogleLoadingView />;
};

export default GoogleCallbackPage;
