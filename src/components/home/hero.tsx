import Link from "next/link";
import { Search } from "lucide-react";
import { ExplorePattern } from "@/components/explore-pattern";
import { HeroSearchField, HeroVideo } from "@/components/hero-video";

/**
 * Version A homepage top: a compact, product-first hero over the Native footage (one headline,
 * Order food + Explore), then the site search overlapping its bottom edge. The service tiles follow
 * directly, so the main options are visible without scrolling.
 */
export function Hero() {
  return (
    <>
      <section aria-label="Welcome to Native" className="relative isolate overflow-hidden bg-forest-deep text-white">
        <HeroVideo className="-z-10">
          <div className="pointer-events-none absolute inset-0 bg-pine/30 mix-blend-soft-light" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/55 to-forest-deep/35 lg:bg-gradient-to-r lg:from-forest-deep lg:via-forest-deep/70 lg:to-forest-deep/10"
            aria-hidden
          />
        </HeroVideo>

        <div className="container-x pt-24 pb-16 sm:pt-28 lg:pt-36 lg:pb-24">
          <h1 className="max-w-xl font-display text-[2.5rem] leading-[1.02] font-medium sm:text-6xl">
            Real flavours.
            <br />
            Real places.
          </h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/restaurants" className="inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-forest-deep transition-colors hover:bg-cream">
              Order food
            </Link>
            <Link
              href="/explore"
              className="group relative isolate inline-flex h-12 items-center overflow-hidden rounded-full bg-pine px-8 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-[#15573c]"
            >
              <ExplorePattern />
              <span className="relative">Explore</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="container-x relative z-10 -mt-7">
        <HeroSearchField
          id="hero-search-a"
          placeholder="Restaurants, dishes, places…"
          className="flex h-14 items-center gap-2 rounded-full border border-line/70 bg-paper pr-1.5 pl-5 shadow-lift"
          inputClassName="text-[0.95rem] text-ink placeholder:text-stone"
        >
          <button type="submit" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-forest px-4 text-sm font-semibold text-on-forest transition-colors hover:bg-forest-light sm:px-5" aria-label="Search">
            <Search className="size-4" /> <span className="hidden sm:inline">Search</span>
          </button>
        </HeroSearchField>
      </div>
    </>
  );
}
