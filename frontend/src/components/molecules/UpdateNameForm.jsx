import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import ProfileCard from '../atoms/ProfileCard';
import { User } from 'lucide-react';

const UpdateNameForm = ({ user, token, login, baseUrl }) => {
  const [name, setName] = useState(user?.name ?? '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSaveName = async () => {
    if (!name.trim()) return setError('Nama tidak boleh kosong.');
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await axios.put(`${baseUrl}/auth/update-profile`, { name: name.trim() }, { headers: { Authorization: `Bearer ${token}` } });
      login({ ...user, name: res.data.data?.user?.name ?? name.trim() }, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal menyimpan nama.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileCard title="Ubah Nama" icon={User}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-900">Nama Lengkap</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Nama lengkap kamu"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} />
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 size={12} />
              Nama berhasil diperbarui!
            </p>
          )}
        </div>
        <button
          onClick={handleSaveName}
          disabled={loading || name.trim() === (user?.name ?? '')}
          className="self-start px-5 py-2 bg-primary text-white text-sm font-medium rounded-pill hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Menyimpan...' : 'Simpan Nama'}
        </button>
      </div>
    </ProfileCard>
  );
};

export default UpdateNameForm;
