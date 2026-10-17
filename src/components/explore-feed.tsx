"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { getExploreItem } from "@/lib/data";
import { useDesignVersion } from "@/lib/design";
import { feedResults, feedScopes, type ExploreFilter, type FeedScope, type FeedSort } from "@/lib/feed";
import { cn } from "@/lib/utils";
import { ExploreCard, ExploreDialog } from "./explore-card";
import { buttonClass, chipClass, SampleNote } from "./ui";

export { exploreFilters, type ExploreFilter, type FeedScope } from "@/lib/feed";

export function ExploreFeed({
  initialFilter = "All",
  initialSort = "recommended",
  initialItem,
  scope = "all",
  heading = "Explore Owerri",
  description = "Restaurants, cafés, market stalls, hotels, nature, hangout spots, events and cultural experiences around Owerri, Imo State.",
  showHeading = true,
}: {
  initialFilter?: ExploreFilter;
  initialSort?: FeedSort;
  initialItem?: string;
  scope?: FeedScope;
  heading?: string;
  description?: string;
  /** False when the page renders its own hero heading. */
  showHeading?: boolean;
}) {
  const { filters } = feedScopes[scope];
  const design = useDesignVersion(); // only the visible design version may open the deep-linked dialog
  const [filter, setFilter] = useState<ExploreFilter>(initialFilter);
  const [sort, setSort] = useState<FeedSort>(initialSort);
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | undefined>(initialItem);
  const openItem = openSlug ? getExploreItem(openSlug) : undefined;

  const results = useMemo(() => feedResults({ scope, filter, sort, query }), [scope, filter, sort, query]);

  return (
    <div className="container-x pb-6">
      {showHeading && (
        <div className="pt-4 lg:pt-10">
          <h1 className="text-[1.9rem] font-semibold text-forest sm:text-4xl lg:text-5xl">{heading}</h1>
          <p className="mt-2 max-w-2xl text-stone">{description}</p>
        </div>
      )}

      <div className="sticky top-16 z-30 -mx-4 bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[76px] lg:mx-0 lg:mt-4 lg:px-0">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="toolbar" aria-label="Explore categories">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={chipClass(filter === f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pb-4">
        <label className="relative order-last w-full sm:order-none sm:w-72">
          <span className="sr-only">Search Explore</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places and events…"
            className="h-10 w-full rounded-full border border-line bg-paper pr-9 pl-10 text-sm outline-none focus:border-forest"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 text-stone">
              <X className="size-4" />
            </button>
          )}
        </label>
        <p className="text-sm text-stone" aria-live="polite">
          <span className="font-bold text-ink">{results.length}</span> {results.length === 1 ? "result" : "results"}
        </p>
        <label className="relative ml-auto">
          <span className="sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as FeedSort)}
            className="h-9 appearance-none rounded-full border border-line bg-paper pr-9 pl-3.5 text-[0.82rem] font-semibold outline-none focus:border-forest"
          >
            <option value="recommended">Recommended</option>
            <option value="nearest">Nearest</option>
            <option value="rating">Top rated</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-2.5 right-3 size-4" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-start lg:gap-6">
        {results.map((item, i) => (
          <ExploreCard
            key={item.slug}
            item={item}
            priority={i < 2}
            size={i === 0 && sort === "recommended" ? "lg" : "md"}
            className={cn(i === 0 && sort === "recommended" && "lg:col-span-2")}
          />
        ))}
      </div>

      {results.length === 0 && (
        <div className="rounded-[1.25rem] border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold text-forest">Nothing here yet.</p>
          <p className="mt-2 text-stone">Try another category or clear your search.</p>
          <button
            onClick={() => {
              setFilter("All");
              setQuery("");
            }}
            className={buttonClass("forest", "md", "mt-6")}
          >
            Show everything
          </button>
        </div>
      )}

      <SampleNote className="pt-6">Events, venues and dates are sample content. Distances are approximate, from Owerri city centre.</SampleNote>
      <ExploreDialog item={design === "a" && openItem && !openItem.href ? openItem : null} onClose={() => setOpenSlug(undefined)} />
    </div>
  );
}
