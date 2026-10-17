"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ListingCard } from "@/components/restaurant-card";
import { foodCategories, neighbourhoods, type FoodCategory } from "@/lib/data";
import { filterRestaurants, NO_RESTAURANT_FILTERS, type RestaurantFilters, type RestaurantSort } from "@/lib/restaurant-filter";
import { useLagosMinutes } from "@/lib/use-lagos-time";
import { cn, isOpenAt } from "@/lib/utils";
import { buttonClass, chipClass, SampleNote } from "./ui";

type Sort = RestaurantSort;
type Filters = RestaurantFilters;
const NO_FILTERS = NO_RESTAURANT_FILTERS;

export function RestaurantExplorer({ initialCategory, initialQuery = "" }: { initialCategory?: FoodCategory; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery));
  const [category, setCategory] = useState<FoodCategory | "All">(initialCategory ?? "All");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [sort, setSort] = useState<Sort>("recommended");
  const [sheetOpen, setSheetOpen] = useState(false);
  const minutes = useLagosMinutes();

  const results = useMemo(() => filterRestaurants({ query, category, filters, sort, minutes }), [query, category, filters, minutes, sort]);

  const filterCount = (filters.area !== "all" ? 1 : 0) + filters.prices.length + (filters.openOnly ? 1 : 0) + (filters.deliveryOnly ? 1 : 0);

  const reset = () => {
    setQuery("");
    setCategory("All");
    setFilters(NO_FILTERS);
  };

  return (
    <div className="container-x">
      {/* Title row */}
      <div className="flex items-center gap-2 pt-4 lg:pt-10">
        <Link href="/" aria-label="Back to home" className="-ml-2 grid size-10 place-items-center rounded-full text-forest hover:bg-forest/5 lg:hidden">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="flex-1 text-[1.6rem] leading-tight font-semibold tracking-tight text-forest min-[400px]:text-[1.75rem] sm:text-4xl lg:text-5xl">Food & Restaurants</h1>
        <button
          onClick={() => setSearchOpen((v) => !v)}
          aria-expanded={searchOpen}
          aria-label={searchOpen ? "Close search" : "Search restaurants"}
          className="grid size-10 place-items-center rounded-full text-forest hover:bg-forest/5 lg:hidden"
        >
          {searchOpen ? <X className="size-6" /> : <Search className="size-6" />}
        </button>
      </div>
      <p className="mt-1 hidden max-w-xl text-stone lg:block">Restaurants, bukas, cafés and bars across Owerri, Imo State — with pickup and delivery from local kitchens.</p>

      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden">
            <SearchInput query={query} setQuery={setQuery} autoFocus className="mt-3" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category chips */}
      <div className="sticky top-16 z-30 -mx-4 mt-3 border-b border-line/70 bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[76px] lg:mx-0 lg:mt-6 lg:px-0">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="toolbar" aria-label="Food categories">
          {(["All", ...foodCategories] as const).map((c) => (
            <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c} className={chipClass(category === c, "h-10 px-5 text-sm")}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[17rem_1fr] lg:gap-10 lg:pt-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[156px] space-y-6 rounded-[1.25rem] border border-line/70 bg-paper p-5 shadow-card">
            <SearchInput query={query} setQuery={setQuery} />
            <SortSelect sort={sort} setSort={setSort} />
            <FilterFields filters={filters} setFilters={setFilters} />
            {(filterCount > 0 || query || category !== "All") && (
              <button onClick={reset} className="text-sm font-semibold text-forest underline underline-offset-4">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between gap-3 pt-3 lg:pt-0">
            <p className="text-sm text-stone" aria-live="polite">
              <span className="font-bold text-ink">{results.length}</span> {results.length === 1 ? "place" : "places"}
              {category !== "All" && <> in {category}</>}
            </p>
            <div className="flex items-center gap-2 lg:hidden">
              <SortSelect sort={sort} setSort={setSort} compact />
              <button onClick={() => setSheetOpen(true)} className={cn(chipClass(filterCount > 0), "gap-1.5")}>
                <SlidersHorizontal className="size-4" /> Filters
                {filterCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-accent text-[11px] text-on-accent">{filterCount}</span>}
              </button>
            </div>
          </div>

          <div className="grid divide-y divide-line md:grid-cols-2 md:gap-x-8 md:divide-y-0 md:[&>*]:border-b md:[&>*]:border-line">
            {results.map((r, i) => (
              <ListingCard key={r.slug} restaurant={r} priority={i < 2} openNow={minutes === null ? undefined : isOpenAt(r.open, r.close, minutes)} />
            ))}
          </div>

          {results.length === 0 && (
            <div className="my-8 rounded-[1.25rem] border border-dashed border-line px-6 py-16 text-center">
              <p className="font-display text-2xl font-semibold text-forest">Nothing matches — yet.</p>
              <p className="mt-2 text-stone">Try a different category or widen your filters.</p>
              <button onClick={reset} className={buttonClass("forest", "md", "mt-6")}>
                Reset filters
              </button>
            </div>
          )}
          <SampleNote className="py-6">Distances are approximate, measured from Owerri city centre. Listings are sample content.</SampleNote>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close filters" className="absolute inset-0 bg-forest-deep/50" onClick={() => setSheetOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pb-safe absolute inset-x-0 bottom-0 rounded-t-[1.75rem] bg-canvas px-5 pt-3"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
              <div className="flex items-center justify-between">
                <p className="font-display text-xl font-semibold text-forest">Filters</p>
                <button onClick={() => setFilters(NO_FILTERS)} className="text-sm font-semibold text-forest underline underline-offset-4">
                  Reset
                </button>
              </div>
              <div className="mt-4">
                <FilterFields filters={filters} setFilters={setFilters} />
              </div>
              <button onClick={() => setSheetOpen(false)} className={buttonClass("primary", "lg", "my-5 w-full")}>
                Show {results.length} {results.length === 1 ? "place" : "places"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchInput({ query, setQuery, autoFocus, className }: { query: string; setQuery: (q: string) => void; autoFocus?: boolean; className?: string }) {
  return (
    <label className={cn("relative block", className)}>
      <span className="sr-only">Search restaurants</span>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" />
      <input
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name, cuisine or vibe…"
        className="h-11 w-full rounded-full border border-line bg-paper pr-10 pl-10 text-sm outline-none focus:border-forest"
      />
      {query && (
        <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-stone hover:bg-forest/5">
          <X className="size-4" />
        </button>
      )}
    </label>
  );
}

function SortSelect({ sort, setSort, compact }: { sort: Sort; setSort: (s: Sort) => void; compact?: boolean }) {
  return (
    <label className="relative block">
      {!compact && <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-stone uppercase">Sort by</span>}
      <span className="sr-only">Sort by</span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as Sort)}
        className={cn(
          "w-full appearance-none rounded-full border border-line bg-paper pr-9 font-semibold text-ink outline-none focus:border-forest",
          compact ? "h-9 pl-3.5 text-[0.82rem]" : "h-11 pl-4 text-sm",
        )}
      >
        <option value="recommended">Recommended</option>
        <option value="nearest">Nearest</option>
        <option value="rating">Top rated</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
      <ChevronDown className={cn("pointer-events-none absolute right-3 size-4", compact ? "top-2.5" : "bottom-3.5")} />
    </label>
  );
}

function FilterFields({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const label = "mb-2 block text-xs font-bold tracking-[0.12em] text-stone uppercase";
  return (
    <div className="space-y-5">
      <label className="block">
        <span className={label}>Neighbourhood</span>
        <span className="relative block">
          <select
            value={filters.area}
            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
            className="h-11 w-full appearance-none rounded-full border border-line bg-paper pr-9 pl-4 text-sm outline-none focus:border-forest"
          >
            <option value="all">Anywhere in Owerri</option>
            {neighbourhoods.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-3.5 right-3 size-4" />
        </span>
      </label>
      <div>
        <span className={label}>Price</span>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((p) => {
            const on = filters.prices.includes(p);
            return (
              <button
                key={p}
                aria-pressed={on}
                onClick={() => setFilters({ ...filters, prices: on ? filters.prices.filter((x) => x !== p) : [...filters.prices, p] })}
                className={chipClass(on, "h-10 px-0")}
              >
                {"₦".repeat(p)}
              </button>
            );
          })}
        </div>
      </div>
      {(
        [
          ["openOnly", "Open now"],
          ["deliveryOnly", "Pickup or delivery"],
        ] as const
      ).map(([key, text]) => (
        <button
          key={key}
          role="switch"
          aria-checked={filters[key]}
          onClick={() => setFilters({ ...filters, [key]: !filters[key] })}
          className="flex h-11 w-full items-center justify-between rounded-full border border-line bg-paper px-4 text-sm font-semibold"
        >
          {text}
          <span className={cn("relative h-6 w-11 rounded-full transition-colors", filters[key] ? "bg-forest" : "bg-ink/15")}>
            <span className={cn("absolute top-1 size-4 rounded-full bg-white shadow transition-all", filters[key] ? "left-6" : "left-1")} />
          </span>
        </button>
      ))}
    </div>
  );
}
