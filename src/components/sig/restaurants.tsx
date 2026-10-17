"use client";

import { useSearchParams } from "next/navigation";
import { Coffee, Fish, Flame, Martini, Pizza, Search, Soup, Sparkles, UtensilsCrossed, Wheat, X, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { foodCategories, type FoodCategory } from "@/lib/data";
import { filterRestaurants, NO_RESTAURANT_FILTERS, type RestaurantSort } from "@/lib/restaurant-filter";
import { useLagosMinutes } from "@/lib/use-lagos-time";
import { cn } from "@/lib/utils";
import { sigBtn, SigRestaurantCard } from "./ui";

const icons: Record<FoodCategory | "All", LucideIcon> = {
  All: Sparkles,
  Local: Soup,
  Continental: UtensilsCrossed,
  "Fast Food": Pizza,
  "Grill & Suya": Flame,
  Cafés: Coffee,
  "Bars & Lounges": Martini,
  Seafood: Fish,
  "Street Food": Wheat,
};

/** Version B restaurant browser — shared filter logic, portrait-card presentation. */
export function SigRestaurants({ initialCategory, initialQuery = "" }: { initialCategory?: FoodCategory; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<FoodCategory | "All">(initialCategory ?? "All");
  const [sort, setSort] = useState<RestaurantSort>("recommended");
  const [openOnly, setOpenOnly] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const minutes = useLagosMinutes();
  const results = useMemo(
    () => filterRestaurants({ query, category, sort, minutes, filters: { ...NO_RESTAURANT_FILTERS, openOnly, deliveryOnly } }),
    [query, category, sort, minutes, openOnly, deliveryOnly],
  );

  return (
    <div className="container-x -mt-8 grid grid-cols-1 gap-8 pb-10 lg:-mt-10 lg:grid-cols-[15rem_1fr]">
      <aside className="relative z-10 min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[1.75rem] bg-paper p-3 shadow-lift">
          <label className="relative block">
            <span className="sr-only">Search kitchens</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kitchens…"
              className="h-11 w-full rounded-full bg-sand pr-9 pl-10 text-sm outline-none focus:ring-2 focus:ring-forest"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-3 -translate-y-1/2 text-stone">
                <X className="size-4" />
              </button>
            )}
          </label>
          <ul className="no-scrollbar mt-3 flex gap-1 overflow-x-auto lg:flex-col" role="tablist" aria-label="Food categories">
            {(["All", ...foodCategories] as const).map((c) => {
              const Icon = icons[c];
              const active = category === c;
              return (
                <li key={c} className="shrink-0">
                  <button
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-left text-sm font-bold whitespace-nowrap transition-colors lg:rounded-xl",
                      active ? "bg-forest text-on-forest" : "text-ink/75 hover:bg-mint hover:text-forest",
                    )}
                  >
                    <Icon className="size-4" /> {c}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="min-w-0 lg:pt-16">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-[0.7rem] font-bold tracking-[0.2em] text-stone uppercase" aria-live="polite">
            {results.length} kitchens{category !== "All" && ` · ${category}`}
          </p>
          {(
            [
              [openOnly, setOpenOnly, "Open now"],
              [deliveryOnly, setDeliveryOnly, "Pickup / delivery"],
            ] as const
          ).map(([on, set, label]) => (
            <button
              key={label}
              aria-pressed={on}
              onClick={() => set(!on)}
              className={cn("rounded-full border-2 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.1em] uppercase transition-colors", on ? "border-forest bg-forest text-on-forest" : "border-line text-forest hover:border-forest")}
            >
              {label}
            </button>
          ))}
          <label className="relative">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as RestaurantSort)}
              className="h-9 rounded-full border-2 border-line bg-paper px-3 text-[0.72rem] font-bold text-forest outline-none focus:border-forest"
            >
              <option value="recommended">Recommended</option>
              <option value="nearest">Nearest</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
          </label>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {results.map((r) => (
            <SigRestaurantCard key={r.slug} restaurant={r} />
          ))}
        </div>
        {results.length === 0 && (
          <div className="rounded-[1.75rem] border-2 border-dashed border-line px-6 py-16 text-center">
            <p className="text-2xl font-extrabold text-forest">No kitchens match.</p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
                setOpenOnly(false);
                setDeliveryOnly(false);
              }}
              className={sigBtn("solid", "mt-6")}
            >
              Reset
            </button>
          </div>
        )}
        <p className="pt-8 text-xs text-stone">Distances are approximate, from Owerri city centre. Listings are sample content.</p>
      </div>
    </div>
  );
}

export function SigRestaurantsFromParams() {
  const params = useSearchParams();
  const category = foodCategories.find((c) => c === params.get("category"));
  const q = params.get("q") ?? "";
  return <SigRestaurants key={`${category ?? "all"}|${q}`} initialCategory={category} initialQuery={q} />;
}
