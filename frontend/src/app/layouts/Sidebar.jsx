import { NavLink } from "react-router-dom";
import { BeeIcon } from "../../features/auth/components/icons/BeeIcon";
import { HoneycombPattern } from "../../features/auth/components/icons/HoneycombPattern";
import {
  IconAlert,
  IconBox,
  IconChart,
  IconHome,
  IconIn,
  IconOut,
  IconStack,
} from "../../shared/components/icons/NavIcons";

const links = [
  { to: "/dashboard", end: true, label: "Inicio", icon: IconHome },
  { to: "/dashboard/products", label: "Productos", icon: IconBox },
  { to: "/dashboard/inventory", label: "Inventario", icon: IconStack },
  { to: "/dashboard/entries", label: "Entradas", icon: IconIn },
  { to: "/dashboard/outputs", label: "Salidas", icon: IconOut },
  { to: "/dashboard/alerts", label: "Alertas", icon: IconAlert },
  { to: "/dashboard/reports", label: "Reportes", icon: IconChart },
];

export const Sidebar = ({ onNavigate }) => (
  <aside className="relative flex h-full w-64 flex-col overflow-hidden border-r border-pollen/20 bg-cacao-ink text-cream-comb">
    <div className="pointer-events-none absolute inset-0 text-honey-nectar/5" aria-hidden="true">
      <HoneycombPattern className="h-full w-full" />
    </div>

    <div className="relative z-10 flex items-center gap-3 overflow-hidden border-b border-pollen/20 px-5 py-5">
      <div className="pointer-events-none absolute inset-0 text-honey-nectar/10" aria-hidden="true">
        <HoneycombPattern className="h-full w-full" />
      </div>
      <BeeIcon className="relative h-10 w-10 text-honey-nectar" animate={false} />
      <div className="relative">
        <p className="font-display text-xl font-bold text-brand-shadow">BeeHive</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-pollen">
          Colmena de control
        </p>
      </div>
    </div>

    <nav className="relative z-10 flex flex-1 flex-col gap-1 p-3">
      {links.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] transition",
              isActive
                ? "bg-honey-nectar text-cacao-ink"
                : "text-cream-comb/85 hover:bg-honeycomb hover:text-cream-comb",
            ].join(" ")
          }
        >
          <Icon className="h-5 w-5 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
