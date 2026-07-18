import { motion, useReducedMotion } from "framer-motion";
import { siteMeta } from "../content";
import { GrainOverlay } from "./GrainOverlay";

const aboutLines = [
  "I design and build web experiences from first visual direction to final responsive details.",
  "I like interfaces with a strong point of view, but the path through them still has to feel clear.",
  "I pay attention to typography, rhythm, image treatment, interaction states, and the parts people notice only when they break.",
  "My work sits between visual identity and front-end implementation, which helps ideas survive the trip from Figma to browser.",
];

export function AboutPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="relative overflow-hidden border-b-2 border-bone/15 bg-carbon px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <GrainOverlay className="absolute inset-0 opacity-[0.08]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-pink">
            002 / Who's She
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-[clamp(3rem,8vw,6.8rem)] font-extrabold uppercase leading-[1] tracking-normal text-bone">
            Who's She?
          </h2>
          <div className="mt-7 h-1 w-40 bg-pink" />
          <h3 className="mt-8 max-w-3xl font-display text-[clamp(1.8rem,3.6vw,3.4rem)] font-extrabold uppercase leading-[1.04] tracking-normal text-pink">
            A designer who can carry an idea into code.
          </h3>
        </motion.div>

        <motion.div
          className="border-4 border-bone bg-ink p-5 transition-colors hover:border-pink sm:p-7 lg:p-9"
          initial={reduceMotion ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.08 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-pink-light">
            {siteMeta.discipline.replace("WEB DEVELOPMENT", "VISUAL DIRECTION")}
          </p>
          <div className="mt-7 grid gap-4">
            {aboutLines.map((line) => (
              <p
                className="border-l-4 border-pink/70 pl-4 text-lg leading-8 text-bone sm:text-xl"
                key={line}
              >
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
