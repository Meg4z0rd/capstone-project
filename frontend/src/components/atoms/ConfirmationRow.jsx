import React from 'react';

const ConfirmationRow = ({ label, value, isTruncate = false, className = '' }) => {
  return (
    <div className={`flex items-start gap-2 text-sm py-1 ${className}`}>
      <span className="text-neutral-400 w-28 flex-shrink-0">{label}</span>
      <span className={`text-neutral-900 font-medium ${isTruncate ? 'truncate' : ''}`}>{value || '-'}</span>
    </div>
  );
};

export default ConfirmationRow;
