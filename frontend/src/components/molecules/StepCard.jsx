const StepCard = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center">{number}</div>

      <h3 className="text-base font-medium text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-400 leading-relaxed max-w-[200px]">{description}</p>
    </div>
  );
};

export default StepCard;
