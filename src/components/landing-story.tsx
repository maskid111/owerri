"use client";

import { useEffect, useState } from "react";
import { BRAND } from "./brand";
import { cn } from "@/lib/utils";

/**
 * The homepage welcome: short phrases revealed one at a time, word by word, over the video.
 * The sequence plays once and settles on the tagline. Screen readers get the full message once
 * (the animated copy is aria-hidden). With reduced motion, the opening line and tagline show
 * immediately with no movement.
 */
export const LANDING_PHRASES = [
  "Discover the heart of Owerri.",
  "Taste local.",
  "Explore culture.",
  "Find places worth discovering.",
  `${BRAND.tagline}.`,
] as const;

/** How long each phrase stays before the next (ms). The last phrase stays. */
const HOLD = [3400, 2200, 2200, 2800];
const EXIT = 650;

export function LandingStory({ variant }: { variant: "a" | "b" }) {
  const [index, setIndex] = useState(-1); // -1 = waiting (e.g. while the opening splash is visible)
  const [leaving, setLeaving] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Start after the opening splash (if it's showing), otherwise after a short beat.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const splash = Boolean(document.documentElement.dataset.splash);
    const t = window.setTimeout(
      () => {
        setReduced(reduce);
        setIndex(reduce ? LANDING_PHRASES.length - 1 : 0);
      },
      splash ? 2300 : reduce ? 0 : 500,
    );
    return () => window.clearTimeout(t);
  }, []);

  // Advance through the phrases.
  useEffect(() => {
    if (index < 0 || index >= LANDING_PHRASES.length - 1 || reduced) return;
    const out = window.setTimeout(() => setLeaving(true), HOLD[index]);
    const next = window.setTimeout(() => {
      setLeaving(false);
      setIndex((i) => i + 1);
    }, HOLD[index] + EXIT);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(next);
    };
  }, [index, reduced]);

  const last = LANDING_PHRASES.length - 1;
  const phrase = index >= 0 ? LANDING_PHRASES[index] : "";
  const isFinal = index === last;

  return (
    <div className={cn("relative", variant === "b" && "text-center")}>
      <p className="sr-only">{LANDING_PHRASES.join(" ")}</p>

      <div aria-hidden className={cn("min-h-[2.3em]", variant === "a" ? "text-[2.55rem] sm:text-6xl lg:text-[4.75rem]" : "text-[2.2rem] sm:text-5xl lg:text-[4rem]")}>
        {reduced ? (
          <>
            <Line variant={variant} text={LANDING_PHRASES[0]} still />
            <p className={cn("mt-4 text-base font-medium text-white/85 sm:text-lg", variant === "b" && "tracking-[0.18em] uppercase text-sm sm:text-sm")}>{BRAND.tagline}</p>
          </>
        ) : (
          index >= 0 && <Line key={index} variant={variant} text={phrase} leaving={leaving} final={isFinal} />
        )}
      </div>

      {/* Progress: five quiet marks, the current one in the accent colour */}
      {!reduced && (
        <div aria-hidden className={cn("mt-5 flex gap-1.5", variant === "b" && "justify-center")}>
          {LANDING_PHRASES.map((p, i) => (
            <span
              key={p}
              className={cn(
                "h-[2px] rounded-full transition-all duration-700",
                i === index ? "w-8 bg-spark" : i < index ? "w-3 bg-white/70" : "w-3 bg-white/30",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Line({ text, variant, leaving, final, still }: { text: string; variant: "a" | "b"; leaving?: boolean; final?: boolean; still?: boolean }) {
  const words = text.split(" ");
  return (
    <p
      className={cn(
        "leading-[1.02] text-balance text-white",
        variant === "a" ? "[text-shadow:0_2px_24px_rgb(0_0_0/0.35)]" : "[text-shadow:0_2px_18px_rgb(0_0_0/0.55)]",
        variant === "a" ? "max-w-[15ch] font-display font-medium tracking-[-0.02em]" : "mx-auto max-w-[16ch] font-display font-extrabold tracking-[-0.035em]",
        final && variant === "a" && "italic",
        leaving && "landing-out",
      )}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className={cn("inline-block", !still && "landing-word")} style={still ? undefined : { animationDelay: `${i * 90}ms` }}>
            {w}
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </p>
  );
}
