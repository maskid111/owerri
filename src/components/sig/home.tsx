import Link from "next/link";
import { BedDouble, Briefcase, CalendarDays, Compass, Drama, Trees, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { exploreItems, marketSections, restaurants, stories } from "@/lib/data";
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
  const kitchens = restaurants.filter((r) => r.featured).slice(0, 4);
  const nearby = exploreItems.filter((x) => x.kind === "place" && (x.distanceKm ?? 99) < 2.5).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)).slice(0, 4);
  const happening = ["owerri-cultural-festival", "highlife-in-the-garden", "masquerade-day", "skyline-rooftop"].map(pick);
  const [lead, ...more] = stories;

  return (
    <>
      <SigHero />

      {/* Category grid (3 × 2 like the reference) — open, no container */}
      <section className="container-x pt-14 lg:pt-24">
        <ul className="mx-auto grid max-w-5xl grid-cols-3 gap-x-2 gap-y-6 lg:grid-cols-6">
          {categories.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Link href={href} className="group flex flex-col items-center gap-3 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-forest text-on-forest ring-4 ring-mint transition-transform duration-300 group-hover:scale-105 sm:size-[4.5rem]">
                  <Icon className="size-6 sm:size-7" strokeWidth={1.6} />
                </span>
                <span className="text-[0.74rem] leading-tight font-bold text-forest sm:text-sm">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SigSection eyebrow="Tours" title="Stay, wander, unwind" href="/tours" className="pt-20 lg:pt-32">
        <div className="grid-cols-1 grid gap-4 md:grid-cols-2 md:grid-rows-[17rem_17rem]">
          <SigTile href="/tours/stays" title="Stays" subtitle="Unique stays & lodges" image="lodge" icon={BedDouble} aspect="aspect-[4/3] md:aspect-auto md:min-h-0 md:flex-1" className="md:row-span-2 md:flex md:h-full md:flex-col" />
          <SigTile href="/tours/stays?cat=Nature" title="Getaways" subtitle="Short trips. Big memories." image="lake-sunset" icon={Briefcase} aspect="aspect-[16/8] md:aspect-auto md:min-h-0 md:flex-1" className="md:flex md:h-full md:flex-col" />
          <SigTile href="/tours/nature" title="Nature & Places" subtitle="Parks, rivers & hidden gems" image="waterfall" icon={Trees} aspect="aspect-[16/8] md:aspect-auto md:min-h-0 md:flex-1" className="md:flex md:h-full md:flex-col" />
        </div>
      </SigSection>

      <SigSection eyebrow="Local Market" title="From the stall to your table" href="/market" className="pt-20 lg:pt-32">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {marketSections.map((m) => (
            <SigTile key={m.name} href={m.href} title={m.name} subtitle={m.blurb} image={m.image} aspect="aspect-square" sizes="(min-width: 1024px) 25vw, 50vw" />
          ))}
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
          {kitchens.map((r) => (
            <SigRestaurantCard key={r.slug} restaurant={r} className="w-[46%] shrink-0 snap-start sm:w-auto" />
          ))}
        </div>
      </SigSection>

      {/* Cultural feature — pattern as a quiet texture, one photograph, one action */}
      <section className="container-x pt-20 lg:pt-32">
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-[2rem] bg-native-pattern-lg text-white lg:grid-cols-2 lg:rounded-[2.75rem]">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <SigEyebrow light>Featured</SigEyebrow>
            <h2 className="mt-3 text-4xl leading-[0.95] text-white sm:text-6xl">
              Cultural
              <br />
              Experiences
            </h2>
            <p className="mt-4 max-w-md text-white/80">Festivals, traditions and the heartbeat of our people — masquerades, Mbari heritage and the makers who keep it alive.</p>
            <Link href="/culture" className={sigBtn("white", "mt-8 self-start")}>
              Discover culture <SigArrow />
            </Link>
          </div>
          <div className="relative min-h-[18rem] lg:min-h-[28rem]">
            <Photo name="masquerade" alt="Igbo masquerades in carved masks and beaded costumes" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>
      </section>

      <SigSection eyebrow="Nearby" title="Within a short trip" href="/nearby" className="pt-20 lg:pt-32">
        <div className="grid-cols-1 grid gap-3 md:grid-cols-2">
          {nearby.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant="row" />
          ))}
        </div>
      </SigSection>

      <SigSection eyebrow="Events & Hangouts" title="Your calendar, sorted" href="/events" className="pt-20 lg:pt-32">
        <div className="grid-cols-1 grid gap-4 md:grid-cols-2">
          {happening.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant="ticket" />
          ))}
        </div>
      </SigSection>

      <SigSection eyebrow="The blog" title="Stories beyond the plate" href="/blog" className="pt-20 pb-10 lg:pt-32">
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
