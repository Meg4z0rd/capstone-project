import { useEffect, useRef, useState } from 'react';

const StepCard = ({ number, icon: Icon, title, description, index, totalSteps = 3 }) => {
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
    <div className="relative flex flex-col items-center" ref={ref}>
      {/* Connector line */}
      {index < totalSteps - 1 && (
        <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px">
          <div
            className="h-full bg-gradient-to-r from-primary/40 to-primary/10 transition-all duration-1000 ease-out"
            style={{
              width: visible ? '100%' : '0%',
              transitionDelay: `${index * 300 + 500}ms`,
            }}
          />
        </div>
      )}

      {/* Card */}
      <div
        className="group relative flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-neutral-200/60 bg-white transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 w-full cursor-default"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: `opacity 0.6s ease-out ${index * 200}ms, transform 0.6s ease-out ${index * 200}ms`,
        }}
      >
        {/* Hover gradient glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Number badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 group-hover:scale-105 transition-all duration-300">
            {Icon && <Icon size={26} className="text-white" strokeWidth={1.8} />}
          </div>
          <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-primary text-primary text-xs font-bold flex items-center justify-center shadow-sm">
            {number}
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5 relative z-10">
          <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">{title}</h3>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-[260px]">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
