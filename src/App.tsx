import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { AboutPreview } from "./components/AboutPreview";
import { ContactCTA } from "./components/ContactCTA";
import { Experiments } from "./components/Experiments";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IntroSequence, INTRO_STORAGE_KEY } from "./components/intro/IntroSequence";
import { ScrollProgress } from "./components/ScrollProgress";
import { SelectedWork } from "./components/SelectedWork";
import { VisualDesign } from "./components/VisualDesign";
import { VisualProjectPage } from "./components/VisualProjectPage";
import { SweezyCursor } from "./components/SweezyCursor";

const FORCE_INTRO_REPLAY = false;
const VISUAL_SCROLL_KEY = "portfolio-visual-scroll-position";

function scrollImmediately(top: number) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousBehavior;
  });
}

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, ""));
  const routeRef = useRef(route);
  const visualReturnPosition = useRef<number | null>(null);
  const [showIntro, setShowIntro] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";
    return !hasSeenIntro;
  });

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";
    setShowIntro(FORCE_INTRO_REPLAY || !hasSeenIntro);
  }, []);

  useEffect(() => {
    function handleHashChange() {
      const nextRoute = window.location.hash.replace(/^#/, "");
      const previousRoute = routeRef.current;
      const wasVisualProject = /^visual\/.+/.test(previousRoute);
      const isVisualProject = /^visual\/.+/.test(nextRoute);

      if (isVisualProject && !wasVisualProject) {
        visualReturnPosition.current = window.scrollY;
        sessionStorage.setItem(VISUAL_SCROLL_KEY, String(window.scrollY));
      }

      routeRef.current = nextRoute;
      setRoute(nextRoute);

      if (wasVisualProject && !isVisualProject) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            const targetSection = document.getElementById(nextRoute);

            if (nextRoute === "visual") {
              const storedValue = sessionStorage.getItem(VISUAL_SCROLL_KEY);
              const storedPosition = storedValue === null ? Number.NaN : Number(storedValue);
              const fallbackPosition = targetSection
                ? targetSection.getBoundingClientRect().top + window.scrollY
                : 0;
              const returnTop = visualReturnPosition.current ?? (Number.isFinite(storedPosition) ? storedPosition : fallbackPosition);
              scrollImmediately(returnTop);
              return;
            }

            if (targetSection) {
              const headerOffset = 86;
              scrollImmediately(targetSection.getBoundingClientRect().top + window.scrollY - headerOffset);
            }
          });
        });
        return;
      }

      if (isVisualProject) {
        window.requestAnimationFrame(() => scrollImmediately(0));
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const visualMatch = route.match(/^visual\/(.+)$/);

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-bone">
      <SweezyCursor />
      <div className="grain fixed inset-0 z-50 pointer-events-none opacity-[0.16]" />
      <ScrollProgress />
      <Header />
      {visualMatch ? (
        <VisualProjectPage slug={visualMatch[1]} />
      ) : (
        <main>
          <Hero />
          <SelectedWork />
          <AboutPreview />
          <Experiments />
          <VisualDesign />
          <ContactCTA />
        </main>
      )}
      <Footer />
      <AnimatePresence>
        {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
    </div>
  );
}
