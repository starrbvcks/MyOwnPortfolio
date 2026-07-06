import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

type StarRevealMaskProps = {
  progress: MotionValue<number>;
};

export function StarRevealMask({ progress }: StarRevealMaskProps) {
  const reduceMotion = useReducedMotion();
  const clipPath = useTransform(progress, (value) => `inset(${Math.min(100, value * 108)}% 0% 0% 0%)`);
  const top = useTransform(progress, [0, 1], ["12vh", "84vh"]);
  const opacity = useTransform(progress, [0, 0.12, 0.82, 1], [0, 0.78, 0.5, 0]);
  const scaleX = useTransform(progress, [0, 0.45, 1], [0.16, 0.64, 1]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-ink"
        style={reduceMotion ? { clipPath: "inset(100% 0% 0% 0%)" } : { clipPath }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-0 right-0 z-20 h-[5px] bg-pink shadow-[0_0_34px_rgba(255,59,157,0.55)]"
        style={reduceMotion ? { opacity: 0 } : { top, opacity, scaleX }}
      />
    </>
  );
}
