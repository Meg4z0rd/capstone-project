import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../atoms/Button';

const GoogleErrorCard = ({ message, onBack }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 max-w-sm w-full flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle size={24} className="text-red-500" />
        </div>

        <div>
          <p className="text-base font-medium text-neutral-900">Login Gagal</p>
          <p className="text-sm text-neutral-400 mt-1">{message}</p>
        </div>

        <Button variant="primary" size="md" onClick={onBack} className="w-full">
          Kembali ke Login
        </Button>
      </div>
    </div>
  );
};

export default GoogleErrorCard;
