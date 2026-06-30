"use client";

import { useEffect, useState } from "react";

import { LoadingVisual } from "@/components/public/loading-visual";

type PageIntroTransitionProps = {
  brandName: string;
};

const MINIMUM_VISIBLE_MS = 1350;
const EXIT_ANIMATION_MS = 720;

export function PageIntroTransition({ brandName }: PageIntroTransitionProps) {
  const [phase, setPhase] = useState<"visible" | "exiting" | "hidden">("visible");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setPhase("hidden");
      return undefined;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const restoreScroll = () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.touchAction = previousBodyTouchAction;
    };

    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, MINIMUM_VISIBLE_MS);

    const hiddenTimer = window.setTimeout(() => {
      restoreScroll();
      setPhase("hidden");
    }, MINIMUM_VISIBLE_MS + EXIT_ANIMATION_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hiddenTimer);
      restoreScroll();
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div className={phase === "exiting" ? "page-intro page-intro--exiting" : "page-intro"} role="status">
      <LoadingVisual brandName={brandName} className="loading-screen--intro" />
    </div>
  );
}
