"use client";

import { useEffect, useRef, useState } from "react";

const scrambleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_<>[]{}";

type ScrambleTextProps = {
  text: string;
  className?: string;
  corners?: boolean;
};

function randomCharacter() {
  return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)] ?? "_";
}

function getScrambledValue(text: string, progress: number) {
  const revealCursor = progress * text.length;

  return text
    .split("")
    .map((character, index) => {
      if (character === " ") {
        return " ";
      }

      return revealCursor > index + 0.75 ? character : randomCharacter();
    })
    .join("");
}

export function ScrambleText({ text, className, corners = false }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const textRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    const element = textRef.current;

    if (!element) {
      return undefined;
    }

    const trigger = element.closest("a, button") ?? element;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const runScramble = () => {
      if (prefersReducedMotion) {
        setDisplayText(text);
        return;
      }

      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }

      const startedAt = performance.now();
      const duration = 520;

      const animate = (time: number) => {
        const progress = Math.min((time - startedAt) / duration, 1);
        setDisplayText(getScrambledValue(text, progress));

        if (progress < 1) {
          animationRef.current = window.requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
          animationRef.current = null;
        }
      };

      animationRef.current = window.requestAnimationFrame(animate);
    };

    trigger.addEventListener("pointerenter", runScramble);
    trigger.addEventListener("focus", runScramble);

    return () => {
      trigger.removeEventListener("pointerenter", runScramble);
      trigger.removeEventListener("focus", runScramble);

      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text]);

  const classes = ["scramble-text", corners ? "scramble-text--corners" : "", className].filter(Boolean).join(" ");

  return (
    <span
      aria-label={text}
      className={classes}
      ref={textRef}
      style={{ width: `${Math.max(text.length, 2)}ch` }}
    >
      {displayText}
    </span>
  );
}
