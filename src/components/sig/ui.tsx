import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, Star, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Restaurant, Story } from "@/lib/data";
import type { ImageName } from "@/lib/images";
import { cn, distanceLabel, priceLabel } from "@/lib/utils";
import { SaveButton } from "../save-button";
import { Wordmark } from "../brand";
import { Photo } from "../ui";

/**
 * Version B — Native Signature Experience: shared presentation primitives.
 * Visual language: centred uppercase wordmark, bold sans headings, tracked uppercase labels,
 * caption-bar photo tiles, portrait cards, pill buttons and pattern-backed dark-green bands.
 */

/** Version B logo — the shared Native wordmark, centred. */
export function SigWordmark({ light = false, size = "md", className }: { light?: boolean; size?: "sm" | "md" | "lg"; className?: string }) {
  return <Wordmark tone={light ? "light" : "dark"} size={size} align="center" className={className} />;
}

/** Tiny orange separator — the only decorative accent in Version B labels. */
export function SigDash({ className }: { className?: string }) {
  return <span className={cn("inline-block h-[2px] w-5 rounded-full bg-spark", className)} aria-hidden />;
}

type BtnVariant = "solid" | "white" | "outline" | "ghost";
export function sigBtn(variant: BtnVariant = "solid", className?: string) {
  return cn(
    "group inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-[0.78rem] font-bold tracking-[0.1em] uppercase transition-all duration-300 disabled:opacity-40",
    variant === "solid" && "bg-forest text-on-forest hover:bg-forest-light hover:shadow-lift",
    variant === "white" && "bg-white text-forest-deep hover:bg-leaf",
    variant === "outline" && "border-2 border-forest text-forest hover:bg-forest hover:text-on-forest",
    variant === "ghost" && "border border-white/40 text-white hover:border-white hover:bg-white/10",
    className,
  );
}

export function SigArrow() {
  return <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />;
}

export function SigEyebrow({ children, light = false, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.26em] uppercase", light ? "text-leaf" : "text-forest-light", className)}>
      <SigDash />
      {children}
    </p>
  );
}

