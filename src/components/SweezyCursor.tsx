import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select, [data-cursor]";

export function SweezyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let frame = 0;

    document.documentElement.classList.add("has-sweezy-cursor");

    const render = () => {
      const ease = reduceMotion ? 1 : 0.2;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.dataset.visible = "true";
      dot.dataset.visible = "true";
    };

    const handlePointerOver = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target.closest(INTERACTIVE_SELECTOR) : null;
      cursor.dataset.state = element ? "active" : "idle";
      dot.dataset.state = element ? "active" : "idle";
    };

    const handlePointerDown = () => {
      cursor.dataset.pressed = "true";
    };

    const handlePointerUp = () => {
      cursor.dataset.pressed = "false";
    };

    const handlePointerLeave = () => {
      cursor.dataset.visible = "false";
      dot.dataset.visible = "false";
    };

    const handlePointerEnter = () => {
      cursor.dataset.visible = "true";
      dot.dataset.visible = "true";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    document.documentElement.addEventListener("pointerenter", handlePointerEnter);
    frame = window.requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("has-sweezy-cursor");
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      document.documentElement.removeEventListener("pointerenter", handlePointerEnter);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="sweezy-cursor" data-state="idle" data-visible="false" aria-hidden="true">
        <span className="sweezy-cursor__orbit" />
      </div>
      <div ref={dotRef} className="sweezy-cursor-dot" data-state="idle" data-visible="false" aria-hidden="true" />
    </>
  );
}
