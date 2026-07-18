import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ProjectItem } from "../content";
import { EditorialButton } from "./EditorialButton";

type ProjectCardProps = {
  project: ProjectItem;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const isFeatured = project.variant === "featured";
  const isPink = project.variant === "pink";
  const detailsId = `${project.id}-details`;
  const galleryImages = useMemo(() => {
    const images = project.images?.filter(Boolean) ?? [];
    return images.length > 0 ? images : [project.image].filter(Boolean);
  }, [project.image, project.images]);
  const [activeImage, setActiveImage] = useState(0);
  const hasGallery = galleryImages.length > 1;
  const showManualPagination = galleryImages.length > 3;

  useEffect(() => {
    setActiveImage(0);
  }, [project.id, galleryImages.length]);

  useEffect(() => {
    if (!hasGallery || reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % galleryImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [galleryImages.length, hasGallery, reduceMotion]);

  return (
    <motion.article
      className={`project-card group relative overflow-hidden border-4 ${
        isPink
          ? "border-pink bg-pink text-ink"
          : "border-bone bg-carbon text-bone"
      } ${isFeatured ? "lg:grid lg:grid-cols-[1.15fr_0.85fr]" : "md:grid md:grid-cols-2"}`}
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      id={project.id}
    >
      <div
        className={`relative overflow-hidden ${
          isFeatured ? "min-h-[22rem] lg:min-h-[32rem]" : "min-h-[18rem]"
        } ${isPink ? "border-b-4 border-ink md:border-b-0 md:border-r-4" : "border-b-4 border-bone md:border-b-0 md:border-r-4"}`}
      >
        {galleryImages.map((image, imageIndex) => (
          <img
            src={image}
            alt={imageIndex === activeImage ? project.imageAlt : ""}
            aria-hidden={imageIndex !== activeImage}
            width="1200"
            height="900"
            loading={imageIndex === 0 ? "lazy" : "eager"}
            className={`absolute inset-0 h-full min-h-full w-full object-cover grayscale contrast-125 transition duration-700 group-hover:scale-[1.045] group-hover:contrast-150 ${
              imageIndex === activeImage ? "opacity-100" : "opacity-0"
            }`}
            key={image}
          />
        ))}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-500 ${
            isPink ? "bg-ink/25" : "bg-pink/18 mix-blend-multiply"
          }`}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-halftone bg-[length:9px_9px] opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-55" />
        <span
          className={`absolute left-4 top-4 border-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] ${
            isPink
              ? "border-ink bg-pink text-ink"
              : "border-pink bg-ink text-pink-light"
          }`}
        >
          {project.number} / {project.year}
        </span>
        {hasGallery ? (
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3">
            <div className={`border-2 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] ${
              isPink ? "border-ink bg-pink text-ink" : "border-pink bg-ink text-pink-light"
            }`}>
              {String(activeImage + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
            </div>
            {showManualPagination ? (
              <div className="flex gap-2">
                {galleryImages.map((_, imageIndex) => (
                  <button
                    type="button"
                    aria-label={`Show image ${imageIndex + 1}`}
                    aria-current={imageIndex === activeImage}
                    className={`h-3 w-8 border transition ${
                      imageIndex === activeImage
                        ? isPink ? "border-ink bg-ink" : "border-pink bg-pink"
                        : isPink ? "border-ink/50 bg-pink/70" : "border-bone/40 bg-ink/70"
                    }`}
                    onClick={() => setActiveImage(imageIndex)}
                    key={imageIndex}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex min-h-[20rem] flex-col justify-between p-5 sm:p-7 lg:p-9">
        <div>
          <p
            className={`font-mono text-xs uppercase tracking-[0.18em] ${
              isPink ? "text-ink/70" : "text-muted"
            }`}
          >
            {project.role}
          </p>
          <motion.h3
            className={`mt-4 font-display text-[clamp(2.35rem,5.8vw,5.4rem)] font-extrabold uppercase leading-[1] tracking-normal transition-colors ${
              isPink ? "text-ink" : "text-bone group-hover:text-pink"
            }`}
            whileHover={reduceMotion ? undefined : { x: 8 }}
          >
            {project.title}
          </motion.h3>
          <p className={`mt-3 text-xl font-bold ${isPink ? "text-ink" : "text-bone"}`}>
            {project.category}
          </p>
          <p className={`mt-5 max-w-xl leading-7 ${isPink ? "text-ink/76" : "text-muted"}`}>
            {project.description}
          </p>
          <dl className="mt-6 grid gap-3 text-left sm:grid-cols-3">
            {[
              ["Type", project.projectType],
              ["Status", project.status],
              ["Stack", project.technologies.slice(0, 2).join(" / ")],
            ].map(([label, value]) => (
              <div
                className={`border p-3 ${
                  isPink ? "border-ink/30" : "border-bone/20"
                }`}
                key={label}
              >
                <dt
                  className={`font-mono text-[0.62rem] uppercase tracking-[0.16em] ${
                    isPink ? "text-ink/60" : "text-pink-light"
                  }`}
                >
                  {label}
                </dt>
                <dd className="mt-2 text-sm font-bold leading-5">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <EditorialButton
          variant={isPink ? "dark" : "solid"}
          className="mt-8 w-fit"
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? "Hide Case Study" : "View Case Study"}
        </EditorialButton>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 hidden border-2 border-pink bg-ink px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-pink opacity-0 transition-opacity group-hover:opacity-100 lg:block">
        Case Study
      </div>

      {isExpanded ? (
        <motion.div
          id={detailsId}
          className={`border-t-4 p-5 sm:p-7 lg:col-span-2 lg:p-9 ${
            isPink ? "border-ink bg-ink text-bone" : "border-bone bg-ink"
          }`}
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28 }}
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Project Type", project.projectType],
              ["Services", project.services.join(" / ")],
              ["Responsibilities", project.responsibilities.join(" / ")],
              ["Challenge", project.challenge],
              ["Approach", project.solution],
              ["Development", project.technologies.join(" / ")],
              ["Interaction", project.interaction],
              ["Accessibility", project.accessibilityNotes],
              ["Result", project.result],
            ].map(([label, value]) => (
              <div className="border border-bone/20 p-4" key={label}>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-pink">
                  {label}
                </p>
                <p className="mt-3 leading-7 text-muted">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
            {project.liveUrl ? (
              <a className="border border-bone/20 px-3 py-2 transition hover:border-pink hover:text-pink" href={project.liveUrl} target="_blank" rel="noreferrer">
                Live Site
              </a>
            ) : (
              <span className="border border-bone/20 px-3 py-2">Live Site / Coming Soon</span>
            )}
            {project.githubUrl ? (
              <a className="border border-bone/20 px-3 py-2 transition hover:border-pink hover:text-pink" href={project.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : (
              <span className="border border-bone/20 px-3 py-2">GitHub / Private Concept</span>
            )}
            <span className="border border-bone/20 px-3 py-2">{project.tools}</span>
          </div>
        </motion.div>
      ) : null}
    </motion.article>
  );
}
