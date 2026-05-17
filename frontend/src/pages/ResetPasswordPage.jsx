import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  // Token tidak ada di URL
  if (!token) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 max-w-sm w-full flex flex-col items-center gap-4 text-center">
          <AlertCircle size={32} className="text-red-500" />
          <div>
            <p className="text-base font-medium text-neutral-900">Link Tidak Valid</p>
            <p className="text-sm text-neutral-400 mt-1">Link reset password tidak valid atau sudah kadaluarsa.</p>
          </div>
          <Link to="/forgot-password"
            className="w-full bg-primary text-white font-medium py-2.5 rounded-pill hover:bg-primary-dark transition-colors text-sm text-center">
            Minta Link Baru
          </Link>
        </div>
      </div>
    );
  }

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

          {done ? (
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-neutral-900">Password Berhasil Diubah!</h2>
                <p className="text-sm text-neutral-400 mt-1">Silakan masuk dengan password baru kamu.</p>
              </div>
              <button onClick={() => navigate('/login')}
                className="w-full bg-primary text-white font-medium py-3 rounded-pill hover:bg-primary-dark transition-colors duration-200 text-sm">
                Masuk Sekarang
              </button>
            </div>
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
                  {serverError}
                  {serverError.includes('kadaluarsa') && (
                    <Link to="/forgot-password" className="ml-auto text-primary underline whitespace-nowrap">Minta ulang</Link>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {/* Password baru */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-neutral-900">
                    Password Baru<span className="text-primary ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input id="password" type={showPw ? 'text' : 'password'} placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                      className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none transition-all duration-200
                        focus:ring-2 focus:ring-primary focus:border-primary ${errors.password ? 'border-red-400' : 'border-neutral-200'}`} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                {/* Konfirmasi */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirm" className="text-sm font-medium text-neutral-900">
                    Konfirmasi Password<span className="text-primary ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input id="confirm" type={showConfirm ? 'text' : 'password'} placeholder="Ulangi password baru"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })); }}
                      className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none transition-all duration-200
                        focus:ring-2 focus:ring-primary focus:border-primary ${errors.confirm ? 'border-red-400' : 'border-neutral-200'}`} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {confirm && confirm === password && (
                      <CheckCircle2 size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-primary text-white font-medium py-3 rounded-pill hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
