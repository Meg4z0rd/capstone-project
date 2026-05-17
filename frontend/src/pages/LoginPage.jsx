import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import Input from '../components/atoms/Input';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Cek error dari Google OAuth redirect
  const urlError = new URLSearchParams(window.location.search).get('error');
  const googleError =
    urlError === 'google_failed' ? 'Login Google dibatalkan. Coba lagi.' :
    urlError === 'token_failed'  ? 'Gagal membuat sesi Google. Coba lagi.' : '';

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
    // Redirect ke backend — Passport akan handle OAuth flow
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="text-xl font-medium text-neutral-900 no-underline">
            Lumi<span className="text-primary">Skin</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col gap-6">

          <div className="flex flex-col gap-1 text-center">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">Selamat Datang</p>
            <h1 className="text-2xl font-medium text-neutral-900">Masuk ke Akunmu</h1>
            <p className="text-sm text-neutral-400">Mulai analisis kulitmu sekarang.</p>
          </div>

          {/* Error banner */}
          {(serverError || googleError) && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {serverError || googleError}
            </div>
          )}

          {/* ── Tombol Google ── */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin text-neutral-400" />
            ) : (
              /* Google logo SVG */
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            <span className="text-sm font-medium text-neutral-900">
              {googleLoading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">atau masuk dengan email</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* ── Form Email/Password ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email" id="email" type="email" placeholder="kamu@email.com"
              value={form.email} onChange={handleChange('email')} error={errors.email} required
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-neutral-900">
                Password<span className="text-primary ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={handleChange('password')}
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none transition-all duration-200
                    focus:ring-2 focus:ring-primary focus:border-primary
                    ${errors.password ? 'border-red-400' : 'border-neutral-200'}`}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex justify-end -mt-2">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Lupa password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white font-medium py-3 rounded-pill hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-sm text-center text-neutral-400">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Daftar Gratis</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
