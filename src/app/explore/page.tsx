import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreFeed } from "@/components/explore-feed";
import { ScopedFeed } from "@/components/scoped-feed";
import { Design } from "@/components/design";
import { SigFeedPage } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Explore",
  description: "Restaurants, market stalls, hotels, nature, hangout spots, events and cultural experiences around Owerri, Imo State.",
};

function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFeed />}>
      <ScopedFeed />
    </Suspense>
  );
}

export default function Page() {
  return <Design a={<ExplorePage />} b={<SigFeedPage scope="all" eyebrow="Explore" title="Explore Owerri" description="Kitchens, market stalls, stays, nature, hangouts, events and culture around Owerri, Imo State." image="green-hills" defaultSort="recommended" />} />;
}
