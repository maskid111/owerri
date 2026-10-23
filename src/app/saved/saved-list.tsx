"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { ExploreCard } from "@/components/explore-card";
import { ListingCard } from "@/components/restaurant-card";
import { Arrow, ButtonLink, chipClass } from "@/components/ui";
import { exploreItems, restaurants } from "@/lib/data";
import { useSaved } from "@/lib/saved-store";

export function SavedList() {
  const { saved } = useSaved();
  const [tab, setTab] = useState<"all" | "food" | "places">("all");
  const food = restaurants.filter((r) => saved.includes(r.slug));
  const other = exploreItems.filter((x) => x.kind !== "restaurant" && saved.includes(x.slug));

  if (food.length + other.length === 0) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-line px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-forest">
          <Heart className="size-6" />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-forest">Nothing saved yet</p>
        <p className="mx-auto mt-1 max-w-sm text-stone">Start exploring and tap the heart on places you want to try.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/explore">
            Explore Native <Arrow />
          </ButtonLink>
          <ButtonLink href="/restaurants" variant="outline">
            Food & restaurants
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="toolbar" aria-label="Filter saved">
        {(
          [
            ["all", `All (${food.length + other.length})`],
            ["food", `Food & drink (${food.length})`],
            ["places", `Places & events (${other.length})`],
          ] as const
        ).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} aria-pressed={tab === key} className={chipClass(tab === key)}>
            {label}
          </button>
        ))}
      </div>

      {tab !== "places" && food.length > 0 && (
        <div className="mt-4 grid divide-y divide-line md:grid-cols-2 md:gap-x-8 md:divide-y-0 md:[&>*]:border-b md:[&>*]:border-line">
          {food.map((r) => (
            <ListingCard key={r.slug} restaurant={r} />
          ))}
        </div>
      )}
      {tab !== "food" && other.length > 0 && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {other.map((x) => (
            <ExploreCard key={x.slug} item={x} />
          ))}
        </div>
      )}
    </div>
  );
}
