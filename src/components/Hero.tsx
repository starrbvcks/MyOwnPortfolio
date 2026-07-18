import { type MouseEvent, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { AnimatedText } from "./AnimatedText";
import { siteMeta } from "../content";
import { GrainOverlay } from "./GrainOverlay";
import { HalftoneImage } from "./HalftoneImage";
import { PinkStar } from "./PinkStar";
import { EditorialLink } from "./EditorialLink";

function OrbitalLines() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      aria-hidden="true"
      className="absolute -right-6 top-24 hidden h-32 w-32 text-pink/55 lg:block"
      viewBox="0 0 220 220"
      fill="none"
      animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 2, 0] }}
      transition={{ duration: reduceMotion ? 0 : 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M22 102C45 36 129 16 181 55C225 88 194 158 137 180C78 203 9 166 22 102Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M51 128C65 75 126 45 169 76C199 98 184 145 143 162C98 181 39 169 51 128Z"
        stroke="currentColor"
        strokeDasharray="7 9"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </motion.svg>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [canParallax, setCanParallax] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24 });
  const imageX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const imageY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const starX = useTransform(smoothX, [-1, 1], [10, -10]);
  const starY = useTransform(smoothY, [-1, 1], [8, -8]);

  useEffect(() => {
    if (reduceMotion) return;
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    const hasHover = window.matchMedia("(hover: hover)").matches;
    setCanParallax(pointerFine && hasHover);
  }, [reduceMotion]);

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    if (!canParallax) return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="home"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative min-h-[100svh] overflow-hidden border-b-2 border-bone/15 bg-ink px-4 pb-14 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8"
    >
      <GrainOverlay className="absolute inset-0 opacity-[0.11]" />
      <div className="absolute inset-x-0 top-0 h-px bg-pink/40" />
      <div className="editorial-grid absolute inset-0 opacity-35" />

      <div className="mx-auto grid max-w-7xl gap-10 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center xl:gap-14">
        <div className="relative order-2 lg:order-1">
          <motion.div style={reduceMotion ? undefined : { x: starX, y: starY }}>
            <PinkStar
              className="absolute right-3 top-3 z-10 opacity-85 sm:right-8 lg:right-4 lg:top-6"
              size="md"
              rotation={-8}
            />
          </motion.div>
          <OrbitalLines />
          <HalftoneImage imageX={canParallax ? imageX : undefined} imageY={canParallax ? imageY : undefined} />
        </div>

        <div className="group/heroText relative order-1 z-10 lg:order-2">
          <motion.p
            className="mb-5 inline-block max-w-md border-2 border-pink px-3 py-2 font-mono text-[0.68rem] uppercase leading-5 tracking-[0.1em] text-pink-light transition-all duration-300 ease-out group-hover/heroText:-translate-y-2 group-hover/heroText:translate-x-4 group-hover/heroText:-rotate-1 group-hover/heroText:border-pink-light group-hover/heroText:text-bone"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    x: 8,
                    y: -3,
                    rotate: -0.6,
                    borderColor: "#FFC2DC",
                    color: "#F5F2F3",
                  }
            }
            transition={{ delay: 0.18, duration: 0.45 }}
          >
            Setareh means star. Made to stand out in the dark.
          </motion.p>

          <div className="relative">
            <PinkStar
              className="absolute -right-2 -top-4 hidden opacity-70 sm:block"
              size="sm"
              rotation={18}
            />
            <AnimatedText
              as="h1"
              lines={["DESIGN.", "CODE.", "CHARACTER."]}
              highlightLines={["CODE."]}
              interactive
              lineClassName="transition-transform duration-300 ease-out group-hover/heroText:-translate-y-1 group-hover/heroText:translate-x-5 group-hover/heroText:-rotate-1"
              className="max-w-[54rem] font-sans text-[clamp(2.65rem,16vw,6.8rem)] font-extrabold uppercase leading-[1.02] tracking-normal text-bone [overflow-wrap:anywhere] sm:text-[clamp(3.8rem,10vw,6.8rem)] lg:text-[clamp(4.3rem,6.45vw,6.9rem)] xl:text-[clamp(5rem,6.6vw,7.2rem)]"
            />
          </div>

          <motion.p
            className="mt-6 max-w-2xl border-l-4 border-pink pl-5 text-base leading-8 text-muted transition-all duration-300 ease-out group-hover/heroText:-translate-y-1 group-hover/heroText:translate-x-4 group-hover/heroText:text-bone sm:text-lg lg:max-w-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    x: 10,
                    y: -2,
                    color: "#F5F2F3",
                    borderColor: "#FF3B9D",
                  }
            }
            transition={{ delay: 0.72, duration: 0.5 }}
          >
            Web Designer & Web Developer creating bold and
            memorable digital experiences.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.86, duration: 0.45 }}
          >
            <EditorialLink href="#work">View Selected Work</EditorialLink>
            <EditorialLink href="#contact" variant="outline">
              Let's Talk
            </EditorialLink>
          </motion.div>

          <motion.div
            className="mt-10 flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.4 }}
          >
            <motion.span
              className="h-10 w-px bg-pink"
              animate={reduceMotion ? undefined : { scaleY: [0.45, 1, 0.45] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            Scroll & Explore
          </motion.div>
        </div>
      </div>
    </section>
  );
}
