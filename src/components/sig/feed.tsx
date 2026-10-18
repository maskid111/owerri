"use client";

import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { getExploreItem } from "@/lib/data";
import { useDesignVersion } from "@/lib/design";
import { exploreFilters, feedResults, feedScopes, type ExploreFilter, type FeedScope, type FeedSort } from "@/lib/feed";
import { cn } from "@/lib/utils";
import { SigDetailSheet, SigExploreItem } from "./explore-item";
import { sigBtn } from "./ui";

/** Version B discovery feed — same data and filtering as Version A, different presentation. */
export function SigFeed({
  scope = "all",
  initialFilter = "All",
  initialSort = "recommended",
  initialItem,
}: {
  scope?: FeedScope;
  initialFilter?: ExploreFilter;
  initialSort?: FeedSort;
  initialItem?: string;
}) {
  const { filters } = feedScopes[scope];
  const design = useDesignVersion(); // only the visible design version may open the deep-linked sheet
  const [filter, setFilter] = useState<ExploreFilter>(initialFilter);
  const [sort, setSort] = useState<FeedSort>(initialSort);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openSlug, setOpenSlug] = useState(initialItem);
  const openItem = openSlug ? getExploreItem(openSlug) : undefined;
  const results = useMemo(() => feedResults({ scope, filter, sort, query }), [scope, filter, sort, query]);

  return (
    <div className="container-x -mt-8 pb-6 lg:-mt-10">
      <div className="relative z-10 rounded-[1.75rem] bg-paper p-3 shadow-lift sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places, events, kitchens…"
              className="h-12 w-full rounded-full bg-sand pr-10 pl-11 text-sm outline-none focus:ring-2 focus:ring-forest"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-stone">
                <X className="size-4" />
              </button>
            )}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-sand p-1" role="radiogroup" aria-label="Sort">
              {(
                [
                  ["recommended", "Popular"],
                  ["nearest", "Nearest"],
                  ["rating", "Rated"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  role="radio"
                  aria-checked={sort === v}
                  onClick={() => setSort(v)}
                  className={cn("h-10 rounded-full px-3 whitespace-nowrap text-xs font-semibold transition-colors sm:px-4", sort === v ? "bg-forest text-on-forest" : "text-stone hover:text-forest")}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="ml-auto flex rounded-full bg-sand p-1" role="radiogroup" aria-label="Layout">
              {(
                [
                  ["grid", LayoutGrid],
                  ["list", List],
                ] as const
              ).map(([v, Icon]) => (
                <button
                  key={v}
                  role="radio"
                  aria-checked={view === v}
                  aria-label={v === "grid" ? "Grid view" : "List view"}
                  onClick={() => setView(v)}
                  className={cn("grid size-10 place-items-center rounded-full transition-colors", view === v ? "bg-forest text-on-forest" : "text-stone")}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto border-t border-line pt-1" role="tablist" aria-label="Categories">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "relative shrink-0 px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors",
                filter === f ? "text-forest" : "text-stone hover:text-forest",
              )}
            >
              {f}
              <span className={cn("absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-forest transition-transform", filter === f ? "scale-x-100" : "scale-x-0")} />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 mb-4 text-sm font-semibold text-stone" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      {view === "grid" ? (
        <div className="grid-cols-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((x) => (
            <SigExploreItem key={x.slug} item={x} />
          ))}
        </div>
      ) : (
        <div className="grid-cols-1 grid gap-3 lg:grid-cols-2">
          {results.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant={x.kind === "event" ? "ticket" : "row"} />
          ))}
        </div>
      )}

      {results.length === 0 && (
        <div className="rounded-[1.75rem] border-2 border-dashed border-line px-6 py-16 text-center">
          <p className="text-2xl font-extrabold text-forest">Nothing here yet.</p>
          <p className="mt-2 text-stone">Try another category or clear your search.</p>
          <button
            onClick={() => {
              setFilter("All");
              setQuery("");
            }}
            className={sigBtn("solid", "mt-6")}
          >
            Show everything
          </button>
        </div>
      )}
      <p className="pt-8 text-center text-xs text-stone">Events, venues and dates are sample content. Distances are approximate, from Owerri city centre.</p>
      <SigDetailSheet item={design === "b" && openItem && !openItem.href ? openItem : null} onClose={() => setOpenSlug(undefined)} />
    </div>
  );
}

/** Reads ?cat=, ?sort=nearby and ?item= like Version A's ScopedFeed. */
export function SigScopedFeed({ scope = "all", defaultSort = "recommended" }: { scope?: FeedScope; defaultSort?: FeedSort }) {
  const params = useSearchParams();
  const filter = exploreFilters.find((f) => f === params.get("cat")) ?? "All";
  const sort = params.get("sort") === "nearby" ? "nearest" : defaultSort;
  const item = params.get("item") ?? undefined;
  return <SigFeed key={`${filter}|${sort}|${item}`} scope={scope} initialFilter={filter} initialSort={sort} initialItem={item} />;
}
