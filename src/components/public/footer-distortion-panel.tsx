"use client";

import { useMemo, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";

type FooterDistortionPanelProps = {
  brandName: string;
};

function getDisplayWord(value: string) {
  const normalized = value.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return normalized || "LUMIATECH";
}

export function FooterDistortionPanel({ brandName }: FooterDistortionPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const word = useMemo(() => getDisplayWord(brandName), [brandName]);
  const letters = useMemo(() => word.split(""), [word]);

  function resetLetters() {
    panelRef.current?.style.setProperty("--distortion-active", "0");

    letterRefs.current.forEach((letter) => {
      letter?.style.setProperty("--letter-strength", "0");
      letter?.style.setProperty("--letter-shift-x", "0px");
      letter?.style.setProperty("--letter-shift-y", "0px");
      letter?.style.setProperty("--letter-skew", "0deg");
      letter?.style.setProperty("--letter-blur", "0px");
      letter?.style.setProperty("--letter-scale-y", "1");
      letter?.style.setProperty("--letter-slice-x", "0px");
      letter?.style.setProperty("--letter-slice-neg-x", "0px");
      letter?.style.setProperty("--letter-slice-y", "0px");
      letter?.style.setProperty("--letter-slice-neg-y", "0px");
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const panelRect = panel.getBoundingClientRect();
    const localX = event.clientX - panelRect.left;
    const localY = event.clientY - panelRect.top;
    const xPercent = (localX / panelRect.width) * 100;
    const yPercent = (localY / panelRect.height) * 100;

    panel.style.setProperty("--distortion-active", "1");
    panel.style.setProperty("--distortion-x", `${xPercent}%`);
    panel.style.setProperty("--distortion-y", `${yPercent}%`);

    letterRefs.current.forEach((letter) => {
      if (!letter) {
        return;
      }

      const letterRect = letter.getBoundingClientRect();
      const centerX = letterRect.left - panelRect.left + letterRect.width / 2;
      const centerY = letterRect.top - panelRect.top + letterRect.height / 2;
      const distance = Math.hypot(localX - centerX, localY - centerY);
      const strength = Math.max(0, 1 - distance / 230);
      const directionX = (localX - centerX) / Math.max(letterRect.width, 1);
      const directionY = (localY - centerY) / Math.max(letterRect.height, 1);
      const shiftX = directionX * strength * 28;
      const shiftY = directionY * strength * 16;
      const skew = directionX * strength * 12;
      const slice = strength * 18;

      letter.style.setProperty("--letter-strength", strength.toFixed(3));
      letter.style.setProperty("--letter-shift-x", `${shiftX.toFixed(2)}px`);
      letter.style.setProperty("--letter-shift-y", `${shiftY.toFixed(2)}px`);
      letter.style.setProperty("--letter-skew", `${skew.toFixed(2)}deg`);
      letter.style.setProperty("--letter-blur", `${(strength * 0.9).toFixed(2)}px`);
      letter.style.setProperty("--letter-scale-y", (1 + strength * 0.08).toFixed(3));
      letter.style.setProperty("--letter-slice-x", `${slice.toFixed(2)}px`);
      letter.style.setProperty("--letter-slice-neg-x", `${(-slice).toFixed(2)}px`);
      letter.style.setProperty("--letter-slice-y", `${(strength * 10).toFixed(2)}px`);
      letter.style.setProperty("--letter-slice-neg-y", `${(-strength * 12).toFixed(2)}px`);
    });
  }

  return (
    <section
      aria-label={`${brandName} interactive wordmark`}
      className="footer-distortion-panel"
      onPointerLeave={resetLetters}
      onPointerMove={handlePointerMove}
      ref={panelRef}
    >
      <div className="footer-distortion-panel__grid" />
      <div className="footer-distortion-panel__cursor-glow" />
      <div className="footer-distortion-panel__corner footer-distortion-panel__corner--tl" />
      <div className="footer-distortion-panel__corner footer-distortion-panel__corner--tr" />
      <div className="footer-distortion-panel__corner footer-distortion-panel__corner--bl" />
      <div className="footer-distortion-panel__corner footer-distortion-panel__corner--br" />
      <div className="footer-distortion-panel__meta">
        <span>ENGINEERING SIGNAL</span>
        <span>{new Date().getFullYear()}</span>
      </div>
      <div
        aria-label={word}
        className="footer-distortion-word"
        style={
          {
            "--letter-count": letters.length
          } as CSSProperties
        }
      >
        {letters.map((letter, index) => (
          <span
            aria-hidden="true"
            className="footer-distortion-word__letter"
            data-letter={letter}
            key={`${letter}-${index}`}
            ref={(element) => {
              letterRefs.current[index] = element;
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </section>
  );
}
