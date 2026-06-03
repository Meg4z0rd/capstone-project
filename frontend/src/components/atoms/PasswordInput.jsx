import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ label, id, value, onChange, error, placeholder = 'Minimal 6 karakter', required = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-900">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none transition-all duration-200
            focus:ring-2 focus:ring-primary focus:border-primary
            ${error ? 'border-red-400' : 'border-neutral-200'}`}
        />

        <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer">
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;
