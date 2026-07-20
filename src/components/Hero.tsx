import { type MouseEvent, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { siteMeta } from "../content";
import { AnimatedText } from "./AnimatedText";
import { GrainOverlay } from "./GrainOverlay";
import { HalftoneImage } from "./HalftoneImage";
import { PinkStar } from "./PinkStar";
import { EditorialLink } from "./EditorialLink";
import { Typewriter } from "./ui/typewriter";

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

      <div className="mx-auto grid max-w-7xl gap-10 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[0.78fr_1.22fr] lg:items-center xl:gap-16">
        <div className="relative order-2 lg:order-1 lg:-translate-y-3">
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

        <div className="group/heroText relative order-1 z-10 max-w-3xl lg:order-2">
          <motion.div
            className="mb-5 transition-all duration-300 ease-out group-hover/heroText:translate-x-2"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={reduceMotion ? undefined : { x: 6 }}
            transition={{ delay: 0.18, duration: 0.45 }}
          >
            <Typewriter
              as="p"
              text="Setareh means star. Made to stand out in the dark."
              loop
              speed={42}
              initialDelay={0}
              waitTime={3000}
              respectReducedMotion={false}
              cursorChar="_"
              cursorClassName="ml-1 text-pink"
              className="font-mono text-xs leading-6 text-pink-light"
            />
          </motion.div>

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
              lineClassName="transition-transform duration-300 ease-out group-hover/heroText:translate-x-2"
              className="max-w-[46rem] font-sans text-[clamp(2.55rem,13vw,5.4rem)] font-extrabold uppercase leading-[1.04] tracking-normal text-bone [overflow-wrap:anywhere] sm:text-[clamp(3.3rem,8.4vw,5.7rem)] lg:text-[clamp(3.8rem,5.35vw,5.8rem)] xl:text-[clamp(4.15rem,5.3vw,6.05rem)]"
            />
          </div>

          <motion.p
            className="mt-6 max-w-xl border-l-2 border-pink/80 pl-5 text-base leading-7 text-muted transition-all duration-300 ease-out group-hover/heroText:translate-x-2 group-hover/heroText:text-bone sm:text-[1.05rem]"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    x: 6,
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

        </div>
      </div>
    </section>
  );
}
