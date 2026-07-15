import { motion, useReducedMotion } from "motion/react";
import { BeeIcon } from "./icons/BeeIcon";

export const AuthBrandMark = ({ subtitle = "Inventario que trabaja como colmena" }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="mb-8 flex flex-col items-center text-center"
      initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <BeeIcon className="mb-3 h-14 w-14 text-honey-nectar" />
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-cream-comb text-brand-shadow md:text-5xl">
        InvenTech
      </h1>
      <p className="mt-2 max-w-xs text-xs font-semibold uppercase tracking-[0.2em] text-pollen">
        {subtitle}
      </p>
    </motion.div>
  );
};
