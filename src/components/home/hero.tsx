"use client";

import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { HeroSearchField } from "@/components/hero-video";
import { HeroDots, HeroPhotos, heroSlides, useHeroSlide } from "./hero-slides";

/**
 * Version A homepage top, following the reference: a wide, cinematic food photograph with the text to one
 * side (label, editorial headline, one line, Explore Food), small slide dots, then the site search bar
 * (Enter searches; the filter icon opens Explore). Kept compact so the shortcuts and restaurants appear quickly on phones.
 */
export function Hero() {
  const [index, setIndex] = useHeroSlide();
  const slide = heroSlides[index];

  return (
    <>
      <section aria-label="Welcome to Native" className="relative isolate overflow-hidden bg-forest-deep text-white">
        <HeroPhotos index={index} className="lg:left-[34%]" sizes="(min-width: 1024px) 66vw, 100vw" />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-forest-deep/5 max-lg:via-forest-deep/70 max-lg:to-forest-deep/20"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-forest-deep/80 to-transparent" aria-hidden />

        <div className="container-x relative pt-[76px] pb-7 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-20">
          <div className="max-w-[16.5rem] sm:max-w-md lg:max-w-lg">
            <p className="text-[0.62rem] font-bold tracking-[0.18em] text-spark uppercase sm:text-xs">Food · Places · Culture</p>
            <h1 className="mt-2 font-display text-[2rem] leading-[1.02] font-semibold italic sm:text-5xl lg:text-6xl">
              Real Flavours.
              <br />
              True Stories.
            </h1>
            <p className="mt-2.5 text-[0.8rem] leading-relaxed text-white/80 sm:mt-4 sm:text-base">
              Discover local restaurants, dishes, places and culture — and order your favourites.
            </p>
            <Link
              href="/restaurants"
              className="group mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-spark px-5 text-sm font-semibold text-[#1a1405] transition-colors hover:bg-[#eec676] sm:mt-6 sm:h-12 sm:px-6"
            >
              Explore Food <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <HeroDots index={index} onSelect={setIndex} className="mt-3 sm:mt-5" />
          </div>
        </div>
        <p className="absolute right-4 bottom-5 hidden items-center gap-1 text-xs text-white/80 sm:flex lg:right-8 lg:bottom-8">
          <UtensilsCrossed className="size-3.5" aria-hidden /> {slide.caption}
        </p>
      </section>

      <div className="container-x pt-3 sm:pt-5">
        <HeroSearchField
          id="hero-search-a"
          placeholder="Restaurants, dishes, places…"
          leading={<Search className="size-[18px] shrink-0 text-stone" aria-hidden />}
          className="flex h-12 items-center gap-3 rounded-full border border-line bg-paper pr-1.5 pl-4 sm:h-14 sm:pl-5"
          inputClassName="text-[0.9rem] text-ink placeholder:text-stone"
        >
          <Link
            href="/explore"
            aria-label="Browse everything with filters"
            className="grid size-9 shrink-0 place-items-center rounded-full text-forest transition-colors hover:bg-sand sm:size-11"
          >
            <SlidersHorizontal className="size-[18px]" />
          </Link>
        </HeroSearchField>
      </div>
    </>
  );
}
