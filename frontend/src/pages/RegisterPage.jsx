import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import PasswordInput from '../components/atoms/PasswordInput';
import PasswordStrengthBar from '../components/atoms/PasswordStrengthBar';
import AuthShell from '../components/organisms/AuthShell';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [agreed, setAgreed] = useState(false);

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

  const isPasswordMatch = form.confirm && form.confirm === form.password;

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">Bergabung Sekarang</p>
          <h1 className="text-2xl font-medium text-neutral-900">Buat Akun Gratis</h1>
          <p className="text-sm text-neutral-400">Mulai analisis kulitmu dalam hitungan detik.</p>
        </div>

        {serverError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">⚠️ {serverError}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input label="Nama Lengkap" id="name" placeholder="Nama kamu" value={form.name} onChange={handleChange('name')} error={errors.name} required />

          <Input label="Email" id="email" type="email" placeholder="kamu@email.com" value={form.email} onChange={handleChange('email')} error={errors.email} required />

          <div className="flex flex-col gap-1">
            <PasswordInput label="Password" id="password" value={form.password} onChange={handleChange('password')} error={errors.password} required />
            <PasswordStrengthBar password={form.password} />
          </div>

          <div className="relative flex flex-col">
            <PasswordInput label="Konfirmasi Password" id="confirm" placeholder="Ulangi password" value={form.confirm} onChange={handleChange('confirm')} error={errors.confirm} required />
            {isPasswordMatch && <CheckCircle2 size={16} className="absolute right-10 top-[46px] text-green-500" />}
          </div>
          <div className="flex flex-col gap-1 mt-1">
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
                <Link to="/terms" className="text-primary hover:underline no-underline font-medium">
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link to="/privacy" className="text-primary hover:underline no-underline font-medium">
                  Kebijakan Privasi
                </Link>
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500 ml-6">{errors.agreed}</p>}
          </div>
          <Button type="submit" variant={loading ? 'outline' : 'primary'} size="md" disabled={loading}>
            <span className="flex items-center justify-center gap-2 w-full">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Mendaftar...' : 'Buat Akun'}
            </span>
          </Button>
        </form>
        <p className="text-sm text-center text-neutral-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline no-underline">
            Masuk
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default RegisterPage;
