"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { openSearch } from "@/components/search-dialog";
import { Arrow, ButtonLink, Photo } from "@/components/ui";
import type { ImageName } from "@/lib/images";
import { cn } from "@/lib/utils";

const slides: { eyebrow: string; title: string; text: string; cta: string; href: string; image: ImageName; alt: string; position?: string }[] = [
  {
    eyebrow: "Explore. Experience. Belong.",
    title: "Discover local gems.",
    text: "Food, culture, places and experiences — all in one place.",
    cta: "Explore now",
    href: "/explore",
    image: "woman-headwrap",
    alt: "A woman in a vibrant headwrap, lit in warm evening light",
    position: "object-[70%_center]",
  },
  {
    eyebrow: "Local Market",
    title: "Taste the heartland.",
    text: "Order Ofe Owerri, egusi and pepper soup from local kitchens — or shop the market for the ingredients.",
    cta: "Visit the market",
    href: "/market",
    image: "soups-spread",
    alt: "Bowls of traditional Nigerian soups on a marble table",
  },
  {
    eyebrow: "Tours",
    title: "Stay where the palms grow.",
    text: "Lodges, lakes and forest rivers within easy reach of Owerri.",
    cta: "Plan a getaway",
    href: "/tours",
    image: "lodge",
    alt: "A thatched lodge in front of forested hills",
  },
  {
    eyebrow: "Events & Hangouts",
    title: "Where Owerri gathers.",
    text: "Festivals, masquerades, highlife nights and food walks.",
    cta: "See what’s on",
    href: "/events",
    image: "festival",
    alt: "A cultural festival procession in red and coral",
  },
];

const INTERVAL = 7000;

/** Full-bleed photographic hero with the brand pattern blended into the left edge. */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, paused]);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative isolate flex min-h-[38rem] items-end overflow-hidden bg-forest-deep text-cream sm:min-h-[40rem] lg:h-[min(92vh,54rem)] lg:min-h-[44rem]"
    >
      {slides.map((s, i) => (
        <div key={s.image} className={cn("absolute inset-0 -z-20 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")} aria-hidden={i !== index}>
          <Photo name={s.image} alt={s.alt} sizes="100vw" priority={i === 0} className={s.position} />
        </div>
      ))}
      {/* Brand pattern fading into the photography */}
      <div className="absolute inset-y-0 left-0 -z-10 w-full bg-native-pattern-lg opacity-70 [mask-image:linear-gradient(to_right,black,transparent_55%)] lg:w-3/4" aria-hidden />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/95 via-forest-deep/45 to-forest-deep/40 lg:bg-gradient-to-r lg:from-forest-deep/90 lg:via-forest-deep/45 lg:to-transparent"
        aria-hidden
      />

      <div className="container-x w-full pt-28 pb-24 lg:pb-32">
        <div key={index} className="max-w-xl motion-safe:animate-[heroIn_0.7s_ease-out]" aria-live="polite">
          <p className="text-[0.7rem] font-bold tracking-[0.22em] text-leaf uppercase sm:text-xs">{slide.eyebrow}</p>
          <h1 className="mt-3 text-[2.9rem] leading-[0.98] font-semibold text-balance text-cream sm:text-6xl lg:text-[5.2rem]">{slide.title}</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-cream/85 sm:text-lg">{slide.text}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href={slide.href} variant="cream" size="lg" className="h-12 lg:h-14">
              {slide.cta} <Arrow />
            </ButtonLink>
          </div>
        </div>

        <button
          type="button"
          onClick={openSearch}
          className="mt-8 flex h-14 w-full max-w-xl items-center gap-3 rounded-full bg-paper/95 pr-2 pl-5 text-left text-stone shadow-lift backdrop-blur transition-colors hover:bg-paper"
        >
          <Search className="size-5 text-forest" aria-hidden />
          <span className="flex-1 truncate text-sm sm:text-base">Search for food, places, events…</span>
          <span className="hidden h-10 items-center rounded-full bg-forest px-5 text-sm font-semibold text-on-forest sm:inline-flex">Search</span>
        </button>

        <div className="mt-8 flex items-center gap-4">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="grid size-10 place-items-center rounded-full border border-cream/40 hover:bg-cream/10">
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={s.image}
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                onClick={() => go(i)}
                className={cn("h-1.5 rounded-full transition-all", i === index ? "w-10 bg-cream" : "w-4 bg-cream/40 hover:bg-cream/70")}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="grid size-10 place-items-center rounded-full border border-cream/40 hover:bg-cream/10">
            <ChevronRight className="size-5" />
          </button>
          <span className="ml-1 text-sm text-cream/75 tabular-nums">
            {index + 1}/{slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}
