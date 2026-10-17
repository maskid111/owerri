import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreFeed } from "@/components/explore-feed";
import { PhotoHero } from "@/components/native";
import { ScopedFeed } from "@/components/scoped-feed";
import { Design } from "@/components/design";
import { SigFeedPage } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Stays & Getaways",
  description: "Hotels, lodges and weekend getaways in and around Owerri, Imo State.",
};

function OriginalPage() {
  return (
    <>
      <PhotoHero eyebrow="Tours · Stays & Getaways" title="Stay somewhere worth remembering." description="Hotels, lodges and weekend getaways in and around Owerri, Imo State." image="lodge" imageAlt="A thatched lodge among green hills" />
      <Suspense fallback={<ExploreFeed scope="stays" showHeading={false} initialSort="recommended" />}>
        <ScopedFeed scope="stays" showHeading={false} defaultSort="recommended" />
      </Suspense>
    </>
  );
}

export default function Page() {
  return <Design a={<OriginalPage />} b={<SigFeedPage scope="stays" eyebrow="Tours · Stays & Getaways" title="Stay somewhere worth remembering" description="Hotels, lodges and weekend getaways in and around Owerri, Imo State." image="lodge" defaultSort="recommended" />} />;
}
