import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import Input from '../components/atoms/Input';

const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-primary', 'bg-green-500'];

const calcStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const AuthShell = ({ children }) => (
  <div className="min-h-screen bg-neutral-50 flex flex-col">
    <header className="w-full bg-white border-b border-neutral-200 px-6 py-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-xl font-medium text-neutral-900 no-underline">
          Lumi<span className="text-primary">Skin</span>
        </Link>
      </div>
    </header>
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      {children}
    </main>
  </div>
);

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const strength = calcStrength(form.password);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi';
    if (!form.email) errs.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format email tidak valid';
    if (!form.password) errs.password = 'Password wajib diisi';
    else if (form.password.length < 6) errs.password = 'Password minimal 6 karakter';
    if (!form.confirm) errs.confirm = 'Konfirmasi password wajib diisi';
    else if (form.confirm !== form.password) errs.confirm = 'Password tidak cocok';
    if (!agreed) errs.agreed = 'Kamu harus menyetujui syarat & ketentuan';
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
      const data = await registerUser(form.name, form.email, form.password);
      login(data.user ?? { name: form.name, email: form.email });
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col gap-6">
        {/* Heading */}
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">Bergabung Sekarang</p>
          <h1 className="text-2xl font-medium text-neutral-900">Buat Akun Gratis</h1>
          <p className="text-sm text-neutral-400">Mulai analisis kulitmu dalam hitungan detik.</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Nama Lengkap"
            id="name"
            placeholder="Nama kamu"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
          />
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="kamu@email.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />

          {/* Password with strength bar */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-neutral-900">
              Password<span className="text-primary ml-0.5">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={handleChange('password')}
                className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none transition-all duration-200
                  focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.password ? 'border-red-400' : 'border-neutral-200'}`}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="flex flex-col gap-1 mt-0.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-neutral-200'}`} />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength <= 1 ? 'text-red-400' : strength === 2 ? 'text-amber-500' : strength === 3 ? 'text-primary' : 'text-green-500'}`}>
                  {strengthLabel[strength]}
                </p>
              </div>
            )}
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm font-medium text-neutral-900">
              Konfirmasi Password<span className="text-primary ml-0.5">*</span>
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Ulangi password"
                value={form.confirm}
                onChange={handleChange('confirm')}
                className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none transition-all duration-200
                  focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.confirm ? 'border-red-400' : 'border-neutral-200'}`}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {/* Match indicator */}
              {form.confirm && form.confirm === form.password && (
                <CheckCircle2 size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
            {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
          </div>

          {/* Terms */}
          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (errors.agreed) setErrors((p) => ({ ...p, agreed: '' }));
                }}
                className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-neutral-400 leading-relaxed">
                Saya menyetujui{' '}
                <Link to="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link>
                {' '}dan{' '}
                <Link to="/privacy" className="text-primary hover:underline">Kebijakan Privasi</Link>
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500 ml-6">{errors.agreed}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-medium py-3 rounded-pill hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Mendaftar...' : 'Buat Akun'}
          </button>
        </form>

        {/* Login link */}
        <p className="text-sm text-center text-neutral-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Masuk</Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default RegisterPage;
