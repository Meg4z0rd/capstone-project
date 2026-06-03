import React from 'react';
import { Loader2 } from 'lucide-react';

const GoogleLoadingView = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="text-primary animate-spin" />
        <p className="text-sm text-neutral-400">Memproses login Google...</p>
      </div>
    </div>
  );
};

export default GoogleLoadingView;
