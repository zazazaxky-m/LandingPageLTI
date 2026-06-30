"use client";

import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";
import { useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";

import { buttonClasses } from "@/components/ui/button";
import { ScrambleText } from "@/components/ui/scramble-text";

type ErrorExperienceProps = {
  code: string;
  eyebrow: string;
  title: string;
  message: string;
  detail?: string;
  primaryLabel: string;
  primaryHref?: string;
  onPrimaryAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
};

const nodes = [
  { x: "12%", y: "62%", size: "7px", delay: "0ms" },
  { x: "24%", y: "30%", size: "5px", delay: "120ms" },
  { x: "47%", y: "72%", size: "6px", delay: "260ms" },
  { x: "68%", y: "34%", size: "8px", delay: "80ms" },
  { x: "84%", y: "58%", size: "5px", delay: "180ms" }
];

export function ErrorExperience({
  code,
  eyebrow,
  title,
  message,
  detail,
  primaryLabel,
  primaryHref,
  onPrimaryAction,
  secondaryLabel,
  secondaryHref
}: ErrorExperienceProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    panel.style.setProperty("--error-x", `${x}%`);
    panel.style.setProperty("--error-y", `${y}%`);
    panel.style.setProperty("--error-active", "1");
    panel.style.setProperty("--error-glow-opacity", "0.88");
  }

  function handlePointerLeave() {
    const panel = panelRef.current;

    panel?.style.setProperty("--error-active", "0");
    panel?.style.setProperty("--error-glow-opacity", "0.28");
  }

  const primaryButton = primaryHref ? (
    <Link className={buttonClasses("solid", "error-experience__button")} href={primaryHref}>
      <Home className="h-4 w-4" />
      <ScrambleText text={primaryLabel} />
    </Link>
  ) : (
    <button className={buttonClasses("solid", "error-experience__button")} onClick={onPrimaryAction} type="button">
      <RotateCcw className="h-4 w-4" />
      <ScrambleText text={primaryLabel} />
    </button>
  );

  return (
    <main className="error-experience">
      <div className="error-experience__panel" onPointerLeave={handlePointerLeave} onPointerMove={handlePointerMove} ref={panelRef}>
        <div className="error-experience__grid" />
        <div className="error-experience__glow" />
        <div className="error-experience__scanner">
          <span />
        </div>

        {nodes.map((node) => (
          <span
            className="error-experience__node"
            key={`${node.x}-${node.y}`}
            style={
              {
                "--node-x": node.x,
                "--node-y": node.y,
                "--node-size": node.size,
                "--node-delay": node.delay
              } as CSSProperties
            }
          />
        ))}

        <div className="error-experience__content">
          <p className="error-experience__eyebrow">{eyebrow}</p>
          <div className="error-experience__code" aria-hidden="true">
            {code}
          </div>
          <h1 className="error-experience__title" data-text={title}>
            {title}
          </h1>
          <p className="error-experience__message">{message}</p>

          {detail ? <p className="error-experience__detail">{detail}</p> : null}

          <div className="error-experience__actions">
            {primaryButton}
            {secondaryHref && secondaryLabel ? (
              <Link className={buttonClasses("ghost", "error-experience__button")} href={secondaryHref}>
                <ScrambleText text={secondaryLabel} />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
