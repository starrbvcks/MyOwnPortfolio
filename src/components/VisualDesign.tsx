import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { visualDesignItems } from "../content";
import { API_BASE, assetUrl, slugify } from "../lib/assets";

type VisualDesignItem = {
  title: string;
  category: string;
  year: string;
  note: string;
  image: string;
  images?: string[];
  imageAlt: string;
  variant: string;
};

function itemImages(item: VisualDesignItem) {
  const images = item.images?.filter(Boolean) ?? [];
  return (images.length > 0 ? images : [item.image].filter(Boolean)).map(assetUrl);
}

type VisualContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: VisualDesignItem[];
};

const fallbackVisual: VisualContent = {
  eyebrow: "05 / Visual Design",
  title: "Beyond the Browser",
  description: "",
  items: [...visualDesignItems],
};

export function VisualDesign() {
  const reduceMotion = useReducedMotion();
  const [visual, setVisual] = useState<VisualContent>(fallbackVisual);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE}/api/content`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((content) => {
        if (!content?.visual) return;
        setVisual({
          eyebrow: content.visual.eyebrow || fallbackVisual.eyebrow,
          title: content.visual.title || fallbackVisual.title,
          description: content.visual.description || fallbackVisual.description,
          items: Array.isArray(content.visual.items) && content.visual.items.length > 0
            ? content.visual.items
            : fallbackVisual.items,
        });
      })
      .catch(() => {
        setVisual(fallbackVisual);
      });

    return () => controller.abort();
  }, []);

  return (
    <section id="visual" className="border-b-2 border-bone/15 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-pink">
              {visual.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-[clamp(3rem,7.6vw,6.8rem)] font-extrabold uppercase leading-[1] tracking-normal text-bone">
              {visual.title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visual.items.map((item, index) => {
            const isDark = item.variant === "dark";
            const images = itemImages(item);

            return (
              <motion.article
                className={`group relative flex min-h-[22rem] cursor-pointer flex-col overflow-hidden border ${
                  isDark
                      ? "border-pink/60 bg-ink text-bone"
                      : "border-bone/30 bg-carbon/90 text-bone"
                }`}
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                whileHover={reduceMotion ? undefined : { scale: 1.015 }}
                transition={{ duration: reduceMotion ? 0 : 0.38, delay: index * 0.04 }}
                key={item.title}
                role="link"
                tabIndex={0}
                onClick={() => {
                  window.location.hash = `visual/${slugify(item.title)}`;
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    window.location.hash = `visual/${slugify(item.title)}`;
                  }
                }}
              >
                {images.length > 0 ? (
                  <div className="relative m-3 min-h-[18rem] overflow-hidden rounded-md border border-bone/15">
                    <img
                      src={images[0]}
                      alt={item.imageAlt}
                      width="900"
                      height="700"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover grayscale contrast-110 transition duration-500 group-hover:scale-[1.025] group-hover:grayscale-0"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-ink/30 transition-colors group-hover:bg-pink/18" />
                    <div aria-hidden="true" className="absolute inset-0 bg-halftone bg-[length:12px_12px] opacity-15 mix-blend-screen" />
                    {images.length > 1 ? (
                      <span className="absolute bottom-3 right-3 border border-bone/20 bg-ink/78 px-2.5 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-bone">
                        {String(images.length).padStart(2, "0")} images
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <div aria-hidden="true" className="m-3 min-h-[18rem] rounded-md border border-bone/15 bg-halftone bg-[length:12px_12px] opacity-20" />
                )}

                <div className="relative z-10 flex flex-1 flex-col justify-between px-5 pb-5 pt-2">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-pink-light">
                    {item.category} / {item.year}
                  </p>
                  <div className="mt-10">
                    <h3 className="font-display text-[clamp(1.8rem,3.4vw,3.4rem)] font-extrabold uppercase leading-[1.02] tracking-normal">
                      {item.title}
                    </h3>
                    <p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.14em] text-pink-light">
                      Open Project -&gt;
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
