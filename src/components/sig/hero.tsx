"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { HeroSearchField } from "../hero-video";
import { HeroDots, HeroPhotos, useHeroSlide } from "../home/hero-slides";

/**
 * Version B homepage top: a rounded, compact food-photo hero card with centred text (label, headline,
 * one line, Explore Food, dots) and a floating search pill overlapping its lower edge.
 */
export function SigHero() {
  const [index, setIndex] = useHeroSlide();
  return (
    <section aria-label="Welcome to Native" className="container-x pt-3 lg:pt-6">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-forest-deep px-5 pt-9 pb-12 text-center text-white sm:pt-14 sm:pb-16 lg:rounded-[2.5rem] lg:pt-16 lg:pb-20">
        <HeroPhotos index={index} sizes="(min-width: 1280px) 1200px, 100vw" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/55 to-forest-deep/50" aria-hidden />
        <p className="text-[0.62rem] font-bold tracking-[0.18em] text-spark uppercase sm:text-xs">Food · Places · Culture</p>
        <h1 className="mx-auto mt-2 max-w-2xl text-[2rem] leading-[1.02] text-white sm:text-5xl lg:text-6xl">
          Real flavours.
          <br />
          True stories.
        </h1>
        <p className="mx-auto mt-2.5 max-w-sm text-[0.8rem] text-white/80 sm:text-base">Discover local restaurants, dishes, places and culture — and order your favourites.</p>
        <Link
          href="/restaurants"
          className="group mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-spark px-5 text-sm font-semibold text-[#1a1405] transition-colors hover:bg-[#eec676] sm:mt-6 sm:h-12 sm:px-6"
        >
          Explore Food <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <HeroDots index={index} onSelect={setIndex} className="mt-3 justify-center" />
      </div>

      <HeroSearchField
        id="hero-search-b"
        placeholder="Restaurants, dishes, places…"
        leading={<Search className="size-[18px] shrink-0 text-stone" aria-hidden />}
        className="relative z-10 mx-auto -mt-7 flex h-14 w-[calc(100%-1rem)] max-w-2xl items-center gap-3 rounded-full bg-paper p-1.5 pl-5 text-ink shadow-lift sm:h-16 sm:p-2 sm:pl-6"
        inputClassName="text-[0.9rem] text-ink placeholder:text-stone"
      >
        <button type="submit" className="inline-flex h-11 shrink-0 items-center rounded-full bg-forest px-5 text-sm font-semibold text-on-forest transition-colors hover:bg-forest-light sm:h-12 sm:px-7">
          Search
        </button>
      </HeroSearchField>
    </section>
  );
}
