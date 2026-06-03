import React from 'react';

const STRENGTH_LABEL = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
const STRENGTH_COLOR = ['', 'bg-red-400', 'bg-amber-400', 'bg-primary', 'bg-green-500'];

const calcStrength = (pw) => {
  let score = 0;
  if (!pw) return score;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const PasswordStrengthBar = ({ password }) => {
  const strength = calcStrength(password);

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1 mt-0.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? STRENGTH_COLOR[strength] : 'bg-neutral-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength <= 1 ? 'text-red-400' : strength === 2 ? 'text-amber-500' : strength === 3 ? 'text-primary' : 'text-green-500'}`}>{STRENGTH_LABEL[strength]}</p>
    </div>
  );
};

export default PasswordStrengthBar;
