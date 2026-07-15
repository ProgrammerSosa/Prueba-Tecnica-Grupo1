import { motion, useReducedMotion } from "motion/react";
import { HoneycombPattern } from "./icons/HoneycombPattern";
import { AuthBrandMark } from "./AuthBrandMark";

export const AuthShell = ({
  children,
  subtitle = "Inventario que trabaja como colmena",
  panelMaxWidth = "max-w-md",
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cacao-ink px-4 py-10">
      <div className="pointer-events-none absolute inset-0 text-honey-nectar/10" aria-hidden="true">
        <HoneycombPattern className="h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-honey-nectar/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-sky-trace/10 blur-3xl"
        aria-hidden="true"
      />

      <div className={`relative z-10 w-full ${panelMaxWidth}`}>
        <AuthBrandMark subtitle={subtitle} />
        <motion.div
          className="rounded-2xl border border-pollen/30 bg-cream-comb p-6 text-cacao-ink shadow-md md:p-8"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
