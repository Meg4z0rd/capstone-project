const SectionLabel = ({ children, icon: Icon, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.06] border border-primary/10 mb-2 ${className}`}>
      {Icon && <Icon size={12} className="text-primary" />}
      <span className="text-[11px] font-medium text-primary uppercase tracking-wider">{children}</span>
    </div>
  );
};

export default SectionLabel;
