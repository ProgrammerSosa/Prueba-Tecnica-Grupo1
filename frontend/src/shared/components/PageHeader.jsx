export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="font-display text-3xl font-bold text-cacao-ink md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-pollen">
          {subtitle}
        </p>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);
