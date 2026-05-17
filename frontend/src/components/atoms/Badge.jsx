function Badge({ children, color = 'blue' }) {
  const colors = {
    blue: 'bg-primary-light text-primary-dark',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    gray: 'bg-neutral-200 text-neutral-900',
  };

  return <span className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium ${colors[color]}`}>{children}</span>;
}

export default Badge;
