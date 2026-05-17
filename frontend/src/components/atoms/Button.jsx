function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button' }) {
  const base = 'font-medium rounded-pill transition-all duration-200 cursor-pointer';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    outline: 'border border-primary text-primary hover:bg-primary-light',
    ghost: 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </button>
  );
}

export default Button;
