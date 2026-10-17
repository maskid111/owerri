import { restaurants, type FoodCategory } from "./data";
import { isOpenAt } from "./utils";

/** Restaurant search / filter / sort logic shared by both design versions. */
export type RestaurantSort = "recommended" | "nearest" | "rating" | "price-asc" | "price-desc";
export type RestaurantFilters = { area: string; prices: number[]; openOnly: boolean; deliveryOnly: boolean };
export const NO_RESTAURANT_FILTERS: RestaurantFilters = { area: "all", prices: [], openOnly: false, deliveryOnly: false };

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
  const q = query.trim().toLowerCase();
  const list = restaurants.filter((r) => {
    if (category !== "All" && !r.categories.includes(category)) return false;
    if (filters.area !== "all" && r.area !== filters.area) return false;
    if (filters.prices.length && !filters.prices.includes(r.price)) return false;
    if (filters.deliveryOnly && r.service === "Dine-in only") return false;
    if (filters.openOnly && minutes !== null && !isOpenAt(r.open, r.close, minutes)) return false;
    if (q) {
      const hay = [r.name, r.tagline, r.cuisine, r.type, r.area, ...r.categories, ...r.tags].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const sorted = [...list];
  if (sort === "nearest") sorted.sort((a, b) => a.distanceKm - b.distanceKm);
  if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (sort === "recommended") sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.rating - a.rating);
  return sorted;
}
