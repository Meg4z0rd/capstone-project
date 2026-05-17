function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col gap-3 hover:shadow-sm transition-shadow duration-200">
      <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
        <Icon size={20} className="text-primary" />
      </div>

      <h3 className="text-base font-medium text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