/** Section header: tracked eyebrow, heavy title and an outlined "See all" pill, over a hairline. */
export function SigSection({
  eyebrow,
  title,
  href,
  linkLabel = "See all",
  children,
  className,
  anchor,
}: {
  eyebrow?: string;
  title: ReactNode;
  href?: string;
  linkLabel?: string;
  children?: ReactNode;
  className?: string;
  /** Hash target for Version B (ids belong to Version A; see SigHashScroll). */
  anchor?: string;
}) {
  return (
    <section className={cn("container-x scroll-mt-28", className)} data-anchor={anchor}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <SigEyebrow>{eyebrow}</SigEyebrow>}
          <h2 className="mt-1.5 text-[1.65rem] leading-[1.05] text-forest sm:text-4xl">{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[0.68rem] font-bold tracking-[0.14em] text-forest uppercase transition-colors hover:border-forest hover:bg-forest hover:text-on-forest"
          >
            {linkLabel}
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}

/** Photo tile with a solid forest caption bar (the "Featured Experiences" tiles in the reference). */
export function SigTileBody({
  title,
  subtitle,
  image,
  alt,
  icon: Icon,
  badge,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 33vw, 85vw",
}: {
  title: string;
  subtitle?: string;
  image: ImageName;
  alt?: string;
  icon?: LucideIcon;
  badge?: ReactNode;
  aspect?: string;
  sizes?: string;
}) {
  return (
    <>
      <span className={cn("relative block overflow-hidden", aspect)}>
        <Photo name={image} alt={alt ?? title} sizes={sizes} className="transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
        {badge && <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-forest uppercase">{badge}</span>}
      </span>
      <span className="flex items-center gap-3 bg-forest px-4 py-3.5 text-on-forest">
        {Icon && <Icon className="size-5 shrink-0 opacity-90" strokeWidth={1.8} aria-hidden />}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-bold leading-tight">{title}</span>
          {subtitle && <span className="mt-0.5 block truncate text-xs opacity-75">{subtitle}</span>}
        </span>
        <span className="grid-cols-1 grid size-9 shrink-0 place-items-center rounded-full border border-current/30 transition-all duration-300 group-hover:rotate-[-45deg] group-hover:bg-white group-hover:text-forest-deep">
          <ArrowRight className="size-4" />
        </span>
      </span>
    </>
  );
}

export const sigTileClass = "group block overflow-hidden rounded-2xl bg-forest text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift";

export function SigTile({ href, className, ...body }: Parameters<typeof SigTileBody>[0] & { href: string; className?: string }) {
  return (
    <Link href={href} className={cn(sigTileClass, className)}>
      <SigTileBody {...body} />
    </Link>
  );
}

/** Portrait restaurant card: full-height food photo with details overlaid. */
export function SigRestaurantCard({ restaurant: r, className, sizes = "(min-width: 1024px) 25vw, 50vw" }: { restaurant: Restaurant; className?: string; sizes?: string }) {
  return (
    <article className={cn("group relative isolate overflow-hidden rounded-[1.4rem] bg-forest-deep shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift", className)}>
      <div className="relative aspect-[4/5]">
        <Photo name={r.image} alt={`Dish from ${r.name}`} sizes={sizes} className="transition-transform duration-700 group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/30 to-transparent" />
      </div>
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-forest-deep">
        <Star className="size-3.5 fill-accent text-accent" /> {r.rating.toFixed(1)}
      </span>
      <SaveButton slug={r.slug} name={r.name} variant="photo" className="absolute top-2 right-2 z-10" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="text-[0.62rem] font-bold tracking-[0.18em] text-leaf uppercase">{r.cuisine}</p>
        <h3 className="mt-1 text-lg leading-tight text-white sm:text-xl">
          <Link href={`/restaurants/${r.slug}`} className="after:absolute after:inset-0">
            {r.name}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-2 text-xs text-white/80">
          <MapPin className="size-3.5" /> {distanceLabel(r.distanceKm)} · {priceLabel(r.price)} · {r.service === "Dine-in only" ? "Dine-in" : "Order"}
        </p>
      </div>
    </article>
  );
}

/** Compact list row for restaurants (used in "order from local kitchens" and side lists). */
export function SigRestaurantRow({ restaurant: r }: { restaurant: Restaurant }) {
  return (
    <div className="group relative flex items-center gap-4 rounded-2xl bg-paper p-3 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <span className="relative size-20 shrink-0 overflow-hidden rounded-xl">
        <Photo name={r.image} alt={r.name} sizes="80px" />
      </span>
      <span className="min-w-0 flex-1">
        <Link href={`/restaurants/${r.slug}`} className="block truncate font-bold text-forest after:absolute after:inset-0">
          {r.name}
        </Link>
        <span className="mt-0.5 block truncate text-xs text-stone">
          {r.type.replace(/ • /g, " · ")} · {distanceLabel(r.distanceKm)}
        </span>
        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-forest">
          <Star className="size-3.5 fill-star text-star" /> {r.rating.toFixed(1)} <span className="font-normal text-stone">({r.reviewCount})</span>
        </span>
      </span>
      <span className="hidden rounded-full bg-mint px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.12em] text-forest uppercase transition-colors group-hover:bg-forest group-hover:text-on-forest sm:inline">
        {r.service === "Dine-in only" ? "View" : "Order"}
      </span>
    </div>
  );
}

/** Dark-green page band that continues the header, with the brand pattern and an optional photo wash. */
export function SigPageHeader({
  eyebrow,
  title,
  description,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  image?: ImageName;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-b-[2.5rem] bg-forest-deep text-white lg:rounded-b-[3.5rem]">
      {image && <Photo name={image} alt="" sizes="100vw" priority className="-z-20 opacity-45" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/70 via-forest-deep/65 to-forest-deep" aria-hidden />
      <div className="container-x py-14 text-center sm:py-20 lg:py-24">
        <span className="inline-flex items-center gap-2.5 text-[0.65rem] font-bold tracking-[0.24em] text-white/75 uppercase">
          <SigDash /> {eyebrow}
        </span>
        <h1 className="mx-auto mt-4 max-w-4xl text-[2.4rem] leading-[0.98] text-balance text-white sm:text-6xl lg:text-7xl">{title}</h1>
        {description && <p className="mx-auto mt-4 max-w-2xl text-white/80 sm:text-lg">{description}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}

/** Magazine-style story list item. */
export function SigStoryRow({ story, index }: { story: Story; index?: number }) {
  return (
    <Link href={`/stories/${story.slug}`} className="group flex gap-4 border-b border-line py-4 last:border-0">
      {index !== undefined && <span className="text-3xl leading-none font-extrabold text-tint">{String(index + 1).padStart(2, "0")}</span>}
      <span className="min-w-0 flex-1">
        <span className="text-[0.62rem] font-bold tracking-[0.2em] text-forest-light uppercase">{story.category}</span>
        <span className="mt-1 block text-lg leading-snug font-bold text-forest transition-colors group-hover:text-forest-light">{story.title}</span>
        <span className="mt-1 line-clamp-2 block text-sm text-stone">{story.dek}</span>
      </span>
      <span className="relative size-20 shrink-0 overflow-hidden rounded-xl sm:size-24">
        <Photo name={story.image} alt="" sizes="96px" className="transition-transform duration-500 group-hover:scale-110" />
      </span>
    </Link>
  );
}

export function SigStoryFeature({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.slug}`} className="group relative isolate flex min-h-[24rem] items-end overflow-hidden rounded-[1.75rem] text-white lg:min-h-[30rem]">
      <Photo name={story.image} alt={story.title} sizes="(min-width: 1024px) 55vw, 100vw" className="-z-10 transition-transform duration-700 group-hover:scale-[1.04]" />
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
      <span className="p-6 sm:p-8">
        <span className="rounded-full bg-white px-3 py-1 text-[0.62rem] font-bold tracking-[0.18em] text-forest uppercase">{story.category}</span>
        <span className="mt-3 block text-3xl leading-tight font-extrabold sm:text-4xl">{story.title}</span>
        <span className="mt-2 block max-w-lg text-white/80">{story.dek}</span>
        <span className={sigBtn("white", "mt-5")}>
          Read story <SigArrow />
        </span>
      </span>
    </Link>
  );
}

export function SigNote({ children }: { children?: ReactNode }) {
  return <p className="container-x py-8 text-center text-xs text-stone">{children ?? "Listings, prices and dates are sample content for this preview."}</p>;
}
