"use client";

import { useEffect, useState } from "react";
import type { ImageName } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Photo } from "../ui";

/** Local dishes for the homepage hero (egusi, nkwobi, pepper soup), cross-fading every 6 s (paused under reduced motion). */
export const heroSlides: { image: ImageName; alt: string; caption: string }[] = [
  { image: "egusi", alt: "A bowl of egusi soup with tripe, cow foot and assorted meat", caption: "Egusi soup" },
  { image: "nkwobi", alt: "Nkwobi — spiced cow foot in palm-oil sauce with onions and utazi leaves", caption: "Nkwobi" },
  { image: "pepper-soup-pot", alt: "A large pot of goat meat pepper soup", caption: "Pot of goat pepper soup" },
];

export function useHeroSlide() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6000);
    return () => window.clearInterval(id);
  }, [index]);
  return [index, setIndex] as const;
}

/** Stacked photos; the active one is opaque. `className` positions the stack (e.g. right-hand side on desktop). */
export function HeroPhotos({ index, className, sizes = "100vw" }: { index: number; className?: string; sizes?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-20", className)}>
      {heroSlides.map((s, i) => (
        <Photo
          key={s.image}
          name={s.image}
          alt={i === index ? s.alt : ""}
          sizes={sizes}
          priority={i === 0}
          className={cn("transition-opacity duration-1000 ease-out", i === index ? "opacity-100" : "opacity-0")}
        />
      ))}
    </div>
  );
}

/** Small dot indicators that also switch slides. */
export function HeroDots({ index, onSelect, className }: { index: number; onSelect: (i: number) => void; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} role="tablist" aria-label="Hero photos">
      {heroSlides.map((s, i) => (
        <button
          key={s.image}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={s.caption}
          onClick={() => onSelect(i)}
          className="grid h-6 place-items-center"
        >
          <span className={cn("block h-1.5 rounded-full transition-all", i === index ? "w-6 bg-spark" : "w-1.5 bg-white/50")} />
        </button>
      ))}
    </div>
  );
}
