import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

import { PinkStar } from "../PinkStar";

type FallingStarProps = {
  progress: MotionValue<number>;
  x: MotionValue<number>;
};

export function FallingStar({ progress, x }: FallingStarProps) {
  const reduceMotion = useReducedMotion();
  const top = useTransform(progress, [0, 1], ["12vh", "84vh"]);
  const opacity = useTransform(progress, [0, 0.05, 0.9, 1], [1, 1, 1, 0]);
  const scale = useTransform(progress, [0, 1], [0.92, 1.2]);
  const rotate = useTransform(progress, [0, 1], [-12, 30]);
  const trailScale = useTransform(progress, [0, 0.15, 1], [0, 0.24, 1]);
  const trailOpacity = useTransform(progress, [0, 0.18, 0.86, 1], [0, 0.75, 0.42, 0]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 -translate-x-1/2"
      style={reduceMotion ? { left: "50%", top: "12vh" } : { left: x, top, opacity, scale, rotate }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-[56vh] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full bg-pink/70 shadow-[0_0_26px_rgba(255,59,157,0.55)]"
        style={reduceMotion ? { opacity: 0 } : { scaleY: trailScale, opacity: trailOpacity }}
      />
      <PinkStar
        size="xl"
        animated={false}
        className="h-[30vmin] min-h-36 w-[30vmin] min-w-36 max-w-[22rem] drop-shadow-[0_0_34px_rgba(255,59,157,0.54)] sm:h-[24vmin] sm:w-[24vmin]"
      />
    </motion.div>
  );
}
