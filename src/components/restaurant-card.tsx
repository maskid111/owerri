import Link from "next/link";
import { ArrowRight, MapPin, Star, Store, Truck } from "lucide-react";
import type { Restaurant } from "@/lib/data";
import { cn, distanceLabel, priceLabel } from "@/lib/utils";
import { SaveButton } from "./save-button";
import { NewBadge, Photo, RestaurantRating } from "./ui";

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

/** "Popular this week" card from the homepage reference. */
export function FeaturedCard({ restaurant: r, badge = "Top Pick", className, priority }: { restaurant: Restaurant; badge?: string | null; className?: string; priority?: boolean }) {
  return (
    <article className={cn("group relative overflow-hidden rounded-[1.25rem] border border-line/70 bg-paper shadow-card transition-shadow hover:shadow-lift", className)}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <Photo name={r.cover} alt={`${r.name} — ${r.type}`} sizes="(min-width: 1024px) 380px, 85vw" priority={priority} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />
        {badge && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-forest px-2 py-1 text-[11px] font-bold text-on-forest">
            <Star className="size-3 fill-star text-star" /> {badge}
          </span>
        )}
        <SaveButton slug={r.slug} name={r.name} variant="photo" className="absolute top-2 right-2 z-10" />
      </div>
      <div className="flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-forest">
            <Link href={`/restaurants/${r.slug}`} className="after:absolute after:inset-0">
              {r.name}
            </Link>
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-stone">
            {r.reviewCount ? (
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 fill-star text-star" aria-hidden />
                <span className="font-bold text-ink">{r.rating.toFixed(1)}</span> ({compact(r.reviewCount)} reviews)
              </span>
            ) : (
              <NewBadge />
            )}
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-accent" aria-hidden /> {r.sampleProfile ? "Owerri" : distanceLabel(r.distanceKm)}
            </span>
          </p>
          <p className="mt-1 truncate text-[0.8rem] text-stone">{r.type.replace(/ • /g, " · ")}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-on-accent transition-colors group-hover:bg-accent-hover" aria-hidden>
          <ArrowRight className="size-5" />
        </span>
      </div>
    </article>
  );
}

/** Horizontal listing card from the Food & Restaurants reference. */
export function ListingCard({
  restaurant: r,
  openNow,
  dishes,
  className,
  priority,
}: {
  restaurant: Restaurant;
  openNow?: boolean;
  /** Menu dishes matching the current search, shown as "Serves …". */
  dishes?: string[];
  className?: string;
  priority?: boolean;
}) {
  const ServiceIcon = r.service === "Dine-in only" ? Store : Truck;
  return (
    <article className={cn("group relative flex gap-4 py-4", className)}>
      <div className="relative aspect-square w-[40%] max-w-[11rem] shrink-0 overflow-hidden rounded-2xl bg-sand sm:w-40">
        <Photo name={r.image} alt={`Dish from ${r.name}`} sizes="(min-width: 640px) 176px, 40vw" priority={priority} className="transition-transform duration-500 group-hover:scale-[1.04]" />
        <SaveButton slug={r.slug} name={r.name} variant="photo" className="absolute top-1.5 right-1.5 z-10" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <h3 className="text-[1.2rem] leading-tight font-semibold text-forest sm:text-[1.35rem]">
          <Link href={`/restaurants/${r.slug}`} className="after:absolute after:inset-0">
            {r.name}
          </Link>
        </h3>
        <RestaurantRating restaurant={r} />
        <p className="text-sm text-ink/80">
          {r.cuisine} <span className="text-stone">•</span> <span className="tracking-wider">{priceLabel(r.price)}</span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-ink/80">
          <MapPin className="size-4 text-stone" aria-hidden /> {r.sampleProfile ? "Owerri" : distanceLabel(r.distanceKm)}
          {openNow !== undefined && r.open && (
            <span className={cn("ml-1 text-xs font-semibold", openNow ? "text-forest-light" : "text-stone")}>· {openNow ? "Open now" : "Closed"}</span>
          )}
        </p>
        {dishes && dishes.length > 0 && <p className="line-clamp-1 text-sm text-forest">Serves {dishes.slice(0, 2).join(", ")}</p>}
        <span className="mt-0.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[0.75rem] font-semibold text-on-accent">
          <ServiceIcon className="size-3.5" aria-hidden /> {r.service}
        </span>
      </div>
    </article>
  );
}
