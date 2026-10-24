import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import type { ReactNode } from "react";
import { getExploreItem, locationLabel, type Restaurant } from "@/lib/data";
import { homeShortcuts } from "@/lib/services";
import { cn } from "@/lib/utils";
import { SaveButton } from "../save-button";
import { ServiceArt } from "../service-art";
import { Photo } from "../ui";

/** Compact section heading with an optional one-line subtitle and a small "See all" link, as in the reference. */
export function HomeHeading({
  title,
  subtitle,
  href,
  linkLabel = "See all",
  variant = "a",
}: {
  title: ReactNode;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  variant?: "a" | "b";
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className={cn("text-forest", variant === "a" ? "font-display text-[1.15rem] leading-tight font-semibold sm:text-2xl" : "text-[1.2rem] leading-tight sm:text-2xl")}>{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-stone sm:text-sm">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-forest-light hover:text-forest sm:text-sm dark:text-spark">
          {linkLabel} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/** Soft tile colours behind the illustrations (Option 1); Option 2 (dark) uses the raised dark surface. */
const tileTones: Record<string, string> = {
  "/restaurants": "bg-[#fbe4d8]",
  "/dishes": "bg-[#fdecd2]",
  "/tours/nature": "bg-[#dff0ec]",
  "/events": "bg-[#e3edf4]",
  "/market": "bg-[#e2f0e2]",
  "/culture": "bg-[#f3e6dc]",
};

/**
 * Six service shortcuts in one compact row: a small soft-coloured tile with the Native illustration and the
 * label beneath. Version A uses rounded rectangles; Version B round bubbles. Sizes stay compact.
 */
export function HomeShortcuts({ variant }: { variant: "a" | "b" }) {
  return (
    <ul className="grid grid-cols-6 gap-x-1.5 sm:gap-x-4">
      {homeShortcuts.map((s) => (
        <li key={s.href} className="min-w-0">
          <Link href={s.href} className="group flex flex-col items-center gap-1.5 text-center">
            <span
              className={cn(
                "grid w-full place-items-center transition-transform duration-300 group-hover:-translate-y-0.5 dark:bg-paper dark:ring-1 dark:ring-line",
                variant === "a" ? "h-11 rounded-xl sm:h-14 sm:rounded-2xl" : "mx-auto aspect-square max-w-[3.75rem] rounded-full sm:max-w-[4.5rem]",
                tileTones[s.href],
              )}
            >
              <ServiceArt kind={s.art} className={variant === "a" ? "size-9 sm:size-11" : "size-[72%]"} />
            </span>
            <span className="text-[0.62rem] leading-tight font-semibold tracking-[-0.015em] whitespace-nowrap text-ink min-[400px]:text-[0.68rem] sm:text-sm">{s.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Horizontal scroller on phones, a grid from `md`. */
export const homeScroller = "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:gap-4 md:overflow-visible md:px-0";

/** Shared bordered card surface used by the homepage rows. */
export const homeCard = (variant: "a" | "b") =>
  cn("overflow-hidden border border-line bg-paper", variant === "a" ? "rounded-xl" : "rounded-[1.25rem]");

/**
 * Featured restaurant spotlight (reference: “Featured restaurant”): text panel on the left — label, name,
 * place, a short description and View Restaurant — with the photograph filling the right and fading in.
 */
export function FeaturedSpotlight({ restaurant: r, variant }: { restaurant: Restaurant; variant: "a" | "b" }) {
  return (
    <article className={cn(homeCard(variant), "group relative isolate flex min-h-[13.5rem] w-[88%] shrink-0 snap-start sm:min-h-[15rem] md:w-auto")}>
      <span className="absolute inset-y-0 right-0 -z-20 w-[58%]">
        <Photo name={r.cover} alt={`${r.name} — ${r.type}`} sizes="(min-width: 768px) 40vw, 52vw" priority className="transition-transform duration-500 group-hover:scale-[1.03]" />
      </span>
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-paper from-40% via-paper/80 via-55% to-transparent" aria-hidden />
      <SaveButton slug={r.slug} name={r.name} variant="photo" className="absolute top-2 right-2 z-10" />
      <div className="flex max-w-[64%] flex-col justify-center p-4 sm:max-w-[56%] sm:p-6">
        <p className="text-[0.6rem] font-bold tracking-[0.16em] text-forest-light uppercase sm:text-[0.68rem] dark:text-spark">Featured restaurant</p>
        <h3 className={cn("mt-1 leading-tight text-forest", variant === "a" ? "font-display text-xl font-semibold italic sm:text-3xl" : "text-xl font-bold sm:text-3xl")}>
          <Link href={`/restaurants/${r.slug}`} className="after:absolute after:inset-0">
            {r.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[0.7rem] text-stone sm:text-xs">
          <MapPin className="size-3" aria-hidden /> {locationLabel(r).replace(", Imo State", "")}
          {r.reviewCount > 0 ? (
            <>
              {" "}
              · <Star className="size-3 fill-spark text-spark" aria-hidden /> {r.rating.toFixed(1)}
            </>
          ) : (
            " · New on Native"
          )}
        </p>
        <p className="mt-2 line-clamp-3 text-[0.72rem] leading-relaxed text-ink/80 sm:text-sm">{r.description}</p>
        <span className="mt-3 inline-flex h-8 w-fit items-center gap-1.5 rounded-full bg-spark px-3.5 text-xs font-semibold text-[#1a1405] transition-colors group-hover:bg-[#eec676] sm:h-10 sm:px-5 sm:text-sm">
          View Restaurant <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

/** “Places to explore” card beside the spotlight: full photo, label, name, tags and an orange arrow. */
export function PlacesToExploreCard({ slug, variant }: { slug: string; variant: "a" | "b" }) {
  const item = getExploreItem(slug);
  if (!item) return null;
  return (
    <Link
      href={`/tours/nature?item=${item.slug}`}
      className={cn(homeCard(variant), "group relative isolate flex min-h-[13.5rem] w-[62%] shrink-0 snap-start items-end text-white sm:min-h-[15rem] md:w-auto")}
    >
      <Photo name={item.image} alt={item.title} sizes="(min-width: 768px) 30vw, 62vw" className="-z-20 transition-transform duration-500 group-hover:scale-[1.04]" />
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-transparent" aria-hidden />
      <span className="flex w-full items-end gap-2 p-3.5 sm:p-4">
        <span className="min-w-0 flex-1">
          <span className="block text-[0.6rem] font-bold tracking-[0.16em] text-spark uppercase">Places to explore</span>
          <span className="mt-0.5 block truncate text-base font-semibold sm:text-lg">{item.title}</span>
          <span className="block truncate text-[0.7rem] text-white/75">{item.categories.slice(0, 3).join(" · ")}</span>
        </span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-spark text-[#1a1405]" aria-hidden>
          <ArrowRight className="size-4" />
        </span>
      </span>
    </Link>
  );
}

/** Compact culture banner on the Native pattern: label, editorial line, a short note (wider screens), photo and action. */
export function CultureBanner({ variant }: { variant: "a" | "b" }) {
  return (
    <Link
      href="/culture"
      className={cn(
        "group relative isolate flex min-h-[8.5rem] items-center overflow-hidden border border-[#274638] bg-native-pattern text-white sm:min-h-[10rem]",
        variant === "a" ? "rounded-xl" : "rounded-[1.5rem]",
      )}
    >
      <span className="absolute inset-y-0 right-0 -z-10 w-[38%] md:hidden">
        <Photo name="masquerade" alt="" sizes="38vw" />
        <span className="absolute inset-0 bg-gradient-to-r from-[#0a2c1e] via-[#0a2c1e]/40 to-transparent" aria-hidden />
      </span>
      <span className="flex w-full items-center gap-6 p-5 sm:p-7">
        <span className="block max-w-[64%] md:max-w-none md:flex-1">
          <span className="block text-[0.6rem] font-bold tracking-[0.18em] text-spark uppercase sm:text-xs">More than food</span>
          <span className={cn("mt-1.5 block leading-tight", variant === "a" ? "font-display text-[1.2rem] font-semibold italic sm:text-3xl" : "text-[1.2rem] font-bold sm:text-3xl")}>
            A celebration of people, places &amp; culture.
          </span>
          <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full border border-spark/70 px-3.5 text-xs font-semibold text-spark transition-colors group-hover:bg-spark group-hover:text-[#1a1405] md:hidden">
            Explore culture <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </span>
        <span className="hidden max-w-xs border-l border-white/15 pl-6 text-sm text-white/75 md:block">
          From food and fashion to music and heritage — experience the people, places and stories behind every dish.
        </span>
        <span className="hidden h-10 shrink-0 items-center gap-1.5 rounded-full border border-spark/70 px-5 text-sm font-semibold text-spark transition-colors group-hover:bg-spark group-hover:text-[#1a1405] md:inline-flex">
          Explore culture <ArrowRight className="size-4" aria-hidden />
        </span>
      </span>
    </Link>
  );
}
