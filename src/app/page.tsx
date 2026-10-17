import Link from "next/link";
import { BedDouble, CalendarDays, Coffee, Drama, MapPin, Martini, Users, Utensils, type LucideIcon } from "lucide-react";
import { ExploreCard } from "@/components/explore-card";
import { Hero } from "@/components/home/hero";
import { NewsletterForm } from "@/components/newsletter-form";
import { FeaturedCard, ListingCard } from "@/components/restaurant-card";
import { StoryCard } from "@/components/story-card";
import { Photo, SectionHeader } from "@/components/ui";
import { dishes, exploreItems, restaurants, stories } from "@/lib/data";
import { cn } from "@/lib/utils";

const interests: { label: string; icon: LucideIcon; href: string; tone: "mint" | "butter"; desktopOnly?: boolean }[] = [
  { label: "Food", icon: Utensils, href: "/restaurants", tone: "mint" },
  { label: "Nearby", icon: MapPin, href: "/explore?sort=nearby", tone: "butter" },
  { label: "Events", icon: CalendarDays, href: "/explore?cat=Events", tone: "butter" },
  { label: "Stays", icon: BedDouble, href: "/explore?cat=Stays", tone: "mint" },
  { label: "Culture", icon: Drama, href: "/culture", tone: "butter" },
  { label: "Cafés", icon: Coffee, href: "/restaurants?category=Caf%C3%A9s", tone: "mint", desktopOnly: true },
  { label: "Hangouts", icon: Martini, href: "/explore?cat=Hangouts", tone: "butter", desktopOnly: true },
  { label: "Family", icon: Users, href: "/explore?cat=Family", tone: "mint", desktopOnly: true },
];

/** Horizontal snap-scroller on mobile; grid from `sm`/`lg` up. */
const scroller = "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0";

export default function HomePage() {
  const featured = restaurants.filter((r) => r.featured);
  const upcoming = ["owerri-cultural-festival", "owerri-local-food-fair", "highlife-in-the-garden"].map((s) => exploreItems.find((x) => x.slug === s)!);
  const thingsToDo = ["heartland-garden-resort", "oguta-lake-boat-rides", "skyline-rooftop"].map((s) => exploreItems.find((x) => x.slug === s)!);
  const nearby = [...restaurants].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 4);

  return (
    <>
      <Hero />

      <div className="relative -mt-6 rounded-t-[1.75rem] bg-cream lg:-mt-10 lg:rounded-t-[2.5rem]">
        {/* Explore by interest */}
        <section className="container-x pt-6 lg:pt-12">
          <SectionHeader title="Explore by interest" href="/explore" />
          <ul className="mt-4 grid grid-cols-5 gap-2.5 sm:gap-4 lg:grid-cols-8">
            {interests.map(({ label, icon: Icon, href, tone, desktopOnly }) => (
              <li key={label} className={cn(desktopOnly && "hidden lg:block")}>
                <Link
                  href={href}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl text-forest transition-transform hover:-translate-y-0.5 sm:aspect-[5/4] lg:aspect-square",
                    tone === "mint" ? "bg-mint" : "bg-butter",
                  )}
                >
                  <Icon className="size-6 sm:size-7" strokeWidth={1.8} aria-hidden />
                  <span className="text-[0.72rem] font-semibold sm:text-sm">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Popular this week */}
        <section className="container-x pt-9 lg:pt-16">
          <SectionHeader title="Popular this week" href="/restaurants" />
          <div className={cn(scroller, "mt-4 sm:grid-cols-2 lg:grid-cols-3")}>
            {featured.map((r, i) => (
              <FeaturedCard
                key={r.slug}
                restaurant={r}
                badge={i === 0 ? "Top Pick" : null}
                priority={i === 0}
                className={cn("w-[86%] shrink-0 snap-start sm:w-auto", i >= 3 && "lg:hidden", i >= 4 && "sm:hidden")}
              />
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="container-x pt-9 lg:pt-16">
          <SectionHeader title="Happening in Owerri" subtitle="Festivals, food fairs and nights out" href="/explore?cat=Events" />
          <div className={cn(scroller, "mt-4 sm:grid-cols-2 lg:grid-cols-3")}>
            {upcoming.map((e, i) => (
              <ExploreCard key={e.slug} item={e} className={cn("w-[86%] shrink-0 snap-start sm:w-auto", i === 2 && "sm:hidden lg:flex")} />
            ))}
          </div>
        </section>

        {/* Order from local kitchens */}
        <section className="container-x pt-9 lg:pt-16">
          <SectionHeader title="Order near you" subtitle="Local kitchens with pickup and delivery" href="/restaurants" />
          <div className="mt-1 grid divide-y divide-line lg:grid-cols-2 lg:gap-x-10 lg:divide-y-0">
            {nearby.map((r) => (
              <ListingCard key={r.slug} restaurant={r} className="lg:border-b lg:border-line" />
            ))}
          </div>
        </section>

        {/* Taste of Owerri */}
        <section className="container-x pt-9 lg:pt-16">
          <SectionHeader title="A taste of Owerri" subtitle="Dishes to know before you arrive" href="/dishes" />
          <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
            {dishes.slice(0, 4).map((d) => (
              <Link key={d.slug} href={`/dishes#${d.slug}`} className="group relative aspect-[4/5] w-[42%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-auto">
                <Photo name={d.image} alt={d.name} sizes="(min-width: 640px) 25vw, 42vw" className="transition-transform duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <span className="block font-display text-lg font-semibold text-cream sm:text-2xl">{d.name}</span>
                  <span className="text-xs text-cream/75 sm:text-sm">{d.igbo ?? d.kind}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Stays & things to do */}
        <section className="container-x pt-9 lg:pt-16">
          <SectionHeader title="Stay, play & unwind" subtitle="Hotels, recreation and hangout spots" href="/explore" />
          <div className={cn(scroller, "mt-4 sm:grid-cols-2 lg:grid-cols-3")}>
            {thingsToDo.map((p, i) => (
              <ExploreCard key={p.slug} item={p} className={cn("w-[86%] shrink-0 snap-start sm:w-auto", i === 2 && "sm:hidden lg:flex")} />
            ))}
          </div>
        </section>

        {/* Stories */}
        <section className="container-x pt-9 lg:pt-16">
          <SectionHeader title="Culture & stories" subtitle="Food, heritage and city life" href="/culture" />
          <div className={cn(scroller, "mt-4 sm:grid-cols-2 lg:grid-cols-3")}>
            {stories.slice(0, 3).map((s, i) => (
              <StoryCard key={s.slug} story={s} className={cn("w-[86%] shrink-0 snap-start sm:w-auto", i === 2 && "sm:hidden lg:block")} />
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="container-x py-10 lg:py-20">
          <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-forest text-cream lg:rounded-[2rem]">
            <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 md:block">
              <Photo name="jollof-fish" alt="Jollof rice with grilled fish" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/40 to-transparent" />
            </div>
            <div className="max-w-xl p-6 sm:p-10 lg:p-14">
              <p className="text-xs font-bold tracking-[0.16em] text-sun uppercase">The Friday Plate</p>
              <h2 className="mt-2 text-3xl leading-tight font-semibold sm:text-4xl">Your weekend in Owerri, sorted.</h2>
              <p className="mt-3 text-cream/75">New openings, the week’s best events and one dish we can’t stop thinking about.</p>
              <div className="mt-6">
                <NewsletterForm dark />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
