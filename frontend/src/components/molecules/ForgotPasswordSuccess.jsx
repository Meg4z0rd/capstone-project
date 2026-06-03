import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowLeft } from 'lucide-react';
import Button from '../atoms/Button';

const ForgotPasswordSuccess = ({ email, onBackToRequest }) => {
  return (
    <div className="flex flex-col items-center gap-5 text-center py-4">
      {/* Icon Wrapper */}
      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
        <MailCheck size={32} className="text-primary" />
      </div>

      {/* Typography */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-medium text-neutral-900">Email Terkirim!</h2>
        <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
          Kami mengirim link reset password ke <span className="font-medium text-neutral-900">{email}</span>. Periksa inbox atau folder spam-mu.
        </p>
      </div>

      {/* Info Alert Box */}
      <div className="w-full bg-primary-light border border-primary/20 rounded-xl px-4 py-3 text-sm text-primary-dark text-left leading-relaxed">
        💡 Link akan kadaluarsa dalam <span className="font-medium">30 menit</span>. Jika tidak menerima email, cek folder spam atau kirim ulang.
      </div>

      {/* Action Buttons using Atomic Components */}
      <div className="flex flex-col gap-2 w-full items-center">
        <Button variant="ghost" size="sm" onClick={onBackToRequest}>
          <span className="text-neutral-500 hover:text-neutral-900 underline">Kirim ulang ke email lain</span>
        </Button>

        <Link to="/login" className="no-underline mt-2">
          <Button variant="outline" size="sm">
            <span className="flex items-center gap-1.5">
              <ArrowLeft size={14} />
              Kembali ke halaman masuk
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordSuccess;
