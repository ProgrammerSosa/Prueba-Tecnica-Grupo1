import { BeeIcon } from "../../features/auth/components/icons/BeeIcon";

export const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-pollen/40 bg-cream-comb/80 px-6 py-12 text-center">
    <BeeIcon className="mb-3 h-12 w-12 text-honey-nectar" animate={false} />
    <h3 className="font-display text-xl font-bold text-cacao-ink">{title}</h3>
    {description && (
      <p className="mt-2 max-w-md text-sm text-honeycomb">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
