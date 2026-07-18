import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";
import { SparklesText } from "./ui/sparkles-text";

type AnimatedTextProps = {
  lines: string[];
  className?: string;
  highlightLines?: string[];
  as?: ElementType;
  interactive?: boolean;
  lineClassName?: string;
};

export function AnimatedText({
  lines,
  className = "",
  highlightLines = [],
  as: Component = "div",
  interactive = false,
  lineClassName = "",
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Component className={`${className} ${interactive ? "cursor-default select-none" : ""}`}>
      {lines.map((line, index) => (
        <div className="overflow-hidden" key={line}>
          <motion.span
            className={`block ${lineClassName} ${highlightLines.includes(line) ? "text-pink" : ""}`}
            initial={reduceMotion ? false : { y: "115%", rotate: index % 2 ? -1.5 : 1.5 }}
            animate={
              interactive && !reduceMotion
                ? {
                    y: [0, -12, 0, 8, 0],
                    x: index % 2 === 0 ? [0, 18, 0, -10, 0] : [0, -18, 0, 10, 0],
                    rotate: index % 2 === 0 ? [0, -1.5, 0, 1, 0] : [0, 1.5, 0, -1, 0],
                    scale: [1, 1.018, 1, 1.01, 1],
                  }
                : { y: 0, x: 0, rotate: 0, scale: 1 }
            }
            transition={{
              duration: interactive ? 3.2 + index * 0.25 : 0.8,
              delay: reduceMotion ? 0 : 0.12 + index * 0.14,
              ease: [0.22, 1, 0.36, 1],
              repeat: interactive && !reduceMotion ? Infinity : 0,
              repeatType: "loop",
            }}
          >
            {interactive ? (
              <SparklesText
                text={line}
                sparklesCount={line === "CODE." ? 18 : 12}
                colors={{ first: "#FF3B9D", second: "#FFC2DC" }}
              />
            ) : (
              line
            )}
          </motion.span>
        </div>
      ))}
    </Component>
  );
}
