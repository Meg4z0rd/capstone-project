import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import PasswordInput from '../components/atoms/PasswordInput';
import GoogleLoginButton from '../components/molecules/GoogleLoginButton';
import AuthShell from '../components/organisms/AuthShell';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const urlError = searchParams.get('error');
  const googleError = urlError === 'google_failed' ? 'Login Google dibatalkan. Coba lagi.' : urlError === 'token_failed' ? 'Gagal membuat sesi Google. Coba lagi.' : '';

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format email tidak valid';
    if (!form.password) errs.password = 'Password wajib diisi';
    else if (form.password.length < 6) errs.password = 'Password minimal 6 karakter';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const data = await loginUser(form.email, form.password);
      login(data.data.user, data.data.token);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col gap-6">
        {/* Headings */}
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">Selamat Datang</p>
          <h1 className="text-2xl font-medium text-neutral-900">Masuk ke Akunmu</h1>
          <p className="text-sm text-neutral-400">Mulai analisis kulitmu sekarang.</p>
        </div>

        {(serverError || googleError) && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{serverError || googleError}</div>}

        <GoogleLoginButton onClick={handleGoogleLogin} loading={googleLoading} />

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-xs text-neutral-400">atau masuk dengan email</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input label="Email" id="email" type="email" placeholder="kamu@email.com" value={form.email} onChange={handleChange('email')} error={errors.email} required />

          <PasswordInput label="Password" id="password" value={form.password} onChange={handleChange('password')} error={errors.password} required />

          <div className="flex justify-end -mt-2">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline no-underline font-medium">
              Lupa password?
            </Link>
          </div>

          <Button type="submit" variant={loading ? 'outline' : 'primary'} size="md" disabled={loading}>
            <span className="flex items-center justify-center gap-2 w-full">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Memproses...' : 'Masuk'}
            </span>
          </Button>
        </form>

        <p className="text-sm text-center text-neutral-400">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline no-underline">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default LoginPage;
