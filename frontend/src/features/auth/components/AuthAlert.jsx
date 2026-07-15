import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export const AuthAlert = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {children && (
        <motion.div
          key={children}
          className="auth-error-box mb-4"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, x: [0, -6, 6, -4, 4, 0] }
          }
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
