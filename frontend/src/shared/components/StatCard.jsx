export const StatCard = ({ label, value, hint, tone = "default" }) => {
  const toneClass =
    tone === "warn"
      ? "border-honey-nectar/50"
      : tone === "danger"
        ? "border-danger/40"
        : tone === "info"
          ? "border-sky-trace/50"
          : "border-pollen/25";

  return (
    <div className={`panel-card border ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pollen">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-cacao-ink">{value}</p>
      {hint && <p className="mt-1 text-sm text-honeycomb">{hint}</p>}
    </div>
  );
};
