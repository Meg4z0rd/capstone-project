import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

const ACNE_DATA = [
  {
    id: 'papula',
    name: 'Papula',
    icon: AlertCircle,
    severity: 'Ringan',
    severityColor: 'emerald',
    characteristic: 'Benjolan kecil, padat, dan kemerahan di atas permukaan kulit tanpa puncak bernanah.',
    cause: 'Penyumbatan pori-pori yang memicu inflamasi selular ringan akibat aktivitas bakteri Propionibacterium acnes.',
    tip: 'Hindari memencet papula karena dapat memperparah peradangan dan meninggalkan bekas.',
  },
  {
    id: 'pustula',
    name: 'Pustula',
    icon: AlertTriangle,
    severity: 'Sedang',
    severityColor: 'amber',
    characteristic: 'Benjolan meradang yang memiliki puncak putih atau kekuningan di bagian tengahnya (berisi nanah).',
    cause: 'Eskalasi inflamasi di mana sel darah putih (neutrofil) berkumpul di permukaan kulit untuk melawan infeksi.',
    tip: 'Gunakan spot treatment dengan Benzoyl Peroxide 2.5% untuk membantu mengecilkan pustula.',
  },
  {
    id: 'nodul',
    name: 'Nodul / Kistik',
    icon: ShieldAlert,
    severity: 'Berat',
    severityColor: 'red',
    characteristic: 'Benjolan berukuran besar, keras, tertanam jauh di dalam lapisan kulit, dan terasa nyeri jika disentuh.',
    cause: 'Kerusakan dinding folikel yang parah, menyebabkan infeksi dan peradangan menyebar luas di lapisan dermis.',
    tip: 'Segera konsultasikan ke dokter kulit. Jenis ini memerlukan penanganan medis profesional.',
  },
];

const severityStyles = {
  emerald: {
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'w-1/3 bg-gradient-to-r from-emerald-400 to-emerald-500',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-600 border-amber-200',
    dot: 'bg-amber-500',
    bar: 'w-2/3 bg-gradient-to-r from-amber-400 to-amber-500',
  },
  red: {
    badge: 'bg-red-50 text-red-600 border-red-200',
    dot: 'bg-red-500',
    bar: 'w-full bg-gradient-to-r from-red-400 to-red-500',
  },
};

const AcneCatalog = () => {
  const [activeTab, setActiveTab] = useState('papula');
  const [animating, setAnimating] = useState(false);
  const activeAcne = ACNE_DATA.find((item) => item.id === activeTab);
  const styles = severityStyles[activeAcne.severityColor];
  const contentRef = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTabChange = (id) => {
    if (id === activeTab) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(id);
      setAnimating(false);
    }, 200);
  };

  const ActiveIcon = activeAcne.icon;

  return (
    <div
      ref={sectionRef}
      className="w-full rounded-2xl border border-neutral-200/60 bg-white overflow-hidden transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <ActiveIcon size={16} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">Katalog Jenis Jerawat</h3>
        </div>
        <p className="text-xs text-neutral-400 ml-11">Kenali karakteristik visual jerawat yang dideteksi oleh model Computer Vision LumiSkin.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100">
        {ACNE_DATA.map((item) => {
          const isActive = activeTab === item.id;
          const ItemIcon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-medium transition-all duration-300 cursor-pointer border-b-2 ${
                isActive
                  ? 'border-primary text-primary bg-primary/[0.02]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50/50'
              }`}
            >
              <ItemIcon size={14} />
              <span>{item.name}</span>
              {isActive && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${severityStyles[item.severityColor].badge}`}>
                  {item.severity}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className={`p-6 transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      >
        {/* Severity bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Tingkat Keparahan</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles.badge}`}>
              {activeAcne.severity}
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ease-out ${styles.bar}`} />
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-50/80 border border-neutral-100">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Karakteristik Klinis</span>
            <p className="text-sm text-neutral-900 leading-relaxed">{activeAcne.characteristic}</p>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-50/80 border border-neutral-100">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Patologi Biologis</span>
            <p className="text-sm text-neutral-900 leading-relaxed">{activeAcne.cause}</p>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 p-3.5 rounded-xl bg-primary/[0.03] border border-primary/10 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-primary text-[10px] font-bold">💡</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            <span className="font-semibold text-primary">Tips:</span> {activeAcne.tip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcneCatalog;
