import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { IconMenu } from "../../shared/components/icons/NavIcons";

export const Topbar = ({ onOpenSidebar }) => {
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    window.location.href = "/";
  };

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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pollen">
            Panel administrativo
          </p>
          <p className="font-display text-lg font-bold">
            Inventario que trabaja como colmena
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{user?.username || "Admin"}</p>
          <p className="text-xs uppercase tracking-wider text-pollen">
            {user?.role || "ADMIN"}
          </p>
        </div>
        <button type="button" onClick={handleLogout} className="panel-btn-danger">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};
