"use client";

import { useSearchParams } from "next/navigation";
import { ExploreFeed } from "./explore-feed";
import { exploreFilters, type FeedScope } from "@/lib/feed";

/** Explore feed driven by URL params (?cat=, ?sort=nearby, ?item=<slug>), scoped to one section of the site. */
export function ScopedFeed({
  scope = "all",
  heading,
  description,
  showHeading = true,
  defaultSort = "recommended",
}: {
  scope?: FeedScope;
  heading?: string;
  description?: string;
  showHeading?: boolean;
  defaultSort?: "recommended" | "nearest";
}) {
  const params = useSearchParams();
  const filter = exploreFilters.find((f) => f === params.get("cat")) ?? "All";
  const sort = params.get("sort") === "nearby" ? "nearest" : defaultSort;
  const item = params.get("item") ?? undefined;
  return (
    <ExploreFeed
      key={`${filter}|${sort}|${item}`}
      scope={scope}
      heading={heading}
      description={description}
      showHeading={showHeading}
      initialFilter={filter}
      initialSort={sort}
      initialItem={item}
    />
  );
}
