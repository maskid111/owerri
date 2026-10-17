import Link from "next/link";
import { BedDouble, Briefcase, CalendarDays, Compass, Drama, Trees, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { events, exploreItems, marketSections, places, restaurants, stories } from "@/lib/data";
import { Photo } from "../ui";
import { SigExploreItem } from "./explore-item";
import { SigHero } from "./hero";
import { SigArrow, sigBtn, SigEyebrow, SigRestaurantCard, SigSection, SigStoryFeature, SigStoryRow, SigTile } from "./ui";

const categories: { label: string; hint: string; href: string; icon: LucideIcon }[] = [
  { label: "Native Food", hint: "Kitchens & dishes", href: "/market", icon: UtensilsCrossed },
  { label: "Culture & Heritage", hint: "Mbari, masquerades", href: "/culture", icon: Drama },
  { label: "Nature & Places", hint: "Lakes, rivers, trails", href: "/tours/nature", icon: Trees },
  { label: "Stays & Getaways", hint: "Lodges & hotels", href: "/tours/stays", icon: BedDouble },
  { label: "Nearby Experiences", hint: "Close to the centre", href: "/nearby", icon: Compass },
  { label: "Events", hint: "Festivals & nights out", href: "/events", icon: CalendarDays },
];

const pick = (slug: string) => exploreItems.find((x) => x.slug === slug)!;

export function SigHome() {
  const featured = ["douglas-road-night-walk", "waterfall-day-trip", "owerri-cultural-festival"].map(pick);
  const kitchens = restaurants.filter((r) => r.featured).slice(0, 4);
  const nearby = exploreItems.filter((x) => x.kind === "place" && (x.distanceKm ?? 99) < 2.5).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)).slice(0, 6);
  const happening = ["owerri-cultural-festival", "highlife-in-the-garden", "masquerade-day", "skyline-rooftop"].map(pick);
  const [lead, ...more] = stories;

  return (
    <>
      <SigHero
        stats={[
          { value: String(restaurants.length), label: "Kitchens" },
          { value: `${places.length}+`, label: "Places" },
          { value: String(events.length), label: "Events" },
        ]}
      />

      {/* Category sheet (3 × 2 like the reference) */}
      <section className="container-x relative z-10 -mt-16 lg:-mt-20">
        <ul className="grid grid-cols-3 gap-2 rounded-[2rem] bg-paper p-2.5 shadow-lift sm:gap-3 sm:p-3 lg:grid-cols-6">
          {categories.map(({ label, hint, href, icon: Icon }) => (
            <li key={label}>
              <Link href={href} className="group flex h-full flex-col items-center gap-2.5 rounded-[1.4rem] px-1 py-4 text-center transition-colors hover:bg-mint sm:py-6">
                <span className="grid-cols-1 grid size-14 place-items-center rounded-full bg-forest text-on-forest ring-4 ring-mint transition-transform duration-300 group-hover:scale-110 sm:size-16">
                  <Icon className="size-6 sm:size-7" strokeWidth={1.7} />
                </span>
                <span className="text-[0.74rem] leading-tight font-bold text-forest sm:text-sm">{label}</span>
                <span className="hidden text-xs text-stone sm:block">{hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SigSection eyebrow="Handpicked" title="Featured Experiences" href="/explore" className="pt-14 lg:pt-20">
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {featured.map((x) => (
            <SigExploreItem key={x.slug} item={x} className="w-[80%] shrink-0 snap-start sm:w-auto" />
          ))}
        </div>
      </SigSection>

      <SigSection eyebrow="Tours" title="Stay, wander, unwind" href="/tours" className="pt-14 lg:pt-20">
        <div className="grid-cols-1 grid gap-4 md:grid-cols-2 md:grid-rows-[17rem_17rem]">
          <SigTile href="/tours/stays" title="Stays" subtitle="Unique stays & lodges" image="lodge" icon={BedDouble} aspect="aspect-[4/3] md:aspect-auto md:min-h-0 md:flex-1" className="md:row-span-2 md:flex md:h-full md:flex-col" />
          <SigTile href="/tours/stays?cat=Nature" title="Getaways" subtitle="Short trips. Big memories." image="lake-sunset" icon={Briefcase} aspect="aspect-[16/8] md:aspect-auto md:min-h-0 md:flex-1" className="md:flex md:h-full md:flex-col" />
          <SigTile href="/tours/nature" title="Nature & Places" subtitle="Parks, rivers & hidden gems" image="waterfall" icon={Trees} aspect="aspect-[16/8] md:aspect-auto md:min-h-0 md:flex-1" className="md:flex md:h-full md:flex-col" />
        </div>
      </SigSection>

      <SigSection eyebrow="Local Market" title="From the stall to your table" href="/market" className="pt-14 lg:pt-20">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {marketSections.map((m) => (
            <SigTile key={m.name} href={m.href} title={m.name} subtitle={m.blurb} image={m.image} aspect="aspect-square" sizes="(min-width: 1024px) 25vw, 50vw" />
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="text-lg font-extrabold text-forest sm:text-xl">Order from local kitchens</p>
          <Link href="/restaurants" className={sigBtn("outline", "h-9 px-4 text-[0.65rem]")}>
            All kitchens <SigArrow />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
          {kitchens.map((r) => (
            <SigRestaurantCard key={r.slug} restaurant={r} className="w-[46%] shrink-0 snap-start sm:w-auto" />
          ))}
        </div>
      </SigSection>

      {/* Cultural feature on the brand pattern */}
      <section className="container-x pt-14 lg:pt-24">
        <div className="relative isolate grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[2rem] bg-native-pattern-lg p-6 text-white sm:p-10 lg:grid-cols-2 lg:rounded-[2.75rem] lg:p-14">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/80 via-forest-deep/45 to-forest-deep/10" aria-hidden />
          <div>
            <SigEyebrow light>Featured</SigEyebrow>
            <h2 className="mt-3 text-4xl leading-[0.95] text-white sm:text-6xl">
              Cultural
              <br />
              Experiences
            </h2>
            <p className="mt-4 max-w-md text-white/85">Festivals, traditions, and the heartbeat of our people — masquerades, Mbari heritage, drumming and the makers who keep it alive.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/culture" className={sigBtn("white")}>
                Discover culture <SigArrow />
              </Link>
              <Link href="/events?cat=Culture" className={sigBtn("ghost")}>
                Festivals
              </Link>
            </div>
          </div>
          <div className="relative mx-auto h-72 w-full max-w-md sm:h-80">
            {(
              [
                ["masquerade", "left-0 top-6 w-[55%] -rotate-6"],
                ["drum-ensemble", "right-0 top-0 w-[50%] rotate-3"],
                ["pottery", "left-[25%] bottom-0 w-[48%] -rotate-1"],
              ] as const
            ).map(([img, pos]) => (
              <div key={img} className={`absolute aspect-[4/5] overflow-hidden rounded-2xl border-4 border-white shadow-lift transition-transform duration-500 hover:z-10 hover:rotate-0 ${pos}`}>
                <Photo name={img} alt="" sizes="240px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SigSection eyebrow="Nearby" title="Within a short trip" href="/nearby" className="pt-14 lg:pt-20">
        <div className="grid-cols-1 grid gap-3 md:grid-cols-2">
          {nearby.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant="row" />
          ))}
        </div>
      </SigSection>

      <SigSection eyebrow="Events & Hangouts" title="Your calendar, sorted" href="/events" className="pt-14 lg:pt-20">
        <div className="grid-cols-1 grid gap-4 md:grid-cols-2">
          {happening.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant="ticket" />
          ))}
        </div>
      </SigSection>

      <SigSection eyebrow="The blog" title="Stories beyond the plate" href="/blog" className="pt-14 pb-6 lg:pt-20">
        <div className="grid-cols-1 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <SigStoryFeature story={lead} />
          <div>
            {more.map((s, i) => (
              <SigStoryRow key={s.slug} story={s} index={i} />
            ))}
          </div>
        </div>
      </SigSection>
    </>
  );
}
