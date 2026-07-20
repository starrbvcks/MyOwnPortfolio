import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { experiments } from "../content";
import { PinkStar } from "./PinkStar";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8011";

type ExperimentItem = (typeof experiments)[number];

type EditableExperimentItem = ExperimentItem & {
  image?: string;
  images?: string[];
  imageAlt?: string;
};

type PlaygroundContent = {
  eyebrow: string;
  title: string;
  items: EditableExperimentItem[];
};

const fallbackPlayground: PlaygroundContent = {
  eyebrow: "04 / Playground / Creative Experiments",
  title: "Things I made because I couldn't leave the idea alone.",
  items: [...experiments],
};

function assetUrl(value: string) {
  return value.startsWith("/uploads/") ? `${API_BASE}${value}` : value;
}

function itemImages(item: EditableExperimentItem) {
  const images = item.images?.filter(Boolean) ?? [];
  return (images.length > 0 ? images : [item.image].filter((image): image is string => Boolean(image))).map(assetUrl);
}

export function Experiments() {
  const reduceMotion = useReducedMotion();
  const [playground, setPlayground] = useState<PlaygroundContent>(fallbackPlayground);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE}/api/content`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((content) => {
        if (!content?.playground) return;
        setPlayground({
          eyebrow: content.playground.eyebrow || fallbackPlayground.eyebrow,
          title: content.playground.title || fallbackPlayground.title,
          items: Array.isArray(content.playground.items) && content.playground.items.length > 0
            ? content.playground.items
            : fallbackPlayground.items,
        });
      })
      .catch(() => {
        setPlayground(fallbackPlayground);
      });

    return () => controller.abort();
  }, []);

  return (
    <section
      id="playground"
      className="relative overflow-hidden border-b-2 border-bone/15 bg-carbon px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-12 max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-pink">
            {playground.eyebrow}
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.25rem,5.4vw,4.8rem)] font-extrabold uppercase leading-[1.04] tracking-normal text-bone">
            {playground.title}
          </h2>
          <PinkStar className="absolute -right-10 -top-10 hidden opacity-55 lg:block" size="lg" rotation={14} />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {playground.items.map((item, index) => (
            <motion.article
              className="group relative flex min-h-[20rem] flex-col justify-between overflow-hidden border-2 border-bone/70 bg-ink transition-colors hover:border-pink"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: index * 0.04 }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              key={item.title}
            >
              {itemImages(item).length > 0 ? (
                <div className="relative min-h-[13rem] overflow-hidden border-b border-bone/20">
                  <img
                    src={itemImages(item)[0]}
                    alt={item.imageAlt || item.title}
                    className="absolute inset-0 h-full w-full object-cover grayscale contrast-125 transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    loading="lazy"
                    width="900"
                    height="650"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-ink/32 transition-colors group-hover:bg-ink/10" />
                  {itemImages(item).length > 1 ? (
                    <span className="absolute bottom-3 right-3 border border-bone/20 bg-ink/78 px-2.5 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-bone">
                      {String(itemImages(item).length).padStart(2, "0")} images
                    </span>
                  ) : null}
                </div>
              ) : (
                <div aria-hidden="true" className="absolute right-4 top-4 h-20 w-20 border-2 border-pink/40 bg-halftone bg-[length:8px_8px] opacity-40" />
              )}
              <div className="p-5">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-pink">
                  {item.number} / {item.year}
                </p>
                <h3 className="mt-8 max-w-sm font-display text-[clamp(1.75rem,4vw,2.7rem)] font-extrabold uppercase leading-[1.04] tracking-normal text-bone">
                  {item.title}
                </h3>
                <div className="mt-6 flex flex-wrap gap-2 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted">
                  <span className="border border-bone/20 px-2 py-1">{item.type}</span>
                  <span className="border border-pink/40 px-2 py-1 text-pink-light">
                    {item.technology}
                  </span>
                </div>
              </div>
              <p className="px-5 pb-5 leading-7 text-muted transition-colors group-hover:text-bone">
                {item.note}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
