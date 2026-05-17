function Input({ label, id, type = 'text', placeholder, value, onChange, error, required }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-900">
          {label}
          {required && <span className="text-primary ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none transition-all duration-200
          focus:ring-2 focus:ring-primary focus:border-primary
          ${error ? 'border-red-400' : 'border-neutral-200'}
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
