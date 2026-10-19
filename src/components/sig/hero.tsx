import Link from "next/link";
import { Search } from "lucide-react";
import { HeroSearchField, HeroVideo } from "../hero-video";
import { ExplorePattern } from "../explore-pattern";
import { LandingStory } from "../landing-story";

/**
 * Version B landing viewport: edge-to-edge cultural footage, a centred bold welcome sequence
 * and one floating pill that combines the search field with the Explore action.
 */
export function SigHero() {
  return (
    <section
      aria-label="Welcome to Native"
      className="relative isolate flex h-[calc(100svh-64px-env(safe-area-inset-bottom))] min-h-[30rem] items-end justify-center overflow-hidden text-white lg:h-[100svh] lg:min-h-[36rem]"
    >
      <HeroVideo>
        {/* Forest-green grade and gradients — the brand colour carried into the footage */}
        <div className="pointer-events-none absolute inset-0 bg-pine/35 mix-blend-soft-light" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-forest-deep/65 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-forest-deep/90 via-forest-deep/50 to-transparent" aria-hidden />
      </HeroVideo>

      <div className="relative w-full px-4 pb-8 sm:pb-14 lg:pb-20">
        <div className="mb-8 sm:mb-10">
          <LandingStory variant="b" />
        </div>
        <HeroSearchField
          id="hero-search-b"
          placeholder="Search Native…"
          className="mx-auto flex h-16 w-full max-w-xl items-center gap-2 rounded-full bg-white p-2 pl-5 text-ink shadow-lift"
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
      </div>
    </section>
  );
}
