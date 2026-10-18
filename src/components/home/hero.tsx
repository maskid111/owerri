import Link from "next/link";
import { Search } from "lucide-react";
import { HeroSearchField, HeroVideo } from "@/components/hero-video";
import { LandingStory } from "@/components/landing-story";

/**
 * Version A landing viewport: edge-to-edge cultural-dance footage, a short serif welcome sequence and
 * two controls — Explore and search — anchored bottom-left, like the rest of Version A.
 */
export function Hero() {
  return (
    <section
      aria-label="Igbo cultural celebration"
      className="relative isolate flex h-[calc(100svh-64px-env(safe-area-inset-bottom))] min-h-[30rem] items-end overflow-hidden text-white lg:h-[100svh] lg:min-h-[36rem]"
    >
      <HeroVideo>
        {/* Forest-green grade and gradients — the brand colour carried into the footage */}
        <div className="pointer-events-none absolute inset-0 bg-pine/35 mix-blend-soft-light" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-forest-deep/60 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-forest-deep/90 via-forest-deep/45 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-forest-deep/35 to-transparent" aria-hidden />
      </HeroVideo>

      <div className="relative container-x pb-7 sm:pb-12 lg:pb-16">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <LandingStory variant="a" />
        </div>
        <div className="flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/explore"
            className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-pine px-10 text-[0.95rem] font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-[#15573c]"
          >
            Explore
          </Link>
          <HeroSearchField
            id="hero-search-a"
            className="flex h-14 flex-1 items-center gap-3 rounded-full border border-white/35 bg-pine/35 pr-2 pl-6 backdrop-blur-md transition-colors focus-within:border-white focus-within:bg-pine/50"
            inputClassName="text-[0.95rem] text-white placeholder:text-white/80"
          >
            <button type="submit" className="grid size-10 shrink-0 place-items-center rounded-full text-white hover:bg-white/15" aria-label="Search">
              <Search className="size-5" />
            </button>
          </HeroSearchField>
        </div>
      </div>
    </section>
  );
}
