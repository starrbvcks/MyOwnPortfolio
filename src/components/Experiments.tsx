import { motion, useReducedMotion } from "framer-motion";
import { experiments } from "../content";
import { PinkStar } from "./PinkStar";

export function Experiments() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="playground"
      className="relative overflow-hidden border-b-2 border-bone/15 bg-carbon px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-12 max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-pink">
            04 / Playground / Creative Experiments
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.55rem,6.7vw,5.9rem)] font-extrabold uppercase leading-[1.02] tracking-normal text-bone">
            Things I made because I couldn't leave the idea alone.
          </h2>
          <PinkStar className="absolute -right-10 -top-10 hidden opacity-55 lg:block" size="lg" rotation={14} />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {experiments.map((item, index) => (
            <motion.article
              className="group relative flex min-h-[20rem] flex-col justify-between overflow-hidden border-2 border-bone/70 bg-ink p-5 transition-colors hover:border-pink"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: index * 0.04 }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              key={item.title}
            >
              <div aria-hidden="true" className="absolute right-4 top-4 h-20 w-20 border-2 border-pink/40 bg-halftone bg-[length:8px_8px] opacity-40" />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-pink">
                  {item.number} / {item.year}
                </p>
                <h3 className="mt-10 max-w-sm font-display text-[clamp(1.75rem,4vw,2.7rem)] font-extrabold uppercase leading-[1.04] tracking-normal text-bone">
                  {item.title}
                </h3>
                <div className="mt-6 flex flex-wrap gap-2 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted">
                  <span className="border border-bone/20 px-2 py-1">{item.type}</span>
                  <span className="border border-pink/40 px-2 py-1 text-pink-light">
                    {item.technology}
                  </span>
                </div>
              </div>
              <p className="mt-5 max-w-md leading-7 text-muted transition-colors group-hover:text-bone">
                {item.note}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
