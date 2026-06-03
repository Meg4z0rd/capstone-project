function Badge({ children, color = 'blue', icon: Icon }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    gray: 'bg-neutral-50 text-neutral-600 border-neutral-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ${colors[color] || colors.blue}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

export default Badge;
