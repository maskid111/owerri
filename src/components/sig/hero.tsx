import Link from "next/link";
import { Search } from "lucide-react";
import { ExplorePattern } from "../explore-pattern";
import { HeroSearchField, HeroVideo } from "../hero-video";

/**
 * Version B homepage top: a rounded hero card over the Native footage with one centred headline, and a
 * floating search pill (search + Explore) overlapping its bottom edge. Service bubbles follow directly.
 */
export function SigHero() {
  return (
    <section aria-label="Welcome to Native" className="container-x pt-3 lg:pt-6">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-forest-deep px-5 pt-10 pb-16 text-center text-white sm:pt-14 sm:pb-20 lg:rounded-[2.75rem] lg:pt-20 lg:pb-24">
        <HeroVideo className="-z-10">
          <div className="pointer-events-none absolute inset-0 bg-pine/30 mix-blend-soft-light" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/55 to-forest-deep/45" aria-hidden />
        </HeroVideo>
        <h1 className="mx-auto max-w-2xl text-[2.5rem] leading-[1] text-white sm:text-6xl lg:text-7xl">
          Good food.
          <br />
          Real places.
        </h1>
      </div>

      <HeroSearchField
        id="hero-search-b"
        placeholder="Food, places, events…"
        className="relative z-10 mx-auto -mt-8 flex h-16 w-full max-w-2xl items-center gap-2 rounded-full bg-paper p-2 pl-5 text-ink shadow-lift"
        inputClassName="text-[0.95rem] text-ink placeholder:text-stone"
      >
        <button type="submit" className="grid size-11 shrink-0 place-items-center rounded-full text-forest hover:bg-sand" aria-label="Search">
          <Search className="size-5" />
        </button>
        <Link
          href="/explore"
          className="group relative isolate inline-flex h-12 shrink-0 items-center overflow-hidden rounded-full bg-forest px-6 text-sm font-semibold text-on-forest transition-colors hover:bg-forest-light sm:px-8"
        >
          <ExplorePattern />
          <span className="relative">Explore</span>
        </Link>
      </HeroSearchField>
    </section>
  );
}
