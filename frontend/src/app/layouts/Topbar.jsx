import { IconMenu } from "../../shared/components/icons/NavIcons";
import { ProfileMenu } from "./ProfileMenu";

export const Topbar = ({ onOpenSidebar }) => {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-pollen/20 bg-cream-comb px-4 py-3 text-cacao-ink md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-cacao-ink transition hover:bg-honey-nectar/20 lg:hidden"
          aria-label="Abrir menú"
        >
          <IconMenu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-honeycomb">
            Panel administrativo
          </p>
          <p className="font-display text-lg font-bold">
            Inventario que trabaja como colmena
          </p>
        </div>
      </div>

      <ProfileMenu />
    </header>
  );
};
