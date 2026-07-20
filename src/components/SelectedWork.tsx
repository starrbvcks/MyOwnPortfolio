import { projects } from "../content";
import type { ProjectItem } from "../content";
import { ProjectCard } from "./ProjectCard";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8011";

function scrollImmediately(top: number) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousBehavior;
  });
}

export function SelectedWork() {
  const reduceMotion = useReducedMotion();
  const [portfolioProjects, setPortfolioProjects] = useState<ProjectItem[]>(projects);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const returnPositions = useRef(new Map<string, number>());

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/projects`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: ProjectItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setPortfolioProjects(data);
        }
      })
      .catch(() => {
        setPortfolioProjects(projects);
      });

    return () => controller.abort();
  }, []);

  function handleProjectToggle(projectId: string) {
    if (expandedProjectId === projectId) {
      const returnTop = returnPositions.current.get(projectId) ?? window.scrollY;
      setExpandedProjectId(null);
      window.requestAnimationFrame(() => scrollImmediately(returnTop));
      return;
    }

    const nextCard = document.getElementById(projectId);
    const viewportTop = nextCard?.getBoundingClientRect().top;
    returnPositions.current.set(projectId, window.scrollY);
    setExpandedProjectId(projectId);

    window.requestAnimationFrame(() => {
      if (nextCard && viewportTop !== undefined) {
        const layoutShift = nextCard.getBoundingClientRect().top - viewportTop;
        scrollImmediately(window.scrollY + layoutShift);
      }
      returnPositions.current.set(projectId, window.scrollY);
    });
  }

  return (
    <section
      id="work"
      className="relative overflow-hidden border-b-2 border-bone/15 px-6 py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="font-display text-[clamp(3.25rem,6vw,5.25rem)] font-extrabold uppercase leading-none tracking-normal text-bone sm:whitespace-nowrap">
              Selected Work
            </h2>
          </div>
          <motion.div
            className="lg:mb-1"
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="max-w-md text-base leading-7 text-bone/68 lg:text-right">
              Selected projects from concept to final build.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-10 lg:gap-12">
          {portfolioProjects.map((project, index) => (
            <ProjectCard
              project={project}
              index={index}
              isExpanded={expandedProjectId === project.id}
              onToggle={handleProjectToggle}
              key={project.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
