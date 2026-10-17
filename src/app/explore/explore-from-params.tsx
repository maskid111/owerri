"use client";

import { useSearchParams } from "next/navigation";
import { ExploreFeed, exploreFilters } from "@/components/explore-feed";

export function ExploreFromParams() {
  const params = useSearchParams();
  const filter = exploreFilters.find((f) => f === params.get("cat")) ?? "All";
  const sort = params.get("sort") === "nearby" ? "nearest" : "recommended";
  const item = params.get("item") ?? undefined;
  return <ExploreFeed key={`${filter}|${sort}|${item}`} initialFilter={filter} initialSort={sort} initialItem={item} />;
}
