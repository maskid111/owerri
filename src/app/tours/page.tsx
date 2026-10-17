import type { Metadata } from "next";
import { BedDouble, Trees } from "lucide-react";
import { ExploreCard } from "@/components/explore-card";
import { PatternBanner, PhotoHero, TourTile } from "@/components/native";
import { Arrow, ButtonLink, SectionHeader } from "@/components/ui";
import { exploreItems } from "@/lib/data";
import { Design } from "@/components/design";
import { SigTours } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Tours",
  description: "Stays, getaways and nature around Owerri and Imo State — lodges, lakes, rivers, trails and waterfalls.",
};

function ToursPage() {
  const stays = exploreItems.filter((x) => x.label === "Getaway" || x.label === "Stay").slice(0, 3);
  const nature = exploreItems.filter((x) => x.label === "Nature").slice(0, 3);

  return (
    <>
      <PhotoHero
        eyebrow="Tours"
        title="Slow down. Look around."
        description="Lodges in the palms, lakes at sunset and forest rivers — all within easy reach of Owerri."
        image="green-hills"
        imageAlt="Green hills and trees under a blue sky"
      />

      <section className="container-x pt-8 lg:pt-14">
        <div className="grid gap-4 md:grid-cols-2">
          <TourTile href="/tours/stays" title="Stays & Getaways" subtitle="Unique stays, lodges and short trips" image="lodge" icon={BedDouble} />
          <TourTile href="/tours/nature" title="Nature & Places" subtitle="Lakes, rivers, trails and hidden gems" image="waterfall" icon={Trees} />
        </div>
      </section>

      <section className="container-x pt-10 lg:pt-16">
        <SectionHeader title="Stays & Getaways" subtitle="Short trips. Big memories." href="/tours/stays" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stays.map((x) => (
            <ExploreCard key={x.slug} item={x} />
          ))}
        </div>
      </section>

      <section className="container-x pt-10 lg:pt-16">
        <SectionHeader title="Nature & Places" subtitle="Parks, water and wide-open views" href="/tours/nature" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {nature.map((x) => (
            <ExploreCard key={x.slug} item={x} />
          ))}
        </div>
      </section>

      <section className="container-x py-10 lg:py-16">
        <PatternBanner
          eyebrow="Weekend plan"
          title="Three days, six stops, one very full plate."
          photo="lake-sunset"
          photoAlt="Sunset over a lake"
          actions={
            <ButtonLink href="/culture#weekend" variant="cream">
              See the itinerary <Arrow />
            </ButtonLink>
          }
        >
          Pair a lakeside afternoon with the city’s best kitchens and a night of live highlife.
        </PatternBanner>
      </section>
    </>
  );
}

export default function Page() {
  return <Design a={<ToursPage />} b={<SigTours />} />;
}
