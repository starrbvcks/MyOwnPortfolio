import { motion, useReducedMotion } from "framer-motion";

type HandDrawnUnderlineProps = {
  active?: boolean;
  className?: string;
};

export function HandDrawnUnderline({
  active = false,
  className = "",
}: HandDrawnUnderlineProps) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute -bottom-2 left-0 h-3 w-full overflow-visible ${className}`}
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M2 7 C18 2, 34 11, 50 6 S82 3, 118 7"
        fill="none"
        stroke="#FF3B9D"
        strokeLinecap="round"
        strokeWidth="2.2"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
      />
    </svg>
  );
}
