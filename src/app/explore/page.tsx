import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreFeed } from "@/components/explore-feed";
import { ExploreFromParams } from "./explore-from-params";

export const metadata: Metadata = {
  title: "Explore",
  description: "Events, restaurants, cafés, hotels, recreation, hangout spots and cultural experiences around Owerri, Imo State.",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFeed />}>
      <ExploreFromParams />
    </Suspense>
  );
}
