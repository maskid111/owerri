import { getMenu, restaurants, TOP_RESTAURANTS, type FoodCategory } from "./data";
import { isOpenAt } from "./utils";

/** Restaurant search / filter / sort logic shared by both design versions. */
export type RestaurantSort = "recommended" | "nearest" | "rating" | "price-asc" | "price-desc";
export type RestaurantFilters = { area: string; prices: number[]; openOnly: boolean; deliveryOnly: boolean };
export const NO_RESTAURANT_FILTERS: RestaurantFilters = { area: "all", prices: [], openOnly: false, deliveryOnly: false };

/** Lower-case, straight apostrophes — so "annie's" finds "Annie’s Kitchen". */
const norm = (s: string) => s.toLowerCase().replace(/[’‘`]/g, "'");

/** Searchable text per restaurant: name, cuisine, tags and every dish on its menu. */
const haystacks = new Map(
  restaurants.map((r) => [r.slug, norm([r.name, r.tagline, r.cuisine, r.type, r.area, ...r.categories, ...r.tags, ...getMenu(r).map((m) => m.name)].join(" "))]),
);

/** Names of the dishes on a restaurant’s menu that match the query (for "Serves …" hints). */
export function matchingDishes(slug: string, query: string) {
  const q = norm(query.trim());
  const r = restaurants.find((x) => x.slug === slug);
  if (!q || !r) return [];
  return getMenu(r)
    .filter((m) => norm(m.name).includes(q))
    .map((m) => m.name);
}

export function filterRestaurants({
  query,
  category,
  filters = NO_RESTAURANT_FILTERS,
  sort,
  minutes,
}: {
  query: string;
  category: FoodCategory | "All";
  filters?: RestaurantFilters;
  sort: RestaurantSort;
  minutes: number | null;
}) {
  const q = norm(query.trim());
  const list = restaurants.filter((r) => {
    if (category !== "All" && !r.categories.includes(category)) return false;
    if (filters.area !== "all" && r.area !== filters.area) return false;
    if (filters.prices.length && !filters.prices.includes(r.price)) return false;
    if (filters.deliveryOnly && r.service === "Dine-in only") return false;
    if (filters.openOnly && minutes !== null && !isOpenAt(r.open, r.close, minutes)) return false;
    if (q && !haystacks.get(r.slug)!.includes(q)) return false;
    return true;
  });
  const sorted = [...list];
  if (sort === "nearest") sorted.sort((a, b) => a.distanceKm - b.distanceKm);
  if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  // Annie’s Kitchen, Chicken Republic and Kilimanjaro lead the recommended order, then featured kitchens by rating.
  const rank = (r: (typeof restaurants)[number]) => {
    const i = TOP_RESTAURANTS.indexOf(r.slug);
    return i >= 0 ? 100 - i : r.featured ? 1 : 0;
  };
  if (sort === "recommended") sorted.sort((a, b) => rank(b) - rank(a) || b.rating - a.rating);
  return sorted;
}
