import { motion, useReducedMotion } from "motion/react";
import { BeeIcon } from "../../features/auth/components/icons/BeeIcon";

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-20 w-20",
};

export const BeeSpinner = ({ size = "md", label }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={sizeMap[size] || sizeMap.md}
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 1.1, repeat: Infinity, ease: "linear" }
        }
      >
        <BeeIcon className="h-full w-full text-honey-nectar" animate={!prefersReducedMotion} />
      </motion.div>
      {label && (
        <p className="font-display text-sm font-semibold text-current">{label}</p>
      )}
    </div>
  );
};
