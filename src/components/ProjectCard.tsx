import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ProjectItem } from "../content";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8011";

type ProjectCardProps = {
  project: ProjectItem;
  index: number;
  isExpanded: boolean;
  onToggle: (projectId: string) => void;
};

type ProjectPreview = {
  title: string;
  category: string;
  description: string;
  tags: string[];
};

const PROJECT_PREVIEWS: Record<string, ProjectPreview> = {
  eleanor: {
    title: "Éclat Floral",
    category: "Luxury Floral E-commerce",
    description: "A refined online flower shop designed for simple browsing, custom orders, and elegant product presentation.",
    tags: ["UI/UX", "Django", "E-commerce"],
  },
  monolith: {
    title: "Artist Portfolio",
    category: "Watercolor Artist Portfolio",
    description: "A calm, responsive gallery that presents artwork beautifully and lets the artist manage new pieces without touching code.",
    tags: ["UI/UX", "Django", "Responsive"],
  },
  "neural-forge": {
    title: "Neural Forge",
    category: "AI Developer Product",
    description: "A focused product page that explains a technical AI tool through clear storytelling, modular UI, and accessible interactions.",
    tags: ["Product Design", "React", "TypeScript", "Accessibility"],
  },
};

function assetUrl(value: string) {
  return value.startsWith("/uploads/") ? `${API_BASE}${value}` : value;
}

function readableText(value: string) {
  return value
    .replaceAll("Ã‰", "E")
    .replaceAll("â€™", "'")
    .replaceAll("â€“", "-")
    .replaceAll("â€”", "-");
}

function shortText(value: string, maxLength = 150) {
  const text = readableText(value).trim();
  if (text.length <= maxLength) return text;

  const sentenceEnd = text.slice(0, maxLength).lastIndexOf(".");
  const end = sentenceEnd > 80 ? sentenceEnd + 1 : maxLength;
  return `${text.slice(0, end).trim()}...`;
}

function previewFor(project: ProjectItem): ProjectPreview {
  const customPreview = PROJECT_PREVIEWS[project.id];
  if (customPreview) return customPreview;

  const words = readableText(project.description).trim().split(/\s+/).slice(0, 24);
  const tags = project.technologies.length > 0
    ? project.technologies.slice(0, 4)
    : project.services.slice(0, 4);

  return {
    title: readableText(project.title).replaceAll("-", " "),
    category: readableText(project.category),
    description: `${words.join(" ")}${words.length >= 24 ? "..." : ""}`,
    tags,
  };
}

