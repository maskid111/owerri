import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreFeed } from "@/components/explore-feed";
import { PhotoHero } from "@/components/native";
import { ScopedFeed } from "@/components/scoped-feed";
import { Design } from "@/components/design";
import { SigFeedPage } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Nature & Places",
  description: "Lakes, rivers, trails, waterfalls and viewpoints worth the trip.",
};

function OriginalPage() {
  return (
    <>
      <PhotoHero eyebrow="Tours · Nature & Places" title="Where the city gives way to green." description="Lakes, rivers, trails, waterfalls and viewpoints worth the trip." image="waterfall" imageAlt="A waterfall in a green gorge" />
      <Suspense fallback={<ExploreFeed scope="nature" showHeading={false} initialSort="recommended" />}>
        <ScopedFeed scope="nature" showHeading={false} defaultSort="recommended" />
      </Suspense>
    </>
  );
}

export default function Page() {
  return <Design a={<OriginalPage />} b={<SigFeedPage scope="nature" eyebrow="Tours · Nature & Places" title="Where the city gives way to green" description="Lakes, rivers, trails, waterfalls and viewpoints worth the trip." image="waterfall" defaultSort="recommended" />} />;
}
