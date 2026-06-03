import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import PasswordInput from '../components/atoms/PasswordInput';
import AuthShell from '../components/organisms/AuthShell';
import ResetPasswordSuccess from '../components/molecules/ResetPasswordSuccess';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!password) errs.password = 'Password wajib diisi';
    else if (password.length < 6) errs.password = 'Password minimal 6 karakter';
    if (!confirm) errs.confirm = 'Konfirmasi password wajib diisi';
    else if (confirm !== password) errs.confirm = 'Password tidak cocok';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setServerError('');
    try {
      await axios.post(`${BASE_URL}/auth/reset-password`, { token, password });
      setDone(true);
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Gagal reset password. Token mungkin sudah kadaluarsa.');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordMatch = confirm && confirm === password;

  if (!token) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 max-w-sm w-full flex flex-col items-center gap-4 text-center">
          <AlertCircle size={32} className="text-red-500" />
          <div>
            <p className="text-base font-medium text-neutral-900">Link Tidak Valid</p>
            <p className="text-sm text-neutral-400 mt-1">Link reset password tidak valid atau sudah kadaluarsa.</p>
          </div>
          <Link to="/forgot-password" className="w-full bg-primary text-white font-medium py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-sm text-center no-underline">
            Minta Link Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col gap-6">
        {done ? (
          <ResetPasswordSuccess onNavigateLogin={() => navigate('/login')} />
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium tracking-widest text-primary uppercase">Reset Password</p>
              <h1 className="text-2xl font-medium text-neutral-900">Buat Password Baru</h1>
              <p className="text-sm text-neutral-400">Masukkan password baru untuk akunmu.</p>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span className="flex-1">{serverError}</span>
                {serverError.includes('kadaluarsa') && (
                  <Link to="/forgot-password" className="text-primary underline whitespace-nowrap font-medium no-underline">
                    Minta ulang
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <PasswordInput
                label="Password Baru"
                id="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: '' }));
                }}
                error={errors.password}
                required
              />

              <div className="relative flex flex-col">
                <PasswordInput
                  label="Konfirmasi Password"
                  id="confirm"
                  placeholder="Ulangi password baru"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setErrors((p) => ({ ...p, confirm: '' }));
                  }}
                  error={errors.confirm}
                  required
                />
                {isPasswordMatch && <CheckCircle2 size={16} className="absolute right-10 top-[46px] text-green-500" />}
              </div>

              <Button type="submit" variant={loading ? 'outline' : 'primary'} size="md" disabled={loading}>
                <span className="flex items-center justify-center gap-2 w-full">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </span>
              </Button>
            </form>
          </>
        )}
      </div>
    </AuthShell>
  );
};

export default ResetPasswordPage;
