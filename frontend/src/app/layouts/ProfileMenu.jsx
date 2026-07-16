import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { EditProfileModal } from "../../features/auth/components/EditProfileModal";
import { BeeIcon } from "../../features/auth/components/icons/BeeIcon";

export const ProfileMenu = () => {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-pollen/30 bg-cream-comb/60 py-1 pl-1 pr-3 transition hover:border-honey-nectar"
      >
        {user?.profilePicture && !imgError ? (
          <img
            src={user.profilePicture}
            alt="Foto de perfil"
            onError={() => setImgError(true)}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <BeeIcon className="h-8 w-8 text-honey-nectar" animate={false} />
        )}
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight">{user?.username || "Admin"}</p>
          <p className="text-[10px] uppercase tracking-wider text-honeycomb">
            {user?.role || "ADMIN"}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-xl border border-pollen/25 bg-cream-comb shadow-lg"
          >
            <button
              type="button"
              onClick={() => {
                setEditOpen(true);
                setOpen(false);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-cacao-ink transition hover:bg-honey-nectar/20"
            >
              Editar perfil
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-danger transition hover:bg-danger/10"
            >
              Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
    </div>
  );
};
