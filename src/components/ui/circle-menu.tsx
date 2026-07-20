import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

export type CircleMenuItem = {
  label: string;
  href: string;
  number: string;
};

type CircleMenuProps = {
  items: readonly CircleMenuItem[];
  isOpen: boolean;
  activeHref?: string;
  onOpenChange: (isOpen: boolean) => void;
  onNavigate: (href: string) => void;
};

const MENU_SIZE = 320;
const ITEM_SIZE = 68;
const RADIUS = 108;

function pointOnCircle(index: number, total: number) {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    x: RADIUS * Math.cos(angle),
    y: RADIUS * Math.sin(angle),
  };
}

export function CircleMenu({
  items,
  isOpen,
  activeHref,
  onOpenChange,
  onNavigate,
}: CircleMenuProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[45] hidden lg:block"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-ink/72 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => onOpenChange(false)}
          />

          <motion.nav
            id="desktop-navigation-items"
            aria-label="Circular navigation"
            className="absolute right-6 top-20 rounded-full border border-bone/14 bg-carbon/94 shadow-[0_28px_100px_rgba(0,0,0,0.58)]"
            style={{ width: MENU_SIZE, height: MENU_SIZE }}
            initial={reduceMotion ? false : { scale: 0.72, rotate: -24, filter: "blur(8px)" }}
            animate={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
            exit={{ scale: 0.72, rotate: -30, filter: "blur(8px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-8 rounded-full border border-dashed border-pink/28"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 24, ease: "linear", repeat: Infinity }}
            />

            {items.map((item, index) => {
              const point = pointOnCircle(index, items.length);
              const isActive = activeHref === item.href;

              return (
                <motion.a
                  href={item.href}
                  className={cn(
                    "editorial-focus group absolute left-1/2 top-1/2 z-10 flex flex-col items-center justify-center rounded-full border font-mono uppercase shadow-[0_12px_34px_rgba(0,0,0,0.34)] transition-colors",
                    isActive
                      ? "border-pink bg-pink text-ink"
                      : "border-bone/20 bg-ink text-bone hover:border-pink hover:bg-pink hover:text-ink",
                  )}
                  style={{
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    marginLeft: -ITEM_SIZE / 2,
                    marginTop: -ITEM_SIZE / 2,
                  }}
                  initial={reduceMotion ? false : { x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: point.x, y: point.y, scale: 1, opacity: 1 }}
                  exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  transition={{
                    delay: reduceMotion ? 0 : index * 0.045,
                    type: "spring",
                    stiffness: 310,
                    damping: 24,
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.href);
                  }}
                  key={item.href}
                >
                  <span className="text-sm font-black tracking-[0.08em]">{item.number}</span>
                  <span className="mt-0.5 max-w-[5.7rem] truncate px-1 text-[0.48rem] font-black tracking-[0.08em]">
                    {item.label}
                  </span>
                </motion.a>
              );
            })}

            <motion.button
              type="button"
              className="editorial-focus absolute left-1/2 top-1/2 z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-pink bg-pink font-mono text-[0.58rem] font-black uppercase tracking-[0.14em] text-ink shadow-[0_0_36px_rgba(255,59,157,0.32)]"
              onClick={() => onOpenChange(false)}
              whileHover={reduceMotion ? undefined : { rotate: 90, scale: 1.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.92 }}
              aria-label="Close navigation menu"
            >
              Close
            </motion.button>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
