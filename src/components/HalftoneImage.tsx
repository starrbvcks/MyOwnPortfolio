import { motion, useReducedMotion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { siteMeta } from "../content";
import { GrainOverlay } from "./GrainOverlay";

type HalftoneImageProps = {
  imageX?: MotionValue<number>;
  imageY?: MotionValue<number>;
};

export function HalftoneImage({ imageX, imageY }: HalftoneImageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[30rem] lg:max-w-none"
      style={reduceMotion ? undefined : { x: imageX, y: imageY }}
      initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ delay: 0.2, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative rotate-[-0.6deg] border-[4px] border-bone bg-carbon p-3 sm:p-4">
        <div className="group relative aspect-[4/5] overflow-hidden border-2 border-bone bg-ink torn-edge">
          <img
            src="/images/MeWeb.png"
            alt="Portrait of Setareh with a dark pink editorial image treatment"
            width="1130"
            height="1412"
            className="h-full w-full object-cover grayscale contrast-125 transition duration-700 group-hover:scale-[1.035] group-hover:grayscale-0"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-pink/20 mix-blend-multiply transition-colors duration-500 group-hover:bg-pink/45" />
          <div aria-hidden="true" className="absolute inset-0 bg-halftone bg-[length:9px_9px] opacity-45 mix-blend-screen" />
          <GrainOverlay className="absolute inset-0 opacity-18" />
        </div>
      </div>

      <div className="absolute left-3 top-5 border-2 border-pink bg-ink px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-pink-light sm:left-4">
        Portfolio / {siteMeta.year}
      </div>
      <div className="absolute bottom-4 left-3 border-2 border-bone bg-pink px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink sm:left-4">
        {siteMeta.serviceLabel}
      </div>
    </motion.div>
  );
}
