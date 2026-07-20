import { motion, type Variants, useReducedMotion } from "framer-motion";
import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "../../lib/utils";

export type TypewriterProps = {
  text: string | string[];
  as?: ElementType;
  speed?: number;
  initialDelay?: number;
  waitTime?: number;
  deleteSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorOnType?: boolean;
  cursorChar?: ReactNode;
  cursorClassName?: string;
  respectReducedMotion?: boolean;
  cursorAnimationVariants?: {
    initial: Variants["initial"];
    animate: Variants["animate"];
  };
} & HTMLAttributes<HTMLElement>;

export function Typewriter({
  text,
  as: Tag = "div",
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = "|",
  cursorClassName = "ml-1",
  respectReducedMotion = true,
  cursorAnimationVariants = {
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 0.4,
        repeatType: "reverse",
      },
    },
    initial: { opacity: 0 },
  },
  ...props
}: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = respectReducedMotion && reduceMotion;
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[currentTextIndex] ?? "";

    if (shouldReduceMotion) {
      setDisplayText(currentText);
      setCurrentIndex(currentText.length);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (isDeleting) {
        if (displayText === "") {
          setIsDeleting(false);
          if (currentTextIndex === texts.length - 1 && !loop) return;
          setCurrentTextIndex((previous) => (previous + 1) % texts.length);
          setCurrentIndex(0);
        } else {
          timeout = setTimeout(
            () => setDisplayText((previous) => previous.slice(0, -1)),
            deleteSpeed,
          );
        }
      } else if (currentIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText((previous) => previous + currentText[currentIndex]);
          setCurrentIndex((previous) => previous + 1);
        }, speed);
      } else if (loop && texts.length === 1) {
        timeout = setTimeout(() => {
          setDisplayText("");
          setCurrentIndex(0);
        }, waitTime);
      } else if (texts.length > 1) {
        timeout = setTimeout(() => setIsDeleting(true), waitTime);
      }
    };

    if (currentIndex === 0 && !isDeleting && displayText === "") {
      timeout = setTimeout(tick, initialDelay);
    } else {
      tick();
    }

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    currentTextIndex,
    deleteSpeed,
    displayText,
    hideCursorOnType,
    initialDelay,
    isDeleting,
    loop,
    shouldReduceMotion,
    speed,
    texts,
    waitTime,
  ]);

  const isTyping = currentIndex < (texts[currentTextIndex]?.length ?? 0) || isDeleting;

  return (
    <Tag className={cn("inline whitespace-pre-wrap tracking-tight", className)} {...props}>
      <span>{displayText}</span>
      {showCursor ? (
        <motion.span
          animate="animate"
          className={cn(cursorClassName, hideCursorOnType && isTyping ? "hidden" : "")}
          initial="initial"
          variants={cursorAnimationVariants as Variants}
        >
          {cursorChar}
        </motion.span>
      ) : null}
    </Tag>
  );
}

export default Typewriter;
