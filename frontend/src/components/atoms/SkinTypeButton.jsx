import React from 'react';

const SkinTypeButton = ({ title, description, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer w-full
        ${isSelected ? 'border-primary bg-primary-light' : 'border-neutral-200 bg-white hover:border-primary/50'}`}
    >
      <span className={`text-sm font-medium ${isSelected ? 'text-primary-dark' : 'text-neutral-900'}`}>{title}</span>
      {description && <span className="text-xs text-neutral-400">{description}</span>}
    </button>
  );
};

export default SkinTypeButton;
