import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Shield } from 'lucide-react';
import axios from 'axios';
import ProfileCard from '../atoms/ProfileCard';
import PasswordInput from '../atoms/PasswordInput';

const ChangePasswordForm = ({ token, baseUrl }) => {
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    setError('');
    if (!pw.current) return setError('Masukkan password saat ini.');
    if (pw.next.length < 6) return setError('Password baru minimal 6 karakter.');
    if (pw.next !== pw.confirm) return setError('Konfirmasi password tidak cocok.');

    setLoading(true);
    setSuccess(false);
    try {
      await axios.put(`${baseUrl}/auth/change-password`, { currentPassword: pw.current, newPassword: pw.next }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      setPw({ current: '', next: '', confirm: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengubah password.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setPw((p) => ({ ...p, [field]: e.target.value }));
    setError('');
  };

  return (
    <ProfileCard title="Ubah Password" icon={Shield}>
      <div className="flex flex-col gap-3">
        <PasswordInput label="Password Saat Ini" id="current-password" placeholder="Masukkan password lama" value={pw.current} onChange={handleInputChange('current')} />
        <PasswordInput label="Password Baru" id="new-password" placeholder="Minimal 6 karakter" value={pw.next} onChange={handleInputChange('next')} />
        <PasswordInput label="Konfirmasi Password Baru" id="confirm-password" placeholder="Ulangi password baru" value={pw.confirm} onChange={handleInputChange('confirm')} />

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 size={12} />
            Password berhasil diubah!
          </p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="self-start px-5 py-2 bg-primary text-white text-sm font-medium rounded-pill hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Menyimpan...' : 'Ubah Password'}
        </button>
      </div>
    </ProfileCard>
  );
};

export default ChangePasswordForm;
