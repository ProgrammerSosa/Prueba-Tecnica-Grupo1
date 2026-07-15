import { motion, useReducedMotion } from "motion/react";
import { BeeIcon } from "./icons/BeeIcon";

export const AuthSubmitButton = ({
  loading,
  children,
  loadingLabel = "Cargando...",
  variant = "primary",
  className = "",
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const baseClass = variant === "secondary" ? "auth-btn-secondary" : "auth-btn-primary";

  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={!loading && !prefersReducedMotion ? { scale: 1.02 } : undefined}
      whileTap={!loading && !prefersReducedMotion ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.15 }}
      className={`${baseClass} flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {loading && (
        <motion.span
          className="inline-block h-4 w-4 shrink-0"
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 1, repeat: Infinity, ease: "linear" }
          }
        >
          <BeeIcon className="h-4 w-4" animate={false} />
        </motion.span>
      )}
      {loading ? loadingLabel : children}
    </motion.button>
  );
};
