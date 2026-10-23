import type { Metadata } from "next";
import { ExploreCard } from "@/components/explore-card";
import { MarketTile, PatternBanner, PhotoHero } from "@/components/native";
import { ListingCard } from "@/components/restaurant-card";
import { Arrow, ButtonLink, SampleNote, SectionHeader } from "@/components/ui";
import { exploreItems, marketSections, places, restaurants, type MarketGroup } from "@/lib/data";
import { Design } from "@/components/design";
import { SigMarket } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Local Market",
  description: "Traditional food, fresh produce, spices and handmade crafts from local markets and makers.",
};

const groups: { name: MarketGroup; id: string; blurb: string }[] = [
  { name: "Fresh Produce", id: "fresh-produce", blurb: "Yams, greens, tomatoes and peppers — picked this week." },
  { name: "Spices & Ingredients", id: "spices-ingredients", blurb: "The building blocks of Ofe Owerri, pepper soup and ofe akwu." },
  { name: "Crafts & Handmade", id: "crafts-handmade", blurb: "Pottery, weaving and fabric from local makers." },
];

function MarketPage() {
  const kitchens = restaurants.filter((r) => r.categories.includes("Local") && r.service !== "Dine-in only").slice(0, 4);

  return (
    <>
      <PhotoHero
        eyebrow="Local Market"
        title="From the farm, the pot and the maker’s hands."
        description="Order traditional food from local kitchens, then find the produce, spices and crafts that taste and feel like home."
        image="market-women"
        imageAlt="Women in colourful prints at an outdoor market"
        pattern
      />

      <section className="container-x pt-8 lg:pt-14">
        <SectionHeader title="Browse the market" subtitle="Four aisles, one neighbourhood" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {marketSections.map((m) => (
            <MarketTile key={m.name} href={m.href} title={m.name} image={m.image} />
          ))}
        </div>
      </section>

      <section id="traditional-food" className="container-x scroll-mt-24 pt-10 lg:pt-16">
        <SectionHeader title="Traditional Food" subtitle="Order from local kitchens for pickup or delivery" href="/restaurants?category=Local" />
        <div className="mt-1 grid divide-y divide-line md:grid-cols-2 md:gap-x-8 md:divide-y-0 md:[&>*]:border-b md:[&>*]:border-line">
          {kitchens.map((r) => (
            <ListingCard key={r.slug} restaurant={r} />
          ))}
        </div>
      </section>

      {groups.map((g, i) => {
        const stalls = places.filter((p) => p.marketGroup === g.name).map((p) => exploreItems.find((x) => x.slug === p.slug)!);
        return (
          <section key={g.id} id={g.id} className="container-x scroll-mt-24 pt-10 lg:pt-16">
            <SectionHeader title={g.name} subtitle={g.blurb} />
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stalls.map((s) => (
                <ExploreCard key={s.slug} item={s} />
              ))}
            </div>
            {i === 0 && (
              <PatternBanner
                className="mt-10 lg:mt-16"
                eyebrow="Cook it at home"
                title="Bring the market to your kitchen."
                photo="spices-2"
                photoAlt="Bowls of ground spices"
                actions={
                  <ButtonLink href="/dishes" variant="cream">
                    Learn the signature dishes <Arrow />
                  </ButtonLink>
                }
              >
                Ehu for Ofe Owerri, uziza for pepper soup, ogiri for ofe nsala — our dish guide explains what each ingredient does and where to find it.
              </PatternBanner>
            )}
          </section>
        );
      })}

      <div className="container-x py-8">
        <SampleNote>Stalls, prices and opening hours are sample content for this preview.</SampleNote>
      </div>
    </>
  );
}

export default function Page() {
  return <Design a={<MarketPage />} b={<SigMarket />} />;
}
