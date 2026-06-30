"use client";

import { useEffect, useRef } from "react";

import { type CursorVariant, normalizeCursorVariant } from "@/lib/cursor-variants";

const interactiveSelector = 'a, button, input, textarea, select, label, [role="button"]';

type TechCursorProps = {
  variant?: CursorVariant | string | null;
};

export function TechCursor({ variant }: TechCursorProps) {
  const normalizedVariant = normalizeCursorVariant(variant);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (normalizedVariant === "SYSTEM") {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;

    if (prefersReducedMotion || !hasFinePointer) {
      return undefined;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;

    if (!cursor || !dot) {
      return undefined;
    }

    let frame = 0;
    let targetX = -100;
    let targetY = -100;
    let ringX = targetX;
    let ringY = targetY;

    const render = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;

      frame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      cursor.classList.add("is-visible");
      dot.classList.add("is-visible");

      const target = event.target instanceof Element ? event.target : null;
      const isInteractive = Boolean(target?.closest(interactiveSelector));
      cursor.classList.toggle("is-hovering", isInteractive);
    };

    const handlePointerDown = () => {
      cursor.classList.add("is-pressed");
    };

    const handlePointerUp = () => {
      cursor.classList.remove("is-pressed");
    };

    const handlePointerLeave = () => {
      cursor.classList.remove("is-visible", "is-hovering", "is-pressed");
      dot.classList.remove("is-visible");
    };

    frame = window.requestAnimationFrame(render);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [normalizedVariant]);

  if (normalizedVariant === "SYSTEM") {
    return null;
  }

  return (
    <>
      <div aria-hidden="true" className={`tech-cursor tech-cursor--${normalizedVariant.toLowerCase()}`} ref={cursorRef}>
        <span className="tech-cursor__halo" />
        <span className="tech-cursor__trace" />
      </div>
      <span
        aria-hidden="true"
        className={`tech-cursor-dot tech-cursor-dot--${normalizedVariant.toLowerCase()}`}
        ref={dotRef}
      />
    </>
  );
}
