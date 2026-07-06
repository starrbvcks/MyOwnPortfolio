import { useEffect, useState } from "react";
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

const FORCE_INTRO_REPLAY = true;

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";
    return FORCE_INTRO_REPLAY || !hasSeenIntro;
  });

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";
    setShowIntro(FORCE_INTRO_REPLAY || !hasSeenIntro);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-bone">
      <div className="grain fixed inset-0 z-50 pointer-events-none opacity-[0.16]" />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <SelectedWork />
        <AboutPreview />
        <Experiments />
        <VisualDesign />
        <ContactCTA />
      </main>
      <Footer />
      <AnimatePresence>
        {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
    </div>
  );
}
