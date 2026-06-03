import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SKIN_TYPES = [
  { id: 'normal', label: 'Normal', desc: 'Tidak terlalu kering atau berminyak' },
  { id: 'oily', label: 'Berminyak', desc: 'Pori besar, mudah berkilap' },
  { id: 'dry', label: 'Kering', desc: 'Terasa kencang, mudah mengelupas' },
  { id: 'combination', label: 'Kombinasi', desc: 'Berminyak di T-zone, kering di pipi' },
  { id: 'sensitive', label: 'Sensitif', desc: 'Mudah iritasi atau kemerahan' },
];

const CONCERNS = [
  { id: 'acne', label: 'Jerawat' },
  { id: 'dark_spots', label: 'Flek hitam' },
  { id: 'wrinkles', label: 'Kerutan' },
  { id: 'redness', label: 'Kemerahan' },
  { id: 'pores', label: 'Pori besar' },
  { id: 'dullness', label: 'Kusam' },
  { id: 'eyebags', label: 'Mata panda' },
  { id: 'uneven_tone', label: 'Warna tidak merata' },
];

const StepBadge = ({ n, active, done }) => (
  <div
    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors duration-200
    ${done ? 'bg-primary text-white' : active ? 'bg-primary-light text-primary border-2 border-primary' : 'bg-neutral-200 text-neutral-400'}`}
  >
    {done ? <CheckCircle2 size={14} /> : n}
  </div>
);

const SectionCard = ({ step, active, done, title, children }) => (
  <div className={`bg-white rounded-2xl border transition-all duration-200 ${active ? 'border-primary shadow-sm' : 'border-neutral-200'}`}>
    <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100">
      <StepBadge n={step} active={active} done={done} />
      <span className="text-sm font-medium text-neutral-900">{title}</span>
      {done && !active && <CheckCircle2 size={14} className="ml-auto text-primary" />}
    </div>
    {(active || done) && <div className="p-6">{children}</div>}
  </div>
);

export { SKIN_TYPES, CONCERNS, StepBadge, SectionCard };
