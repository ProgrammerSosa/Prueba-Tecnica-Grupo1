import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { showError, showSuccess } from "../../../shared/utils/toast";
import { BeeIcon } from "./icons/BeeIcon";

export const EditProfileModal = ({ onClose }) => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setProfilePic(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profilePic) {
      showError("Selecciona una imagen antes de guardar.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", profilePic);

    const res = await useAuthStore.getState().updateProfilePicture(formData);
    if (res.success) {
      showSuccess("Foto de perfil actualizada.");
      onClose();
    } else {
      showError(res.error || "No se pudo actualizar la foto de perfil.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-cacao-ink/60 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-sm rounded-2xl border border-pollen/30 bg-cream-comb p-6 text-cacao-ink shadow-lg"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-4 font-display text-xl font-bold text-cacao-ink">
            Editar perfil
          </h2>

          <div className="mb-4 flex flex-col items-center gap-3">
            {previewUrl || user?.profilePicture ? (
              <img
                src={previewUrl || user?.profilePicture}
                alt="Foto de perfil"
                className="h-24 w-24 rounded-full border-2 border-honey-nectar object-cover"
              />
            ) : (
              <BeeIcon className="h-24 w-24 text-honey-nectar" animate={false} />
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="panel-label">Nueva foto de perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="panel-input file:mr-3 file:rounded-md file:border-0 file:bg-honey-nectar file:px-3 file:py-1 file:text-xs file:font-bold file:text-cacao-ink"
              />
            </div>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="panel-btn-ghost flex-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="panel-btn flex-1"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