export function ProjectCard({ project, index, isExpanded, onToggle }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const detailsId = `${project.id}-details`;
  const galleryImages = useMemo(() => {
    const images = project.images?.filter(Boolean) ?? [];
    return (images.length > 0 ? images : [project.image].filter(Boolean)).map(assetUrl);
  }, [project.image, project.images]);
  const featuredImage = galleryImages[activeImage] ?? galleryImages[0];
  const storySections = [
    ["01", "Context", project.description],
    ["02", "Challenge", project.challenge],
    ["03", "Approach", project.solution],
    ["04", "Interaction", project.interaction],
    ["05", "Outcome", project.result],
  ].filter(([, , value]) => value);
  const caseStudyBanner = galleryImages[galleryImages.length - 1] ?? galleryImages[0];
  const preview = previewFor(project);

  useEffect(() => {
    setActiveImage(0);
  }, [project.id, galleryImages.length]);

  useEffect(() => {
    if (!isPreviewOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
        setActiveImage(0);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen]);

  return (
    <motion.article
      className="project-card group relative overflow-hidden border border-bone/18 bg-carbon/55 p-6 text-bone shadow-[0_18px_58px_rgba(0,0,0,0.16)] transition-colors duration-500 hover:border-bone/35 sm:p-7 lg:p-8"
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={project.id}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-stretch lg:gap-12">
        <div className="relative z-10 flex min-w-0 flex-col py-1 lg:py-3">
          <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.2em] text-pink">
            {String(index + 1).padStart(2, "0")} / {project.year}
          </p>
          <span className="mt-5 h-px w-10 bg-pink transition-[width] duration-500 group-hover:w-24" aria-hidden="true" />

          <h3 className="mt-7 font-display text-[clamp(2.7rem,5vw,4.5rem)] font-extrabold uppercase leading-[0.92] tracking-normal text-bone">
            {preview.title}
          </h3>

          <p className="mt-5 font-mono text-xs font-black uppercase leading-5 tracking-[0.12em] text-pink">
            {preview.category}
          </p>

          <p className="mt-6 overflow-hidden text-[1.05rem] leading-[1.65] text-bone/78 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {preview.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted">
            {preview.tags.map((tag, tagIndex) => (
              <span className="flex items-center gap-2" key={tag}>
                {tag}
                {tagIndex < preview.tags.length - 1 ? <span className="text-bone/25">·</span> : null}
              </span>
            ))}
          </div>

          <motion.button
            type="button"
            className="editorial-focus group/cta mt-9 flex w-fit items-center gap-3 font-mono text-[0.8rem] font-black uppercase tracking-[0.14em] text-bone transition-colors hover:text-pink lg:mt-auto lg:pt-10"
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            onClick={() => onToggle(project.id)}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            <span>{isExpanded ? "Close case study" : "View case study"}</span>
            <span className="transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true">
              {isExpanded ? "←" : "→"}
            </span>
          </motion.button>
        </div>

        <motion.button
          type="button"
          className="editorial-focus relative grid aspect-video w-full place-items-center overflow-hidden bg-ink/70"
          onClick={() => onToggle(project.id)}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          aria-label={`${isExpanded ? "Close" : "View"} ${preview.title} case study`}
        >
          {featuredImage ? (
            <>
              <img src={featuredImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-2xl" />
              <motion.img
                src={featuredImage}
                alt={project.imageAlt}
                className="relative z-10 h-full w-full object-contain"
                loading="lazy"
                animate={reduceMotion ? undefined : { scale: isHovered ? 1.02 : 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </>
          ) : null}
        </motion.button>
      </div>

      {isExpanded ? (
        <motion.div
          id={detailsId}
          className="relative order-last w-full overflow-hidden rounded-md border border-bone/14 bg-ink/88 p-4 ring-1 ring-pink/10 md:basis-full md:p-6 xl:p-8"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          <div aria-hidden="true" className="absolute inset-0 editorial-grid opacity-45" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-pink via-bone/50 to-transparent" />

          <div className="relative">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-bone/14 pb-4">
              <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.22em] text-pink-light">
                Case Study / {String(index + 1).padStart(2, "0")}
              </p>
              <button
                type="button"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-pink/50 font-mono text-sm font-black uppercase text-pink transition hover:bg-pink hover:text-ink"
                onClick={() => onToggle(project.id)}
                aria-label={`Close ${project.title} case study`}
              >
                x
              </button>
            </div>

            <section>
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.65rem] font-black uppercase tracking-[0.18em] text-muted">
                  <span>{project.category}</span>
                  <span className="h-px w-10 bg-pink" aria-hidden="true" />
                  <span>{project.year}</span>
                </div>
                <h4 className="mt-4 max-w-[12ch] font-display text-[clamp(3rem,10vw,8.6rem)] font-extrabold uppercase leading-[0.82] tracking-normal text-bone">
                  {project.title}
                </h4>
                <p className="mt-5 max-w-2xl text-base leading-7 text-bone/76 md:text-lg md:leading-8">
                  {shortText(project.description, 260)}
                </p>
              </div>

            </section>

            {caseStudyBanner ? (
              <button
                type="button"
                className="group/banner relative mt-8 grid aspect-[3/2] w-full place-items-center overflow-hidden rounded-md border border-bone/16 bg-carbon shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
                onClick={() => {
                  setActiveImage(Math.max(galleryImages.indexOf(caseStudyBanner), 0));
                  setIsPreviewOpen(true);
                }}
                aria-label={`Expand ${project.title} case study banner`}
              >
                <img
                  src={caseStudyBanner}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-2xl"
                />
                <img
                  src={caseStudyBanner}
                  alt={`${project.title} project overview banner`}
                  className="relative z-10 h-full w-full object-contain transition duration-700 group-hover/banner:scale-[1.008]"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3 z-20 border border-bone/20 bg-ink/78 px-3 py-2 font-mono text-[0.6rem] font-black uppercase tracking-[0.16em] text-bone backdrop-blur">
                  Project Overview
                </span>
              </button>
            ) : null}

            <section className="case-study-story border-y border-bone/14 py-6 lg:py-9">
              <header className="grid gap-5 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <span className="inline-flex border border-pink/45 bg-pink/10 px-3 py-1.5 font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-pink-light">
                    Project Narrative
                  </span>
                  <h5 className="mt-5 max-w-[12ch] font-display text-[clamp(2.8rem,6vw,6.5rem)] font-extrabold uppercase leading-[0.84] tracking-normal text-bone">
                    The story behind the build
                  </h5>
                </div>
                <p className="border-l-2 border-pink pl-4 font-mono text-[0.66rem] font-black uppercase leading-6 tracking-[0.16em] text-muted lg:col-span-4">
                  {project.projectType}
                </p>
              </header>

              <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
                <aside className="lg:col-span-4">
                  <div className="case-study-facts lg:sticky lg:top-28">
                    <dl className="grid border-t border-bone/16 sm:grid-cols-2 lg:grid-cols-1">
                      {[
                        ["Role", project.role],
                        ["Status", project.status],
                        ["Tools", project.tools],
                      ].map(([label, value]) => (
                        <div className="border-b border-bone/16 py-4 sm:px-4 sm:first:pl-0 lg:px-0" key={label}>
                          <dt className="font-mono text-[0.58rem] font-black uppercase tracking-[0.2em] text-pink">{label}</dt>
                          <dd className="mt-2 max-w-sm text-sm font-semibold leading-6 text-bone/78">{value}</dd>
                        </div>
                      ))}
                    </dl>

                    {project.services.length > 0 ? (
                      <div className="mt-6">
                        <p className="font-mono text-[0.58rem] font-black uppercase tracking-[0.2em] text-muted">Scope</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.services.map((service) => (
                            <span className="rounded-full border border-bone/18 px-3 py-1.5 text-xs font-semibold text-bone/72" key={service}>
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </aside>

                <div className="grid gap-px overflow-hidden border border-bone/14 bg-bone/14 md:grid-cols-2 lg:col-span-8">
                  {storySections.map(([number, label, value], textIndex) => (
                    <motion.article
                      className={`group/story relative overflow-hidden bg-ink p-5 transition-colors hover:bg-carbon md:p-7 ${label === "Outcome" ? "md:col-span-2" : ""}`}
                      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={reduceMotion ? undefined : { y: -4 }}
                      transition={{ duration: reduceMotion ? 0 : 0.4, delay: textIndex * 0.06 }}
                      key={label}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-pink transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover/story:scale-x-100"
                      />
                      <div className="mb-7 flex items-center justify-between gap-4">
                        <span className="font-mono text-[0.62rem] font-black tracking-[0.2em] text-pink">{number}</span>
                        <span className="h-px flex-1 bg-bone/14" aria-hidden="true" />
                        <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-bone/70">{label}</p>
                      </div>
                      <p className={`leading-7 text-bone/72 ${label === "Outcome" ? "max-w-3xl text-lg md:text-xl md:leading-9" : "text-[0.95rem]"}`}>
                        {readableText(value)}
                      </p>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>

            <footer className="mt-6 grid gap-5 border-t border-bone/14 pt-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.2em] text-pink">Technologies</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span className="border border-bone/18 px-3 py-2 font-mono text-[0.62rem] font-black uppercase tracking-[0.12em] text-bone/78" key={technology}>
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <a className="border border-pink px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-pink transition hover:bg-pink hover:text-ink" href={project.liveUrl}>
                    Live
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a className="border border-bone/24 px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-bone transition hover:border-pink hover:text-pink" href={project.githubUrl}>
                    Github
                  </a>
                ) : null}
                <button
                  type="button"
                  className="border border-bone/24 px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-bone transition hover:border-pink hover:text-pink"
                  onClick={() => onToggle(project.id)}
                >
                  Back
                </button>
              </div>
            </footer>
          </div>
        </motion.div>
      ) : null}

      {isPreviewOpen ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/88 p-4 backdrop-blur-md"
          onClick={() => {
            setIsPreviewOpen(false);
            setActiveImage(0);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} image preview`}
        >
          <button
            type="button"
            className="absolute right-4 top-4 border border-bone/30 bg-ink/80 px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-bone transition hover:border-pink hover:text-pink"
            onClick={() => {
              setIsPreviewOpen(false);
              setActiveImage(0);
            }}
          >
            Close
          </button>
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={project.imageAlt}
              className="max-h-[86vh] w-auto max-w-[94vw] object-contain shadow-[0_24px_100px_rgba(0,0,0,0.55)]"
              onClick={(event) => event.stopPropagation()}
            />
          ) : null}
        </div>
      ) : null}
    </motion.article>
  );
}
