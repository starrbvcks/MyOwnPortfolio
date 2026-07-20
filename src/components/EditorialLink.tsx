import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type EditorialLinkProps = HTMLMotionProps<"a"> & {
  children: ReactNode;
  variant?: "solid" | "outline" | "dark";
};

const styles = {
  solid: "border-pink bg-pink text-ink hover:bg-pink-strong",
  outline: "border-bone text-bone hover:border-pink hover:text-pink",
  dark: "border-ink text-ink hover:bg-ink hover:text-pink",
};

export function EditorialLink({
  children,
  className = "",
  variant = "solid",
  ...props
}: EditorialLinkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      className={`editorial-focus inline-flex min-h-11 items-center justify-center border-2 px-5 py-3 font-sans text-[0.82rem] font-black uppercase tracking-[0.1em] transition-colors ${styles[variant]} ${className}`}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
