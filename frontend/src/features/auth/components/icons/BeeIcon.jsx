import { motion, useReducedMotion } from "motion/react";

export const BeeIcon = ({ className = "h-16 w-16", animate = true }) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abeja InvenTech"
    >
      <motion.g
        style={{ transformOrigin: "22px 40px" }}
        animate={
          shouldAnimate
            ? { rotate: [-18, 18, -18], y: [0, -1, 0] }
            : undefined
        }
        transition={
          shouldAnimate
            ? { duration: 0.28, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <ellipse
          cx="18"
          cy="38"
          rx="14"
          ry="8"
          fill="currentColor"
          className="text-sky-trace"
          opacity="0.85"
        />
      </motion.g>

      <motion.g
        style={{ transformOrigin: "58px 40px" }}
        animate={
          shouldAnimate
            ? { rotate: [18, -18, 18], y: [0, -1, 0] }
            : undefined
        }
        transition={
          shouldAnimate
            ? { duration: 0.28, repeat: Infinity, ease: "easeInOut", delay: 0.05 }
            : undefined
        }
      >
        <ellipse
          cx="62"
          cy="38"
          rx="14"
          ry="8"
          fill="currentColor"
          className="text-sky-trace"
          opacity="0.85"
        />
      </motion.g>

      <ellipse cx="40" cy="44" rx="14" ry="18" fill="currentColor" className="text-honey-nectar" />
      <path
        d="M28 34 C32 30 48 30 52 34 L52 38 C46 34 34 34 28 38 Z"
        fill="currentColor"
        className="text-cacao-ink"
      />
      <path
        d="M28 44 H52"
        stroke="currentColor"
        className="text-cacao-ink"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M29 52 H51"
        stroke="currentColor"
        className="text-cacao-ink"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="34" cy="28" r="3.2" fill="currentColor" className="text-cacao-ink" />
      <circle cx="46" cy="28" r="3.2" fill="currentColor" className="text-cacao-ink" />
      <path
        d="M34 22 C32 14 28 12 26 10"
        stroke="currentColor"
        className="text-cacao-ink"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M46 22 C48 14 52 12 54 10"
        stroke="currentColor"
        className="text-cacao-ink"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M40 62 C40 68 38 72 36 74"
        stroke="currentColor"
        className="text-pollen"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
