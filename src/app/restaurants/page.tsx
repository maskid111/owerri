import type { Metadata } from "next";
import { Suspense } from "react";
import { RestaurantExplorer } from "@/components/restaurant-explorer";
import { ExplorerFromParams } from "./explorer-from-params";
import { Design } from "@/components/design";
import { SigRestaurantsPage } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Food & Restaurants",
  description: "Restaurants, bukas, cafés and bars across Owerri, Imo State — filter by category, neighbourhood, price and opening hours, then order for pickup or delivery.",
};

function RestaurantsPage() {
  return (
    // Static shell renders the full list; URL filters (e.g. ?category=) hydrate in on the client.
    <Suspense fallback={<RestaurantExplorer />}>
      <ExplorerFromParams />
    </Suspense>
  );
}

export default function Page() {
  return <Design a={<RestaurantsPage />} b={<SigRestaurantsPage />} />;
}
