"use client";

import { useSearchParams } from "next/navigation";
import { RestaurantExplorer } from "@/components/restaurant-explorer";
import { foodCategories } from "@/lib/data";

export function ExplorerFromParams() {
  const params = useSearchParams();
  const raw = params.get("category");
  const category = foodCategories.find((c) => c === raw);
  const q = params.get("q") ?? "";
  return <RestaurantExplorer key={`${category ?? "all"}|${q}`} initialCategory={category} initialQuery={q} />;
}
