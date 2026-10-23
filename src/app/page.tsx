import { ExperiencePhotoCard } from "@/components/explore-card";
import { PopularDishes } from "@/components/food";
import { Hero } from "@/components/home/hero";
import { ServiceTiles } from "@/components/home/services";
import { MarketTile, PatternBanner } from "@/components/native";
import { RestaurantPhotoCard } from "@/components/restaurant-card";
import { Arrow, ButtonLink, SectionHeader } from "@/components/ui";
import { exploreItems, marketSections, popularDishes, topRestaurants } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Design } from "@/components/design";
import { SigHome } from "@/components/sig/home";

/** Horizontal snap-scroller on mobile; grid from `sm` up. */
const scroller = "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0";
const item = "w-[84%] shrink-0 snap-start sm:w-auto";

function HomePage() {
  const featured = topRestaurants().slice(0, 6);
  const events = ["owerri-cultural-festival", "highlife-in-the-garden", "masquerade-day"].map((s) => exploreItems.find((x) => x.slug === s)!);
  const nearby = exploreItems
    .filter((x) => x.kind === "place" && (x.distanceKm ?? 99) < 3)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, 3);

  return (
    <>
      <Hero />

      {/* Every service, visible on the first screen */}
      <section aria-label="Services" className="container-x pt-6">
        <ServiceTiles />
      </section>

      {/* Food first */}
      <section className="container-x pt-12 lg:pt-16">
        <SectionHeader title="Featured restaurants" href="/restaurants" />
        <div className={cn(scroller, "mt-6 sm:grid-cols-2 lg:grid-cols-3")}>
          {featured.map((r, i) => (
            <RestaurantPhotoCard key={r.slug} restaurant={r} priority={i < 2} className={item} />
          ))}
        </div>
      </section>

      <section className="container-x pt-12 lg:pt-16">
        <SectionHeader title="Popular dishes" subtitle="Add to your cart straight from here." href="/restaurants" linkLabel="All restaurants" />
        <div className="mt-6">
          <PopularDishes dishes={popularDishes(8)} variant="a" />
        </div>
      </section>

      {/* Then the rest of Native */}
      <section className="container-x pt-12 lg:pt-16">
        <SectionHeader title="Local markets & shops" href="/market" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {marketSections.map((m) => (
            <MarketTile key={m.name} href={m.href} title={m.name} image={m.image} />
          ))}
        </div>
      </section>

      <section className="container-x pt-12 lg:pt-16">
        <SectionHeader title="Culture & events" href="/events" />
        <div className={cn(scroller, "mt-6 sm:grid-cols-2 lg:grid-cols-3")}>
          {events.map((x, i) => (
            <ExperiencePhotoCard key={x.slug} item={x} className={cn(item, i === 2 && "sm:hidden lg:flex")} />
          ))}
        </div>
      </section>

      <section className="container-x pt-12 lg:pt-16">
        <SectionHeader title="Nearby experiences" href="/nearby" />
        <div className={cn(scroller, "mt-6 sm:grid-cols-2 lg:grid-cols-3")}>
          {nearby.map((x, i) => (
            <ExperiencePhotoCard key={x.slug} item={x} className={cn(item, i === 2 && "sm:hidden lg:flex")} />
          ))}
        </div>
      </section>

      <section className="container-x py-12 lg:py-16">
        <PatternBanner
          eyebrow="Explore Native"
          title="More than food. It’s a culture."
          photo="masquerade"
          photoAlt="Igbo masquerades in carved masks and beaded costumes"
          actions={
            <ButtonLink href="/culture" variant="cream">
              Explore culture <Arrow />
            </ButtonLink>
          }
        >
          Festivals, masquerades, Mbari heritage and the makers who keep local traditions alive.
        </PatternBanner>
      </section>
    </>
  );
}

export default function Page() {
  return <Design a={<HomePage />} b={<SigHome />} />;
}
