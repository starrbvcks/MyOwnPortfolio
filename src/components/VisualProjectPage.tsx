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

const fallbackItems: VisualDesignItem[] = [...visualDesignItems];

function itemImages(item: VisualDesignItem) {
  const images = item.images?.filter(Boolean) ?? [];
  return (images.length > 0 ? images : [item.image].filter((image): image is string => Boolean(image))).map(assetUrl);
}

export function VisualProjectPage({ slug }: { slug: string }) {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<VisualDesignItem[]>(fallbackItems);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE}/api/content`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((content) => {
        if (Array.isArray(content?.visual?.items) && content.visual.items.length > 0) {
          setItems(content.visual.items);
        }
      })
      .catch(() => setItems(fallbackItems));

    return () => controller.abort();
  }, []);

  const project = items.find((item) => slugify(item.title) === slug) ?? items[0];
  const images = project ? itemImages(project) : [];

  if (!project) return null;

  return (
    <main className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          className="border border-bone/30 px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-bone transition hover:border-pink hover:text-pink"
          onClick={() => {
            window.location.hash = "visual";
          }}
        >
          ← Back
        </button>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_0.55fr] lg:items-start">
          <motion.div
            className="grid gap-4"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          >
            {images.length > 0 ? (
              images.map((image, index) => (
                <img
                  src={image}
                  alt={index === 0 ? project.imageAlt : ""}
                  className="w-full border-2 border-bone/35 object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  key={`${image}-${index}`}
                />
              ))
            ) : (
              <div className="min-h-[28rem] border-2 border-bone/35 bg-halftone bg-[length:12px_12px] opacity-70" />
            )}
          </motion.div>

          <aside className="lg:sticky lg:top-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-pink">
              {project.category} / {project.year}
            </p>
            <h1 className="mt-5 font-display text-[clamp(3rem,8vw,7rem)] font-extrabold uppercase leading-[0.95] tracking-normal text-bone">
              {project.title}
            </h1>
            <p className="mt-6 border-l-4 border-pink pl-5 text-lg leading-8 text-muted">
              {project.note}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
