import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteMeta } from "../content";
import { EditorialButton } from "./EditorialButton";
import { EditorialLink } from "./EditorialLink";
import { PinkStar } from "./PinkStar";

export function ContactCTA() {
  const reduceMotion = useReducedMotion();
  const [copyStatus, setCopyStatus] = useState("");
  const statusTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current !== null) {
        window.clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  const copyEmail = async () => {
    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(siteMeta.email);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopyStatus("Email copied");
    } catch {
      setCopyStatus(`Copy failed. Email: ${siteMeta.email}`);
    }
    statusTimerRef.current = window.setTimeout(() => setCopyStatus(""), 2600);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b-2 border-pink bg-ink px-4 py-20 text-bone sm:px-6 lg:px-8 lg:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-pink/5" />
      <PinkStar className="absolute right-6 top-8 opacity-60" size="lg" rotation={12} />

      <motion.div
        className="relative mx-auto max-w-7xl border-4 border-pink bg-carbon p-6 sm:p-8 lg:p-10"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pink-light">
          Contact / 06 / {siteMeta.location}
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <h2 className="max-w-5xl font-display text-[clamp(3rem,7.8vw,6.8rem)] font-extrabold uppercase leading-[1] tracking-normal text-bone">
              Let's build something.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Have a project, collaboration, or experimental idea in mind? Tell
              me about it.
            </p>
          </div>

          <div className="border-2 border-bone/25 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-pink">
              Available for:
            </p>
            <p className="mt-3 font-mono text-xs uppercase leading-6 tracking-[0.14em] text-muted">
              {siteMeta.availability}
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <EditorialLink href={`mailto:${siteMeta.email}`} aria-label={`Email Setareh at ${siteMeta.email}`}>
                Start a Conversation
              </EditorialLink>
              <EditorialButton variant="outline" onClick={copyEmail}>
                Copy Email
              </EditorialButton>
            </div>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              {siteMeta.email}
            </p>
            <a
              href={siteMeta.github}
              target="_blank"
              rel="noreferrer"
              className="editorial-focus mt-3 block font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-pink"
              aria-label="Open Setareh GitHub profile in a new tab"
            >
              GitHub / starrbvcks
            </a>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              Instagram / {siteMeta.instagram}
            </p>
            <p aria-live="polite" className="mt-3 min-h-5 font-mono text-xs uppercase tracking-[0.14em] text-pink-light">
              {copyStatus}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
