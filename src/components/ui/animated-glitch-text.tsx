import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlitchTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textClassName?: string;
  containerClassName?: string;
  colors?: {
    red: string;
    green: string;
    blue: string;
  };
}

const GlitchText = React.forwardRef<HTMLDivElement, GlitchTextProps>(
  (
    {
      text,
      as: Component = "h1",
      className,
      textClassName,
      containerClassName,
      colors = {
        red: "#ff3b9d",
        green: "#ffc2dc",
        blue: "#f5f2f3",
      },
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();

    const baseLayerClassName = cn(
      "font-bold uppercase tracking-[0.12em]",
      "mix-blend-screen",
      textClassName,
    );

    return (
      <div ref={ref} className={cn("inline-flex items-center", className)} {...props}>
        <div className={cn("relative inline-block", containerClassName)}>
          <motion.div
            aria-hidden="true"
            className={cn("absolute inset-0", baseLayerClassName)}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [-1, 1, -1],
                    y: [0, -0.5, 0.5],
                    skewX: [0, -0.7, 0.7],
                    opacity: [0.65, 0.42, 0.58],
                    color: [colors.red, colors.red, colors.red],
                  }
            }
            transition={{ duration: 0.45, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          >
            {text}
          </motion.div>
          <motion.div
            aria-hidden="true"
            className={cn("absolute inset-0", baseLayerClassName)}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [1, -1, 1],
                    y: [0.5, -0.5, 0],
                    skewX: [-0.7, 0.7, 0],
                    opacity: [0.4, 0.62, 0.45],
                    color: [colors.green, colors.green, colors.green],
                  }
            }
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          >
            {text}
          </motion.div>
          <Component className={cn("relative", baseLayerClassName)}>{text}</Component>
        </div>
      </div>
    );
  },
);

GlitchText.displayName = "GlitchText";

export { GlitchText };
