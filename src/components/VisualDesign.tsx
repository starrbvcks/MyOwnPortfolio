import { motion, useReducedMotion } from "framer-motion";
import { visualDesignItems } from "../content";

export function VisualDesign() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="visual" className="border-b-2 border-bone/15 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-5 lg:grid-cols-[0.85fr_0.65fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-pink">
              05 / Visual Design
            </p>
            <h2 className="mt-4 font-display text-[clamp(3rem,7.6vw,6.8rem)] font-extrabold uppercase leading-[1] tracking-normal text-bone">
              Beyond the Browser
            </h2>
          </div>
          <p className="max-w-xl border-l-4 border-pink pl-5 text-lg leading-8 text-muted">
            Posters, identity fragments, typography studies and image systems
            that inform the interface work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visualDesignItems.map((item, index) => {
            const isPink = item.variant === "pink";
            const isDark = item.variant === "dark";

            return (
              <motion.article
                className={`group relative min-h-[22rem] overflow-hidden border-2 p-4 ${
                  isPink
                    ? "border-pink bg-pink text-ink"
                    : isDark
                      ? "border-pink bg-ink text-bone"
                      : "border-bone bg-carbon text-bone"
                }`}
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                whileHover={reduceMotion ? undefined : { scale: 1.015 }}
                transition={{ duration: reduceMotion ? 0 : 0.38, delay: index * 0.04 }}
                key={item.title}
              >
                {item.image ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      width="900"
                      height="700"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover grayscale contrast-125 transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-ink/42 transition-colors group-hover:bg-pink/35" />
                    <div aria-hidden="true" className="absolute inset-0 bg-halftone bg-[length:10px_10px] opacity-30 mix-blend-screen" />
                  </>
                ) : (
                  <div aria-hidden="true" className="absolute inset-0 bg-halftone bg-[length:12px_12px] opacity-30" />
                )}

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <p className={`font-mono text-xs uppercase tracking-[0.12em] ${isPink ? "text-ink/70" : "text-pink-light"}`}>
                    {item.category} / {item.year}
                  </p>
                  <div>
                    <h3 className="font-display text-[clamp(1.8rem,3.4vw,3.4rem)] font-extrabold uppercase leading-[1.02] tracking-normal">
                      {item.title}
                    </h3>
                    <p className={`mt-3 max-w-md text-sm leading-6 opacity-100 ${isPink ? "text-ink/75" : "text-bone/80"}`}>
                      {item.note}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
