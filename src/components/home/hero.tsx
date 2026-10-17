"use client";

import { Search } from "lucide-react";
import { openSearch } from "@/components/search-dialog";
import { Arrow, ButtonLink, buttonClass, Photo } from "@/components/ui";

/** Dark-green, food-photography-led hero from the homepage reference. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-deep text-cream">
      <div className="absolute inset-y-0 right-0 -z-10 w-[72%] sm:w-[62%] lg:w-[56%]">
        <Photo name="egusi" alt="A bowl of egusi soup with assorted meats" sizes="(min-width: 1024px) 56vw, 78vw" priority className="object-[30%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/60 to-forest-deep/0" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent to-forest-deep/50" />
      </div>

      <div className="container-x pt-24 pb-14 sm:pt-32 lg:pt-44 lg:pb-28">
        <svg viewBox="0 0 40 30" className="-mb-1 ml-[-6px] h-7 w-9 text-sun" aria-hidden>
          <path d="M14 22 6 16M20 18 18 6M26 22l9-7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
        <h1 className="max-w-[11ch] text-[2.55rem] leading-[1.02] font-semibold text-cream sm:text-6xl lg:text-[4.6rem]">Find your next favourite place.</h1>
        <p className="mt-4 max-w-[19rem] text-[0.95rem] leading-relaxed text-cream/85 sm:max-w-md sm:text-lg">
          Discover the flavours, people and places that make Owerri special.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href="/explore?sort=nearby" size="lg" className="h-12 px-6 text-[0.95rem] lg:h-14 lg:px-7">
            Explore nearby <Arrow />
          </ButtonLink>
          <button type="button" onClick={openSearch} className={buttonClass("light", "lg", "h-12 max-sm:hidden lg:h-14")}>
            <Search className="size-4" /> Search Owerri
          </button>
        </div>
      </div>
    </section>
  );
}
