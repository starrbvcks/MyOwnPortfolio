import { motion, useReducedMotion } from "framer-motion";

type PinkStarProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  rotation?: number;
  animated?: boolean;
  decorative?: boolean;
};

const sizes = {
  sm: "h-8 w-8",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-32 w-32",
};

export function PinkStar({
  className = "",
  size = "md",
  rotation = 0,
  animated = true,
  decorative = true,
}: PinkStarProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden={decorative ? "true" : undefined}
      className={`${sizes[size]} ${className}`}
      initial={{ rotate: rotation }}
      animate={!animated || reduceMotion ? { rotate: rotation } : { rotate: rotation + 360 }}
      transition={{ duration: 22, ease: "linear", repeat: Infinity }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full fill-pink">
        <path d="M50 0 59 35 95 15 75 50 100 75 63 65 50 100 37 65 0 75 25 50 5 15 41 35Z" />
      </svg>
    </motion.div>
  );
}
