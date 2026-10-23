import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreFeed } from "@/components/explore-feed";
import { PhotoHero } from "@/components/native";
import { ScopedFeed } from "@/components/scoped-feed";
import { Design } from "@/components/design";
import { SigFeedPage } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Events & Hangouts",
  description: "Festivals, live music, food walks, rooftops and places to spend the evening.",
};

function OriginalPage() {
  return (
    <>
      <PhotoHero eyebrow="Events & Hangouts" title="Where everyone gathers." description="Festivals, live music, food walks, rooftops and places to spend the evening." image="festival" imageAlt="A cultural festival procession in red and coral" />
      <Suspense fallback={<ExploreFeed scope="events" showHeading={false} initialSort="recommended" />}>
        <ScopedFeed scope="events" showHeading={false} defaultSort="recommended" />
      </Suspense>
    </>
  );
}

export default function Page() {
  return <Design a={<OriginalPage />} b={<SigFeedPage scope="events" eyebrow="Events & Hangouts" title="Where everyone gathers" description="Festivals, live music, food walks, rooftops and places to spend the evening." image="festival" defaultSort="recommended" />} />;
}
