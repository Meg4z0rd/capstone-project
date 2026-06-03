import React from 'react';

const ConcernTag = ({ label, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-pill text-xs font-medium border transition-all duration-150 cursor-pointer
        ${isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-400 border-neutral-200 hover:border-primary hover:text-primary'}`}
    >
      {label}
    </button>
  );
};

export default ConcernTag;
