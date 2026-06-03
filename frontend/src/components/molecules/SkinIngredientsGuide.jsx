import { useState, useEffect, useRef } from "react";
import {
  Droplets,
  Sun,
  Heart,
  FlaskConical,
  ArrowRight,
  Layers,
  ShieldCheck,
} from "lucide-react";

const SKIN_INGREDIENTS = [
  {
    type: "Berminyak",
    icon: Droplets,
    emoji: "💧",
    desc: "Kelenjar minyak (sebum) terlalu aktif, menyebabkan pori-pori rentan tersumbat dan memicu komedo.",
    actives: [
      { name: "Salicylic Acid (BHA)", benefit: "Membersihkan pori dari dalam" },
      { name: "Niacinamide", benefit: "Mengontrol produksi sebum" },
      { name: "Retinol", benefit: "Mempercepat regenerasi sel" },
    ],
    insight:
      "BHA bersifat lipofilik (larut dalam minyak), memungkinkannya masuk ke dalam pori-pori untuk membersihkan sumbatan sebum dari lapisan terdalam.",
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-200",
    activeColor: "border-blue-400 shadow-blue-100",
    tagBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    type: "Kering",
    icon: Sun,
    emoji: "☀️",
    desc: "Kulit kekurangan produksi lipid alami, merusak pertahanan hidrasi sehingga kulit terasa kesat dan kasar.",
    actives: [
      { name: "Hyaluronic Acid", benefit: "Menarik & mengunci kelembapan" },
      { name: "Ceramides", benefit: "Memperbaiki skin barrier" },
      { name: "Glycerin", benefit: "Humektan pelembap alami" },
    ],
    insight:
      "Ceramides merekatkan kembali sel-sel kulit yang renggang untuk memperbaiki fungsi skin barrier dalam mengunci molekul air di lapisan epidermis.",
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-200",
    activeColor: "border-blue-400 shadow-blue-100",
    tagBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    type: "Sensitif",
    icon: Heart,
    emoji: "🌿",
    desc: "Toleransi kulit sangat rendah terhadap agen eksternal, mudah memicu reaksi inflamasi, kemerahan, atau perih.",
    actives: [
      { name: "Centella Asiatica", benefit: "Menenangkan kulit meradang" },
      { name: "Allantoin", benefit: "Mempercepat penyembuhan" },
      { name: "Panthenol", benefit: "Menghidrasi & melindungi" },
    ],
    insight:
      "Senyawa Madecassoside pada Centella terbukti secara klinis menurunkan sitokin inflamasi untuk menenangkan pembuluh darah dan mengurangi kemerahan.",
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-200",
    activeColor: "border-blue-400 shadow-blue-100",
    tagBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    type: "Kombinasi",
    icon: Layers,
    emoji: "⚖️",
    desc: "Kelenjar minyak aktif di area T-Zone (dahi, hidung, dagu), sementara area pipi cenderung kering.",
    actives: [
      { name: "Niacinamide", benefit: "Menyeimbangkan minyak & hidrasi" },
      { name: "Hyaluronic Acid", benefit: "Melembapkan area kering" },
      { name: "Salicylic Acid (BHA)", benefit: "Target pembersihan T-zone" },
    ],
    insight:
      "Perawatan kombinasi membutuhkan pendekatan hidrasi seimbang untuk menahan produksi minyak T-Zone sekaligus memperkuat retensi air di area U-Zone.",
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-200",
    activeColor: "border-blue-400 shadow-blue-100",
    tagBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    type: "Normal",
    icon: ShieldCheck,
    emoji: "✨",
    desc: "Keseimbangan lipid dan hidrasi terjaga dengan sangat baik. Kulit tampak halus, kenyal, dan bebas kemerahan.",
    actives: [
      { name: "Vitamin C", benefit: "Antioksidan & mencerahkan kulit" },
      { name: "Hyaluronic Acid", benefit: "Menjaga elastisitas & hidrasi" },
      { name: "Peptides", benefit: "Mencegah penuaan dini" },
    ],
    insight:
      "Meskipun stabil, tipe normal membutuhkan nutrisi antioksidan aktif untuk melindungi skin barrier dari polusi udara dan radiasi sinar UV.",
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-200",
    activeColor: "border-blue-400 shadow-blue-100",
    tagBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
];

const SkinIngredientsGuide = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const currentSkin = SKIN_INGREDIENTS[activeIndex];
  const SkinIcon = currentSkin.icon;
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (idx) => {
    if (idx === activeIndex) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setAnimating(false);
    }, 200);
  };

  return (
    <div
      ref={sectionRef}
      className="w-full rounded-2xl border border-neutral-200/60 bg-white overflow-hidden transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: "150ms",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <FlaskConical size={16} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">
            Matriks Jenis Kulit & Bahan Aktif
          </h3>
        </div>
        <p className="text-xs text-neutral-400 ml-11">
          Edukasi pencocokan bahan aktif kosmetik berdasarkan hasil korelasi
          data jenis kulit individu.
        </p>
      </div>

      {/* Skin type selector */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {SKIN_INGREDIENTS.map((skin, idx) => {
            const isActive = activeIndex === idx;
            const ItemIcon = skin.icon;
            return (
              <button
                key={skin.type}
                onClick={() => handleChange(idx)}
                className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? `${skin.activeColor} shadow-md bg-white`
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
                }`}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${skin.color} transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                />

                <div className="relative flex flex-col items-start gap-3 h-full justify-between">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isActive ? "bg-white shadow-sm" : "bg-neutral-50"
                    }`}
                  >
                    <ItemIcon
                      size={18}
                      className={isActive ? "text-primary" : "text-neutral-400"}
                    />
                  </div>
                  <div className="min-w-0 mt-2">
                    <p
                      className={`text-sm font-semibold transition-colors duration-300 ${isActive ? "text-neutral-900" : "text-neutral-700"}`}
                    >
                      Tipe {skin.type}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {skin.desc}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active ingredient detail */}
      <div
        className={`px-6 pb-6 transition-all duration-200 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
      >
        {/* Recommended actives */}
        <div className="p-5 rounded-xl bg-neutral-50/80 border border-neutral-100 mb-4">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Rekomendasi Bahan Aktif
          </span>
          <div className="mt-3 flex flex-col gap-2.5">
            {currentSkin.actives.map((active, i) => (
              <div
                key={active.name}
                className="flex items-center gap-3 group/item"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${currentSkin.tagBg}`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-900">
                    {active.name}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <ArrowRight
                      size={10}
                      className="opacity-0 group-hover/item:opacity-100 transition-opacity text-primary"
                    />
                    {active.benefit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scientific insight */}
        <div
          className={`p-4 rounded-xl border bg-gradient-to-br ${currentSkin.color} ${currentSkin.borderColor}`}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
              <SkinIcon size={16} className="text-primary" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                Korelasi Riset Data
              </span>
              <p className="text-sm text-neutral-800 leading-relaxed mt-1">
                {currentSkin.insight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinIngredientsGuide;
