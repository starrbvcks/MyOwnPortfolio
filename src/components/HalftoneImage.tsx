import { motion, useReducedMotion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { GrainOverlay } from "./GrainOverlay";

type HalftoneImageProps = {
  imageX?: MotionValue<number>;
  imageY?: MotionValue<number>;
};

export function HalftoneImage({ imageX, imageY }: HalftoneImageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[23rem] sm:max-w-[25rem] lg:max-w-[27rem]"
      style={reduceMotion ? undefined : { x: imageX, y: imageY }}
      initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ delay: 0.2, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative rotate-[-0.35deg] rounded-md border border-bone/45 bg-carbon/80 p-2.5 shadow-[0_22px_70px_rgba(0,0,0,0.26)] sm:p-3">
        <div className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-bone/25 bg-ink">
          <img
            src="/images/MeWeb.png"
            alt="Portrait of Setareh with a dark pink editorial image treatment"
            width="1130"
            height="1412"
            className="h-full w-full object-cover grayscale contrast-110 transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-pink/14 mix-blend-multiply transition-colors duration-500 group-hover:bg-pink/28" />
          <div aria-hidden="true" className="absolute inset-0 bg-halftone bg-[length:12px_12px] opacity-20 mix-blend-screen" />
          <GrainOverlay className="absolute inset-0 opacity-12" />
        </div>
      </div>

      <div className="absolute left-4 top-4 rounded-sm border border-pink/70 bg-ink/78 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-pink-light backdrop-blur sm:left-5">
        Portfolio / 2026
      </div>
    </motion.div>
  );
}
