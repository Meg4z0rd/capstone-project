import { useEffect, useRef, useState } from 'react';

function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative bg-white border border-neutral-200/60 rounded-2xl p-7 flex flex-col gap-4 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 cursor-default overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(25px)',
        transition: `opacity 0.6s ease-out ${index * 150}ms, transform 0.6s ease-out ${index * 150}ms, box-shadow 0.5s, border-color 0.5s`,
      }}
    >
      {/* Hover gradient glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon */}
      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 group-hover:scale-105 transition-all duration-300">
        <Icon size={22} className="text-white" strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div className="relative flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-neutral-900 tracking-tight">{title}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </div>
  );
}

export default FeatureCard;
