import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreFeed } from "@/components/explore-feed";
import { ScopedFeed } from "@/components/scoped-feed";
import { Design } from "@/components/design";
import { SigFeedPage } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Explore",
  description: "Restaurants, market stalls, hotels, nature, hangout spots, events and cultural experiences — all in one place.",
};

function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFeed />}>
      <ScopedFeed />
    </Suspense>
  );
}

export default function Page() {
  return <Design a={<ExplorePage />} b={<SigFeedPage scope="all" eyebrow="Explore" title="Explore Native" description="Kitchens, market stalls, stays, nature, hangouts, events and culture — all in one place." image="green-hills" defaultSort="recommended" />} />;
}
