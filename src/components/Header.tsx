import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { navigation, siteMeta } from "../content";
import { HandDrawnUnderline } from "./HandDrawnUnderline";
import { MobileMenu } from "./MobileMenu";
import { PinkStar } from "./PinkStar";

export function Header() {
  const reduceMotion = useReducedMotion();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 18);

      let current = undefined as (typeof navigation)[number] | undefined;
      for (let index = navigation.length - 1; index >= 0; index -= 1) {
        const item = navigation[index];
        const section = document.querySelector(item.href);
        if (section && section.getBoundingClientRect().top <= 180) {
          current = item;
          break;
        }
      }

      setActiveHref(current?.href ?? "#home");
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-40 border-b transition-colors duration-300 ${
          hasScrolled
            ? "border-bone/15 bg-ink/88 backdrop-blur-xl"
            : "border-bone/0 bg-transparent"
        }`}
        initial={reduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
            hasScrolled ? "py-3" : "py-4"
          }`}
        >
          <a
            href="#home"
            className={`editorial-focus font-display text-2xl font-black uppercase tracking-normal text-bone transition-transform duration-300 sm:text-3xl ${
              hasScrolled ? "scale-95" : "scale-100"
            }`}
            aria-label="Setareh home"
          >
            SETAREH<span className="text-pink">.</span>
          </a>

          <div className="hidden items-center gap-5 lg:flex">
            <button
              type="button"
              onClick={() => setIsDesktopNavOpen((current) => !current)}
              className="editorial-focus group relative min-h-11 overflow-hidden border-2 border-pink px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-pink transition-colors hover:bg-pink hover:text-ink"
              aria-expanded={isDesktopNavOpen}
              aria-controls="desktop-navigation-items"
            >
              <span className="relative z-10">{isDesktopNavOpen ? "Close" : "Menu"}</span>
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-3 h-px w-0 bg-ink transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]"
              />
            </button>

            <motion.div
              id="desktop-navigation-items"
              className="flex items-center gap-7 overflow-hidden"
              initial={false}
              animate={{
                width: isDesktopNavOpen ? "auto" : 0,
                opacity: isDesktopNavOpen ? 1 : 0,
              }}
              transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden={!isDesktopNavOpen}
            >
              <motion.div
                initial={false}
                animate={{
                  opacity: isDesktopNavOpen ? 1 : 0,
                  scale: isDesktopNavOpen ? 1 : 0.5,
                  rotate: isDesktopNavOpen ? 0 : -35,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              >
                <PinkStar size="sm" rotation={12} animated={isDesktopNavOpen} />
              </motion.div>
              {navigation.map((item) => {
                const isActive = activeHref === item.href;

                return (
                  <motion.a
                    className={`nav-link group relative whitespace-nowrap font-sans text-sm font-bold uppercase tracking-[0.04em] transition-colors ${
                      isActive ? "text-pink" : "text-muted hover:text-bone"
                    }`}
                    href={item.href}
                    tabIndex={isDesktopNavOpen ? 0 : -1}
                    key={item.href}
                    initial={false}
                    animate={{
                      x: isDesktopNavOpen ? 0 : -16,
                      opacity: isDesktopNavOpen ? 1 : 0,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.34,
                      delay: reduceMotion ? 0 : (Number(item.number) - 1) * 0.04,
                      ease: "easeOut",
                    }}
                  >
                    <span className="mr-2 font-mono text-xs font-normal text-pink/80">
                      {item.number}
                    </span>
                    {item.label}
                    <HandDrawnUnderline
                      active
                      className={
                        isActive
                          ? "opacity-100"
                          : "opacity-0 transition-opacity group-hover:opacity-100"
                      }
                    />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setIsMenuOpen(true)}
            className="editorial-focus min-h-11 border-2 border-pink px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-pink transition-colors hover:bg-pink hover:text-ink lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            Menu
          </button>
        </nav>
      </motion.header>

      <div id="mobile-navigation">
        <MobileMenu
          isOpen={isMenuOpen}
          items={navigation}
          location={siteMeta.location}
          onClose={() => {
            setIsMenuOpen(false);
            window.setTimeout(() => menuButtonRef.current?.focus(), 0);
          }}
        />
      </div>
    </>
  );
}
