import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { navigation, siteMeta } from "../content";
import { MobileMenu } from "./MobileMenu";
import { scrollToSection } from "../lib/smoothScroll";
import { CircleMenu } from "./ui/circle-menu";
import { MenuToggleIcon } from "./ui/menu-toggle-icon";
import { useScroll } from "./ui/use-scroll";
import { cn } from "../lib/utils";

export function Header() {
  const reduceMotion = useReducedMotion();
  const hasScrolled = useScroll(18);
  const [activeHref, setActiveHref] = useState("#home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrollState = () => {
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
    document.body.style.overflow = isMenuOpen || isDesktopNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDesktopNavOpen, isMenuOpen]);

  function handleSectionClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    setIsDesktopNavOpen(false);
    setIsMenuOpen(false);
    scrollToSection(href);
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed left-0 right-0 top-0 z-40 mx-auto w-full max-w-7xl border border-transparent transition-[top,max-width,background-color,border-color,box-shadow,border-radius] duration-500 ease-out",
          hasScrolled && !isDesktopNavOpen && !isMenuOpen
            ? "top-3 max-w-[min(64rem,calc(100%-1.5rem))] rounded-xl border-bone/15 bg-ink/78 shadow-[0_14px_55px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:top-4"
            : "bg-transparent",
          (isDesktopNavOpen || isMenuOpen) && "border-bone/10 bg-ink/92 backdrop-blur-xl",
        )}
        initial={reduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <nav
          className={cn(
            "mx-auto flex h-16 w-full items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-8",
            hasScrolled && "h-14 lg:px-5",
          )}
        >
          <a
            href="#home"
            onClick={(event) => handleSectionClick(event, "#home")}
            className={cn(
              "editorial-focus font-display text-2xl font-black uppercase tracking-normal text-bone transition-transform duration-500 sm:text-3xl",
              hasScrolled && "scale-90",
            )}
            aria-label="Setareh home"
          >
            SETAREH<span className="text-pink">.</span>
          </a>

          <div className="hidden items-center lg:flex">
            <button
              type="button"
              onClick={() => setIsDesktopNavOpen((current) => !current)}
              className="editorial-focus group relative flex h-10 items-center gap-2 overflow-hidden rounded-md border border-pink/70 px-3.5 font-mono text-[0.65rem] font-black uppercase tracking-[0.14em] text-pink transition-colors hover:bg-pink hover:text-ink"
              aria-expanded={isDesktopNavOpen}
              aria-controls="desktop-navigation-items"
            >
              <MenuToggleIcon open={isDesktopNavOpen} className="h-4 w-4" duration={360} />
              <span className="relative z-10">{isDesktopNavOpen ? "Close" : "Menu"}</span>
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-3 h-px w-0 bg-ink transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]"
              />
            </button>
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setIsMenuOpen((current) => !current)}
            className="editorial-focus grid h-10 w-10 place-items-center rounded-md border border-pink/70 text-pink transition-colors hover:bg-pink hover:text-ink lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <MenuToggleIcon open={isMenuOpen} className="h-5 w-5" duration={360} />
          </button>
        </nav>
      </motion.header>

      <CircleMenu
        items={navigation}
        isOpen={isDesktopNavOpen}
        activeHref={activeHref}
        onOpenChange={setIsDesktopNavOpen}
        onNavigate={(href) => {
          setIsDesktopNavOpen(false);
          window.setTimeout(() => scrollToSection(href), 120);
        }}
      />

      <div id="mobile-navigation">
        <MobileMenu
          isOpen={isMenuOpen}
          items={navigation}
          location={siteMeta.location}
          onNavigate={(href) => {
            setIsMenuOpen(false);
            window.setTimeout(() => scrollToSection(href), 180);
          }}
          onClose={() => {
            setIsMenuOpen(false);
            window.setTimeout(() => menuButtonRef.current?.focus(), 0);
          }}
        />
      </div>
    </>
  );
}
