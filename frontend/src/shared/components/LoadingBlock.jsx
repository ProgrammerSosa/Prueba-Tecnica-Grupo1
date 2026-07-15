export const LoadingBlock = ({ label = "Preparando la colmena..." }) => (
  <div className="flex min-h-48 items-center justify-center rounded-xl border border-pollen/20 bg-cream-comb/60">
    <p className="font-display text-lg text-cacao-ink">{label}</p>
  </div>
);
