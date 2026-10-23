import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreFeed } from "@/components/explore-feed";
import { PhotoHero } from "@/components/native";
import { ScopedFeed } from "@/components/scoped-feed";
import { Design } from "@/components/design";
import { SigFeedPage } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Nearby",
  description: "Restaurants, market stalls, stays and places within a short trip.",
};

function OriginalPage() {
  return (
    <>
      <PhotoHero eyebrow="Nearby" title="Close to home, worth the trip." description="Restaurants, market stalls, stays and places within a short trip." image="palm-road" imageAlt="A red-earth road through palm groves" />
      <Suspense fallback={<ExploreFeed scope="nearby" showHeading={false} initialSort="nearest" />}>
        <ScopedFeed scope="nearby" showHeading={false} defaultSort="nearest" />
      </Suspense>
    </>
  );
}

export default function Page() {
  return <Design a={<OriginalPage />} b={<SigFeedPage scope="nearby" eyebrow="Nearby" title="Close to home, worth the trip" description="Restaurants, market stalls, stays and places within a short trip." image="palm-road" defaultSort="nearest" />} />;
}
