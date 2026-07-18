import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PinkStar } from "./PinkStar";

type NavItem = {
  label: string;
  href: string;
  number: string;
};

type MobileMenuProps = {
  isOpen: boolean;
  items: readonly NavItem[];
  location: string;
  onClose: () => void;
};

export function MobileMenu({ isOpen, items, location, onClose }: MobileMenuProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => firstLinkRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusableElements.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-ink px-5 py-5 lg:hidden"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="flex items-center justify-between">
            <a
              href="#home"
              onClick={onClose}
              className="editorial-focus font-display text-xl font-extrabold uppercase text-bone"
            >
              Setareh<span className="text-pink">.</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="editorial-focus min-h-11 border-2 border-pink px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-pink transition-colors hover:bg-pink hover:text-ink"
              aria-label="Close navigation menu"
            >
              Close
            </button>
          </div>

          <PinkStar className="absolute bottom-14 right-5 opacity-75" size="xl" />
          <h2 id="mobile-menu-title" className="sr-only">
            Mobile navigation
          </h2>

          <motion.div
            className="mt-14 flex flex-col gap-4 pb-24 sm:mt-20 sm:gap-5"
            initial={reduceMotion ? false : "closed"}
            animate="open"
            exit="closed"
            variants={{
              open: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
              closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
            }}
          >
            {items.map((item, index) => (
              <motion.a
                href={item.href}
                onClick={onClose}
                ref={index === 0 ? firstLinkRef : undefined}
                className="editorial-focus group flex flex-col gap-2 border-b-2 border-bone/20 pb-4 sm:block"
                key={item.href}
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: 24, opacity: 0 },
                }}
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-pink">
                  {item.number}
                </span>
                <span className="font-display text-[clamp(2.35rem,12vw,4.25rem)] font-extrabold uppercase leading-none text-bone transition-colors group-hover:text-pink sm:ml-4">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </motion.div>

          <p className="absolute bottom-8 left-5 max-w-[calc(100%-2.5rem)] font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {location} / Available for selected builds
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
