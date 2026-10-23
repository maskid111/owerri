import Link from "next/link";
import { exploreItems, marketSections, popularDishes, topRestaurants } from "@/lib/data";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { PopularDishes } from "../food";
import { ServiceArt } from "../service-art";
import { Photo } from "../ui";
import { SigExploreItem } from "./explore-item";
import { SigHero } from "./hero";
import { SigArrow, sigBtn, SigEyebrow, SigRestaurantCard, SigSection, SigTile } from "./ui";

const pick = (slug: string) => exploreItems.find((x) => x.slug === slug)!;

/** Round illustrated service bubbles with a label pill — Version B's take on the service tiles. */
function SigServices() {
  return (
    <ul className="grid grid-cols-4 gap-x-2 gap-y-5 lg:grid-cols-8">
      {services.map((s) => (
        <li key={s.href}>
          <Link href={s.href} className="group flex flex-col items-center text-center">
            <span
              className={cn(
                "grid size-[4.5rem] place-items-center rounded-full shadow-card ring-4 ring-paper transition-transform duration-300 group-hover:-translate-y-1 sm:size-20",
                s.tone,
              )}
            >
              <ServiceArt kind={s.art} className="size-11 sm:size-12" />
            </span>
            <span className="relative -mt-3 max-w-full rounded-full bg-paper px-2.5 py-1 text-[0.68rem] leading-tight font-semibold text-balance text-forest shadow-card ring-1 ring-line/60 sm:text-xs">
              {s.short}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Version B homepage: hero + search, service bubbles, then food first and the rest of Native after. */
export function SigHome() {
  const nearby = exploreItems
    .filter((x) => x.kind === "place" && (x.distanceKm ?? 99) < 2.5)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, 4);
  const happening = ["owerri-cultural-festival", "highlife-in-the-garden", "masquerade-day", "skyline-rooftop"].map(pick);

  return (
    <>
      <SigHero />

      <section aria-label="Services" className="container-x pt-8">
        <SigServices />
      </section>

      <SigSection eyebrow="Order food" title="Featured restaurants" href="/restaurants" className="pt-14 lg:pt-20">
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
          {topRestaurants()
            .slice(0, 4)
            .map((r) => (
              <SigRestaurantCard key={r.slug} restaurant={r} className="w-[46%] shrink-0 snap-start sm:w-auto" />
            ))}
        </div>
      </SigSection>

      <SigSection eyebrow="Order food" title="Popular dishes" href="/restaurants" linkLabel="All restaurants" className="pt-14 lg:pt-20">
        <PopularDishes dishes={popularDishes(8)} variant="b" />
      </SigSection>

      <SigSection eyebrow="Local Market" title="Markets & shops" href="/market" className="pt-14 lg:pt-20">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {marketSections.map((m) => (
            <SigTile key={m.name} href={m.href} title={m.name} subtitle={m.blurb} image={m.image} aspect="aspect-square" sizes="(min-width: 1024px) 25vw, 50vw" />
          ))}
        </div>
      </SigSection>

      <SigSection eyebrow="Culture & Events" title="What’s on" href="/events" className="pt-14 lg:pt-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {happening.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant="ticket" />
          ))}
        </div>
      </SigSection>

      <SigSection eyebrow="Nearby" title="Experiences close by" href="/nearby" className="pt-14 lg:pt-20">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {nearby.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant="row" />
          ))}
        </div>
      </SigSection>

      {/* Explore Native — culture supports the platform rather than leading it */}
      <section className="container-x py-14 lg:py-20">
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-[2rem] bg-native-pattern-lg text-white lg:grid-cols-2 lg:rounded-[2.75rem]">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
            <SigEyebrow light>Explore Native</SigEyebrow>
            <h2 className="mt-3 text-4xl leading-[0.95] text-white sm:text-5xl">More than food. A culture.</h2>
            <p className="mt-4 max-w-md text-white/80">Festivals, masquerades, Mbari heritage and the makers who keep local traditions alive.</p>
            <Link href="/culture" className={sigBtn("white", "mt-8 self-start")}>
              Discover culture <SigArrow />
            </Link>
          </div>
          <div className="relative min-h-[16rem] lg:min-h-[24rem]">
            <Photo name="masquerade" alt="Igbo masquerades in carved masks and beaded costumes" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>
      </section>
    </>
  );
}
