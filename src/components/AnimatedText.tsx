import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";

type AnimatedTextProps = {
  lines: string[];
  className?: string;
  highlightLines?: string[];
  as?: ElementType;
};

export function AnimatedText({
  lines,
  className = "",
  highlightLines = [],
  as: Component = "div",
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Component className={className}>
      {lines.map((line, index) => (
        <div className="overflow-hidden" key={line}>
          <motion.span
            className={`block ${highlightLines.includes(line) ? "text-pink" : ""}`}
            initial={reduceMotion ? false : { y: "115%", rotate: index % 2 ? -1.5 : 1.5 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.8,
              delay: reduceMotion ? 0 : 0.12 + index * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </div>
      ))}
    </Component>
  );
}
