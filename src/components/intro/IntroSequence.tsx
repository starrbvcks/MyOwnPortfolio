import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

import { FallingStar } from "./FallingStar";
import { SkipIntroButton } from "./SkipIntroButton";
import { StarRevealMask } from "./StarRevealMask";

type IntroSequenceProps = {
  onComplete: () => void;
};

const INTRO_STORAGE_KEY = "setareh-intro-seen";

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const reduceMotion = useReducedMotion();
  const completedRef = useRef(false);
  const inputProgressRef = useRef(0);
  const lastTouchYRef = useRef<number | null>(null);
  const rawProgress = useMotionValue(0);
  const rawX = useMotionValue(typeof window === "undefined" ? 0 : window.innerWidth / 2);
  const progress = useSpring(rawProgress, { stiffness: 140, damping: 28, mass: 0.72 });
  const starX = useSpring(rawX, { stiffness: 150, damping: 26, mass: 0.7 });

  const completeIntro = useCallback(() => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
    onComplete();
  }, [onComplete]);

  const updateIntroProgress = useCallback(
    (delta: number) => {
      if (reduceMotion) {
        return;
      }

      if (Math.abs(delta) < 0.0005) {
        return;
      }

      const nextProgress = Math.max(0, Math.min(1, inputProgressRef.current + delta));

      inputProgressRef.current = nextProgress;
      rawProgress.set(nextProgress);
      rawX.set(window.innerWidth / 2);

      if (nextProgress > 0.985) {
        rawProgress.set(1);
        window.setTimeout(completeIntro, 120);
      }
    },
    [completeIntro, rawProgress, rawX, reduceMotion],
  );

  useEffect(() => {
    const timer = window.setTimeout(completeIntro, reduceMotion ? 220 : 7000);
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        completeIntro();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        updateIntroProgress(0.16);
      }

      if (event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        updateIntroProgress(0.28);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        updateIntroProgress(-0.12);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        updateIntroProgress(0.2);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [completeIntro, reduceMotion, updateIntroProgress]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      updateIntroProgress(event.deltaY * 0.00125);
    };

    const handlePointerDown = () => {
      updateIntroProgress(0.18);
    };

    const handleWindowTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        const previousY = lastTouchYRef.current;
        lastTouchYRef.current = touch.clientY;

        if (previousY !== null) {
          event.preventDefault();
          updateIntroProgress((previousY - touch.clientY) * 0.0032);
        }
      }
    };

    const handleWindowTouchStart = (event: TouchEvent) => {
      lastTouchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleResize = () => {
      rawX.set(window.innerWidth / 2);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("touchstart", handleWindowTouchStart, { passive: true });
    window.addEventListener("touchmove", handleWindowTouchMove, { passive: false });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("touchstart", handleWindowTouchStart);
      window.removeEventListener("touchmove", handleWindowTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [rawX, reduceMotion, updateIntroProgress]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] overflow-hidden bg-ink text-bone touch-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.34, ease: [0.76, 0, 0.24, 1] }}
    >
      <StarRevealMask progress={progress} />
      <div className="grain pointer-events-none absolute inset-0 z-10 opacity-[0.18]" aria-hidden="true" />
      <FallingStar progress={progress} x={starX} />
      <SkipIntroButton onSkip={completeIntro} />
    </motion.div>
  );
}

export { INTRO_STORAGE_KEY };
