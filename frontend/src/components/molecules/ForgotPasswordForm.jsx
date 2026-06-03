import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import SectionLabel from '../atoms/SectionLabel';

const ForgotPasswordForm = ({ email, setEmail, emailError, serverError, loading, onSubmit }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Tombol Kembali Atas */}
      <Link to="/login" className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-primary transition-colors w-fit no-underline">
        <ArrowLeft size={14} />
        Kembali
      </Link>

      {/* Heading Informasi */}
      <div className="flex flex-col">
        <SectionLabel>Bantuan Akun</SectionLabel>
        <h1 className="text-2xl font-medium text-neutral-900 mt-1">Lupa Password?</h1>
        <p className="text-sm text-neutral-400 leading-relaxed mt-1">Masukkan email yang terdaftar. Kami akan mengirim link untuk membuat password baru.</p>
      </div>

      {/* Tampilan Pesan Error dari Server */}
      {serverError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">⚠️ {serverError}</div>}

      {/* Form Input Data */}
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Input label="Alamat Email" id="email" type="email" placeholder="kamu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} required />

        {/* REFACTOR: Menggunakan Atom Button asli milik Taufik */}
        <Button type="submit" variant={loading ? 'outline' : 'primary'} size="md">
          <span className="flex items-center justify-center gap-2 w-full">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </span>
        </Button>
      </form>

      {/* Tautan ke Register */}
      <p className="text-sm text-center text-neutral-400">
        Belum punya akun?{' '}
        <Link to="/register" className="text-primary font-medium hover:underline no-underline">
          Daftar Gratis
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
