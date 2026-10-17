import { BedDouble, Briefcase, Trees } from "lucide-react";
import { ExploreCard } from "@/components/explore-card";
import { Hero } from "@/components/home/hero";
import { HomeShortcuts } from "@/components/home/shortcuts";
import { MarketTile, PatternBanner, TourTile } from "@/components/native";
import { FeaturedCard } from "@/components/restaurant-card";
import { StoryCard } from "@/components/story-card";
import { Arrow, ButtonLink, Photo, SectionHeader } from "@/components/ui";
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

      {/* Discovery shortcuts, floating over the hero edge */}
      <section className="container-x relative z-10 -mt-12 lg:-mt-16">
        <HomeShortcuts />
      </section>

      {/* Tours */}
      <section className="container-x pt-12 lg:pt-20">
        <SectionHeader title="Tours" subtitle="Stays, getaways and the great outdoors" href="/tours" />
        <div className={cn(scroller, "mt-5 sm:grid-cols-3")}>
          <TourTile href="/tours/stays" title="Stays" subtitle="Unique stays & lodges" image="lodge" icon={BedDouble} className={item} />
          <TourTile href="/tours/stays?cat=Nature" title="Getaways" subtitle="Short trips. Big memories." image="lake-sunset" icon={Briefcase} className={item} />
          <TourTile href="/tours/nature" title="Nature & Places" subtitle="Parks, rivers & hidden gems" image="waterfall" icon={Trees} className={item} />
        </div>
      </section>

      {/* Statement — generous whitespace */}
      <section className="container-x py-16 text-center lg:py-28">
        <p className="text-xs font-bold tracking-[0.2em] text-forest-light uppercase">Native, beyond the plate</p>
        <h2 className="mx-auto mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold text-balance text-forest sm:text-5xl lg:text-7xl">
          Food. Culture. Places. <span className="font-normal text-forest-light italic">Experiences.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-stone">Everything that makes Owerri and Imo State special — from the market stall to the festival ground.</p>
      </section>

      {/* Local Market */}
      <section className="container-x">
        <SectionHeader title="Local Market" subtitle="Traditional food, produce, spices and crafts" href="/market" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {marketSections.map((m) => (
            <MarketTile key={m.name} href={m.href} title={m.name} image={m.image} />
          ))}
        </div>
        <div className="mt-8 flex items-end justify-between gap-4">
          <h3 className="text-xl font-semibold text-forest sm:text-2xl">Order from local kitchens</h3>
          <ButtonLink href="/restaurants" variant="outline" size="sm">
            All kitchens <Arrow />
          </ButtonLink>
        </div>
        <div className={cn(scroller, "mt-4 sm:grid-cols-2 lg:grid-cols-3")}>
          {kitchens.map((r, i) => (
            <FeaturedCard key={r.slug} restaurant={r} badge={i === 0 ? "Top Pick" : null} className={cn(item, i === 2 && "sm:hidden lg:block")} />
          ))}
        </div>
      </section>

      {/* Cultural feature — the brand pattern */}
      <section className="container-x pt-14 lg:pt-24">
        <PatternBanner
          size="lg"
          eyebrow="Featured"
          title="Cultural Experiences"
          photo="masquerade"
          photoAlt="Igbo masquerades in carved masks and beaded costumes"
          actions={
            <>
              <ButtonLink href="/culture" variant="cream" size="lg">
                Explore culture <Arrow />
              </ButtonLink>
              <ButtonLink href="/events?cat=Culture" variant="light" size="lg">
                Upcoming festivals
              </ButtonLink>
            </>
          }
        >
          Festivals, masquerades, Mbari heritage and the heartbeat of our people — experienced up close, with local guides and storytellers.
        </PatternBanner>
      </section>

      {/* Nearby */}
      <section className="container-x pt-14 lg:pt-24">
        <SectionHeader title="Nearby" subtitle="Destinations and experiences close to the city centre" href="/nearby" />
        <div className={cn(scroller, "mt-5 sm:grid-cols-2 lg:grid-cols-3")}>
          {nearby.map((x, i) => (
            <ExploreCard key={x.slug} item={x} className={cn(item, i === 2 && "sm:hidden lg:flex")} />
          ))}
        </div>
      </section>

      {/* Events & Hangouts */}
      <section className="container-x pt-14 lg:pt-24">
        <SectionHeader title="Events & Hangouts" subtitle="Festivals, live music and nights out" href="/events" />
        <div className={cn(scroller, "mt-5 sm:grid-cols-2 lg:grid-cols-3")}>
          {events.map((x, i) => (
            <ExploreCard key={x.slug} item={x} className={cn(item, i === 2 && "sm:hidden lg:flex")} />
          ))}
        </div>
      </section>

      {/* Split promo: photography + pattern */}
      <section className="container-x pt-14 lg:pt-24">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="relative isolate flex min-h-[20rem] items-end overflow-hidden rounded-[1.5rem] lg:min-h-[28rem] lg:rounded-[2rem]">
            <Photo name="farm-woman" alt="A farmer in a patterned headwrap in a green field" sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 to-transparent" />
            <div className="p-6 text-cream sm:p-8">
              <p className="text-xs font-bold tracking-[0.18em] text-leaf uppercase">From the farm</p>
              <p className="mt-2 font-display text-3xl font-semibold">New-season yams are here.</p>
              <ButtonLink href="/market#fresh-produce" variant="cream" className="mt-5">
                Shop fresh produce <Arrow />
              </ButtonLink>
            </div>
          </div>
          <div className="relative isolate flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-native-pattern-lg p-6 text-cream sm:p-8 lg:min-h-[28rem] lg:rounded-[2rem]">
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/45 to-transparent" aria-hidden />
            <p className="text-xs font-bold tracking-[0.18em] text-leaf uppercase">Made by hand</p>
            <p className="mt-2 max-w-sm font-display text-3xl font-semibold">Pottery, weaving and ankara from local makers.</p>
            <ButtonLink href="/market#crafts-handmade" variant="cream" className="mt-5 self-start">
              Browse crafts <Arrow />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="container-x py-14 lg:py-24">
        <SectionHeader title="From the blog" subtitle="Food, heritage and city life" href="/blog" />
        <div className={cn(scroller, "mt-5 sm:grid-cols-2 lg:grid-cols-3")}>
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
