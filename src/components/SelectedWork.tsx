import { projects } from "../content";
import type { ProjectItem } from "../content";
import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8011";

export function SelectedWork() {
  const [portfolioProjects, setPortfolioProjects] = useState<ProjectItem[]>(projects);

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

  return (
    <section
      id="work"
      className="relative overflow-hidden border-b-2 border-bone/15 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-5 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-pink">
              03 / Selected Work
            </p>
            <h2 className="mt-4 font-display text-[clamp(3rem,8.5vw,7rem)] font-extrabold uppercase leading-[1] tracking-normal text-bone">
              Selected Work
            </h2>
          </div>
          <p className="max-w-xl border-l-4 border-pink pl-5 text-lg leading-8 text-muted">
            Concept builds and portfolio case studies where visual direction,
            interaction, and front-end structure are developed together.
          </p>
        </div>

        <div className="grid gap-7">
          {portfolioProjects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
