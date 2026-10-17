import { exploreCategories, exploreItems, type ExploreCategory, type ExploreItem } from "./data";

/** Discovery-feed logic shared by both design versions (presentation lives in the components). */
export type ExploreFilter = "All" | "Events" | ExploreCategory;
export const exploreFilters: ExploreFilter[] = ["All", "Events", ...exploreCategories];
export type FeedSort = "recommended" | "nearest" | "rating";

/** Named slices of the feed used by Nearby, Events & Hangouts and the Tours pages (serialisable for server pages). */
export type FeedScope = "all" | "nearby" | "events" | "stays" | "nature";
export const feedScopes: Record<FeedScope, { match: (x: ExploreItem) => boolean; filters: ExploreFilter[] }> = {
  all: { match: () => true, filters: exploreFilters },
  nearby: { match: (x) => x.kind !== "event" && (x.distanceKm ?? 99) <= 5, filters: ["All", "Food & Drink", "Market", "Stays", "Culture", "Hangouts", "Family"] },
  events: {
    match: (x) => x.kind === "event" || x.categories.includes("Hangouts") || x.categories.includes("Music"),
    filters: ["All", "Events", "Hangouts", "Music", "Culture", "Family", "Food & Drink"],
  },
  stays: { match: (x) => x.kind === "place" && (x.label === "Stay" || x.label === "Getaway"), filters: ["All", "Nature", "Family", "Recreation"] },
  nature: { match: (x) => x.categories.includes("Nature"), filters: ["All", "Recreation", "Family", "Stays"] },
};

/** Leads the default feed, as in the Explore reference. */
const FEATURED = "owerri-cultural-festival";

/** Round-robin events, places and restaurants so the default feed mixes like the reference. */
function mixed(items: ExploreItem[]) {
  const groups = [
    items.filter((x) => x.kind === "event").sort((a, b) => Number(b.slug === FEATURED) - Number(a.slug === FEATURED) || (a.date ?? "").localeCompare(b.date ?? "")),
    items.filter((x) => x.kind === "place"),
    items.filter((x) => x.kind === "restaurant").sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
  ];
  const out: ExploreItem[] = [];
  for (let i = 0; out.length < items.length; i++) groups.forEach((g) => g[i] && out.push(g[i]));
  return out;
}


export function feedResults({ scope, filter, sort, query }: { scope: FeedScope; filter: ExploreFilter; sort: FeedSort; query: string }) {
  const { match } = feedScopes[scope];
  const q = query.trim().toLowerCase();
  const list = exploreItems.filter((x) => {
    if (!match(x)) return false;
    if (filter === "Events" && x.kind !== "event") return false;
    if (filter !== "All" && filter !== "Events" && !x.categories.includes(filter)) return false;
    if (q && !`${x.title} ${x.location} ${x.description} ${x.label} ${x.categories.join(" ")}`.toLowerCase().includes(q)) return false;
    return true;
  });
  if (sort === "nearest") return [...list].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
  if (sort === "rating") return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return mixed(list);
}
