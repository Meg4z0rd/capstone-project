import React from 'react';

const ProfileInfoRow = ({ label, value, badge }) => {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
      <span className="text-sm text-neutral-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-neutral-900">{value ?? '—'}</span>
        {badge && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
      </div>
    </div>
  );
};

export default ProfileInfoRow;
