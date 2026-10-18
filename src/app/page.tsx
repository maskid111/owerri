import { BedDouble, Briefcase, Trees } from "lucide-react";
import { ExploreCard } from "@/components/explore-card";
import { Hero } from "@/components/home/hero";
import { HomeShortcuts } from "@/components/home/shortcuts";
import { MarketTile, PatternBanner, TourTile } from "@/components/native";
import { FeaturedCard } from "@/components/restaurant-card";
import { StoryCard } from "@/components/story-card";
import { Arrow, ButtonLink, SectionHeader } from "@/components/ui";
import { exploreItems, marketSections, restaurants, stories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Design } from "@/components/design";
import { SigHome } from "@/components/sig/home";

/** Horizontal snap-scroller on mobile; grid from `sm` up. */
const scroller = "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0";
const item = "w-[84%] shrink-0 snap-start sm:w-auto";

function HomePage() {
  const kitchens = restaurants.filter((r) => r.featured).slice(0, 3);
  const nearby = exploreItems
    .filter((x) => x.kind === "place" && (x.distanceKm ?? 99) < 3)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, 3);
  const events = ["owerri-cultural-festival", "highlife-in-the-garden", "skyline-rooftop"].map((s) => exploreItems.find((x) => x.slug === s)!);

  return (
    <>
      <Hero />

      {/* One quiet line of brand context, then discovery shortcuts */}
      <section className="container-x pt-16 text-center lg:pt-28">
        <p className="mx-auto max-w-2xl font-display text-3xl leading-tight font-medium text-balance text-forest sm:text-5xl">
          Food, culture and places from the heart of Igboland.
        </p>
        <span className="mx-auto mt-6 block h-[3px] w-10 rounded-full bg-spark" aria-hidden />
        <div className="mx-auto mt-10 max-w-4xl lg:mt-14">
          <HomeShortcuts />
        </div>
      </section>

      {/* Tours */}
      <section className="container-x pt-20 lg:pt-32">
        <SectionHeader title="Tours" href="/tours" />
        <div className={cn(scroller, "mt-6 sm:grid-cols-3")}>
          <TourTile href="/tours/stays" title="Stays" subtitle="Unique stays & lodges" image="lodge" icon={BedDouble} className={item} />
          <TourTile href="/tours/stays?cat=Nature" title="Getaways" subtitle="Short trips. Big memories." image="lake-sunset" icon={Briefcase} className={item} />
          <TourTile href="/tours/nature" title="Nature & Places" subtitle="Parks, rivers & hidden gems" image="waterfall" icon={Trees} className={item} />
        </div>
      </section>

      {/* Local Market */}
      <section className="container-x pt-20 lg:pt-32">
        <SectionHeader title="Local Market" href="/market" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {marketSections.map((m) => (
            <MarketTile key={m.name} href={m.href} title={m.name} image={m.image} />
          ))}
        </div>
        <div className={cn(scroller, "mt-10 sm:grid-cols-2 lg:grid-cols-3")}>
          {kitchens.map((r, i) => (
            <FeaturedCard key={r.slug} restaurant={r} badge={null} className={cn(item, i === 2 && "sm:hidden lg:block")} />
          ))}
        </div>
      </section>

      {/* Cultural feature — the brand pattern as a quiet texture */}
      <section className="container-x pt-20 lg:pt-32">
        <PatternBanner
          size="lg"
          eyebrow="Featured"
          title="Cultural Experiences"
          photo="masquerade"
          photoAlt="Igbo masquerades in carved masks and beaded costumes"
          actions={
            <ButtonLink href="/culture" variant="cream" size="lg">
              Explore culture <Arrow />
            </ButtonLink>
          }
        >
          Festivals, masquerades and Mbari heritage — experienced up close, with local guides and storytellers.
        </PatternBanner>
      </section>

      {/* Nearby */}
      <section className="container-x pt-20 lg:pt-32">
        <SectionHeader title="Nearby" href="/nearby" />
        <div className={cn(scroller, "mt-6 sm:grid-cols-2 lg:grid-cols-3")}>
          {nearby.map((x, i) => (
            <ExploreCard key={x.slug} item={x} className={cn(item, i === 2 && "sm:hidden lg:flex")} />
          ))}
        </div>
      </section>

      {/* Events & Hangouts */}
      <section className="container-x pt-20 lg:pt-32">
        <SectionHeader title="Events & Hangouts" href="/events" />
        <div className={cn(scroller, "mt-6 sm:grid-cols-2 lg:grid-cols-3")}>
          {events.map((x, i) => (
            <ExploreCard key={x.slug} item={x} className={cn(item, i === 2 && "sm:hidden lg:flex")} />
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="container-x py-20 lg:py-32">
        <SectionHeader title="From the blog" href="/blog" />
        <div className={cn(scroller, "mt-6 sm:grid-cols-2 lg:grid-cols-3")}>
          {stories.slice(0, 3).map((s, i) => (
            <StoryCard key={s.slug} story={s} className={cn(item, i === 2 && "sm:hidden lg:block")} />
          ))}
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return <Design a={<HomePage />} b={<SigHome />} />;
}
