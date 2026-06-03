import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Button from '../atoms/Button';

const ResetPasswordSuccess = ({ onNavigateLogin }) => {
  return (
    <div className="flex flex-col items-center gap-5 text-center py-4">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle2 size={32} className="text-green-500" />
      </div>

      <div>
        <h2 className="text-2xl font-medium text-neutral-900">Password Berhasil Diubah!</h2>
        <p className="text-sm text-neutral-400 mt-1">Silakan masuk dengan password baru kamu.</p>
      </div>

      <Button variant="primary" size="md" onClick={onNavigateLogin} className="w-full">
        Masuk Sekarang
      </Button>
    </div>
  );
};

export default ResetPasswordSuccess;
