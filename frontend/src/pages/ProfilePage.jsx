import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Mail, User, Shield, LogOut,
  CheckCircle2, Loader2, AlertCircle, Eye, EyeOff,
} from 'lucide-react';
import Navbar from '../components/organisms/Navbar';
import UserAvatar from '../components/atoms/UserAvatar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ─── Section card wrapper ─────────────────────────────────────────────── */
const Card = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-neutral-100">
      <Icon size={16} className="text-primary" />
      <h2 className="text-sm font-medium text-neutral-900">{title}</h2>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

/* ─── Info row ─────────────────────────────────────────────────────────── */
const InfoRow = ({ label, value, badge }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
    <span className="text-sm text-neutral-400">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-neutral-900">{value ?? '—'}</span>
      {badge && (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          {badge}
        </span>
      )}
    </div>
  </div>
);

/* ─── Halaman Profil ───────────────────────────────────────────────────── */
const ProfilePage = () => {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();

  /* State ubah nama */
  const [name, setName] = useState(user?.name ?? '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState('');

  /* State ubah password */
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');

  const isGoogleUser = !!user?.avatar && !user?.hasPassword;

  /* ── Simpan nama ── */
  const handleSaveName = async () => {
    if (!name.trim()) return setNameError('Nama tidak boleh kosong.');
    setNameLoading(true);
    setNameError('');
    setNameSuccess(false);
    try {
      const res = await axios.put(
        `${BASE_URL}/auth/update-profile`,
        { name: name.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login({ ...user, name: res.data.data?.user?.name ?? name.trim() }, token);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err) {
      setNameError(err.response?.data?.message ?? 'Gagal menyimpan nama.');
    } finally {
      setNameLoading(false);
    }
  };

  /* ── Ubah password ── */
  const handleChangePassword = async () => {
    setPwError('');
    if (!pw.current) return setPwError('Masukkan password saat ini.');
    if (pw.next.length < 6) return setPwError('Password baru minimal 6 karakter.');
    if (pw.next !== pw.confirm) return setPwError('Konfirmasi password tidak cocok.');

    setPwLoading(true);
    setPwSuccess(false);
    try {
      await axios.put(
        `${BASE_URL}/auth/change-password`,
        { currentPassword: pw.current, newPassword: pw.next },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPwSuccess(true);
      setPw({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.response?.data?.message ?? 'Gagal mengubah password.');
    } finally {
      setPwLoading(false);
    }
  };

  /* ── Logout ── */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const togglePw = (field) =>
    setShowPw((prev) => ({ ...prev, [field]: !prev[field] }));

  const PwInput = ({ field, placeholder, label }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-900">{label}</label>
      <div className="relative">
        <input
          type={showPw[field] ? 'text' : 'password'}
          placeholder={placeholder}
          value={pw[field]}
          onChange={(e) => {
            setPw((p) => ({ ...p, [field]: e.target.value }));
            setPwError('');
          }}
          className="w-full px-4 py-2.5 pr-10 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />
        <button type="button" onClick={() => togglePw(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
          {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* ── Header halaman ── */}
        <div>
          <p className="text-xs font-medium tracking-widest text-primary uppercase">Akun</p>
          <h1 className="text-2xl font-medium text-neutral-900 mt-0.5">Profil Saya</h1>
        </div>

        {/* ── Kartu foto profil ── */}
        <div className="bg-white rounded-2xl border border-neutral-200 px-6 py-6 flex items-center gap-5">
          {/* Avatar besar */}
          <div className="relative flex-shrink-0">
            <UserAvatar user={user} size="xl" />

            {/* Badge Google jika login via Google */}
            {user?.avatar && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-neutral-200 flex items-center justify-center shadow-sm" title="Foto dari Google">
                <svg width="14" height="14" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </div>
            )}

            {/* Ikon kamera placeholder (untuk upload foto manual di masa depan) */}
            {!user?.avatar && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors">
                <Camera size={11} className="text-white" />
              </div>
            )}
          </div>

          {/* Info singkat */}
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-lg font-medium text-neutral-900 truncate">
              {user?.name ?? 'Pengguna LumiSkin'}
            </p>
            <p className="text-sm text-neutral-400 truncate">{user?.email}</p>

            {/* Label metode login */}
            <div className="flex items-center gap-1.5 mt-1">
              {user?.avatar ? (
                <span className="inline-flex items-center gap-1 text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                  <svg width="10" height="10" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Masuk via Google
                </span>
              ) : (
                <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                  Email & Password
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Info akun ── */}
        <Card title="Informasi Akun" icon={Mail}>
          <InfoRow label="Nama Lengkap" value={user?.name} />
          <InfoRow label="Email" value={user?.email} badge="Terverifikasi" />
          <InfoRow
            label="Metode Login"
            value={user?.avatar ? 'Google OAuth' : 'Email & Password'}
          />
        </Card>

        {/* ── Ubah nama ── */}
        <Card title="Ubah Nama" icon={User}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-900">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                placeholder="Nama lengkap kamu"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              {nameError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} />{nameError}
                </p>
              )}
              {nameSuccess && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} />Nama berhasil diperbarui!
                </p>
              )}
            </div>
            <button
              onClick={handleSaveName}
              disabled={nameLoading || name.trim() === (user?.name ?? '')}
              className="self-start px-5 py-2 bg-primary text-white text-sm font-medium rounded-pill hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {nameLoading && <Loader2 size={14} className="animate-spin" />}
              {nameLoading ? 'Menyimpan...' : 'Simpan Nama'}
            </button>
          </div>
        </Card>

        {/* ── Ubah password — hanya tampil untuk user email/password ── */}
        {!isGoogleUser && (
          <Card title="Ubah Password" icon={Shield}>
            <div className="flex flex-col gap-3">
              <PwInput field="current" label="Password Saat Ini" placeholder="Masukkan password lama" />
              <PwInput field="next" label="Password Baru" placeholder="Minimal 6 karakter" />
              <PwInput field="confirm" label="Konfirmasi Password Baru" placeholder="Ulangi password baru" />

              {pwError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} />{pwError}
                </p>
              )}
              {pwSuccess && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} />Password berhasil diubah!
                </p>
              )}

              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="self-start px-5 py-2 bg-primary text-white text-sm font-medium rounded-pill hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {pwLoading && <Loader2 size={14} className="animate-spin" />}
                {pwLoading ? 'Menyimpan...' : 'Ubah Password'}
              </button>
            </div>
          </Card>
        )}

        {/* ── Info untuk user Google — tidak bisa ubah password ── */}
        {isGoogleUser && (
          <Card title="Keamanan Akun" icon={Shield}>
            <div className="flex items-start gap-3 text-sm text-neutral-500 bg-neutral-50 rounded-xl p-4">
              <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <p className="leading-relaxed">
                Akun kamu terhubung dengan Google. Password dikelola langsung oleh Google — ubah di{' '}
                <a href="https://myaccount.google.com" target="_blank" rel="noopener noreferrer"
                  className="text-primary underline">myaccount.google.com</a>.
              </p>
            </div>
          </Card>
        )}

        {/* ── Tombol keluar ── */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 transition-all w-fit"
        >
          <LogOut size={15} />
          Keluar dari Akun
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;
