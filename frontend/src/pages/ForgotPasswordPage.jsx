import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MailCheck, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../services/api';
import Input from '../components/atoms/Input';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!email) return 'Email wajib diisi';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setEmailError(err);

    setLoading(true);
    setServerError('');
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="text-xl font-medium text-neutral-900 no-underline">
            Lumi<span className="text-primary">Skin</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col gap-6">

          {sent ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
                <MailCheck size={32} className="text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-medium text-neutral-900">Email Terkirim!</h2>
                <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
                  Kami mengirim link reset password ke{' '}
                  <span className="font-medium text-neutral-900">{email}</span>.
                  Periksa inbox atau folder spam-mu.
                </p>
              </div>

              <div className="w-full bg-primary-light border border-primary/20 rounded-xl px-4 py-3 text-sm text-primary-dark text-left leading-relaxed">
                💡 Link akan kadaluarsa dalam <span className="font-medium">30 menit</span>.
                Jika tidak menerima email, cek folder spam atau kirim ulang.
              </div>

              <button
                onClick={() => setSent(false)}
                className="text-sm text-neutral-400 hover:text-primary transition-colors underline"
              >
                Kirim ulang ke email lain
              </button>

              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
              >
                <ArrowLeft size={14} />
                Kembali ke halaman masuk
              </Link>
            </div>
          ) : (
            /* ── Request form ── */
            <>
              {/* Back link */}
              <Link to="/login" className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-primary transition-colors w-fit no-underline">
                <ArrowLeft size={14} />
                Kembali
              </Link>

              {/* Heading */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium tracking-widest text-primary uppercase">Bantuan Akun</p>
                <h1 className="text-2xl font-medium text-neutral-900">Lupa Password?</h1>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Masukkan email yang terdaftar. Kami akan mengirim link untuk membuat password baru.
                </p>
              </div>

              {/* Server error */}
              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {serverError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <Input
                  label="Alamat Email"
                  id="email"
                  type="email"
                  placeholder="kamu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                    setServerError('');
                  }}
                  error={emailError}
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-medium py-3 rounded-pill hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>

              {/* Footer links */}
              <p className="text-sm text-center text-neutral-400">
                Belum punya akun?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">Daftar Gratis</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
