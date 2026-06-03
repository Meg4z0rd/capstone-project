import React from 'react';

const ProfileCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-neutral-100">
        <Icon size={16} className="text-primary" />
        <h2 className="text-sm font-medium text-neutral-900">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

export default ProfileCard;
