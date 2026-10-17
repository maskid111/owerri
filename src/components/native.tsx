import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { ImageName } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Photo } from "./ui";

/**
 * Brand banner built on the supplied Native Kitchen pattern image.
 * A dark-green gradient keeps text legible; an optional photo fills the right side on wider screens.
 */
export function PatternBanner({
  eyebrow,
  title,
  children,
  photo,
  photoAlt = "",
  actions,
  className,
  size = "md",
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  photo?: ImageName;
  photoAlt?: string;
  actions?: ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-[1.5rem] bg-native-pattern text-cream lg:rounded-[2rem]", className)}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/70 via-forest-deep/30 to-transparent" aria-hidden />
      <div className={cn("grid items-stretch", photo && "md:grid-cols-[1.15fr_1fr]")}>
        <div className={cn("flex flex-col justify-center p-6 sm:p-10", size === "lg" ? "lg:p-16" : "lg:p-12")}>
          {eyebrow && (
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-leaf uppercase">
              <span className="h-px w-6 bg-current" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h2 className={cn("mt-3 leading-[1.05] font-semibold text-balance text-cream", size === "lg" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl")}>{title}</h2>
          {children && <div className="mt-4 max-w-lg leading-relaxed text-cream/85">{children}</div>}
          {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {photo && (
          <div className="relative min-h-[14rem] md:min-h-full">
            <Photo name={photo} alt={photoAlt} sizes="(min-width: 768px) 45vw, 100vw" className="md:rounded-l-[1.5rem]" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Photographic page hero for top-level sections (Local Market, Tours, Nearby, Events, Blog…). */
export function PhotoHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  children,
  pattern = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  image: ImageName;
  imageAlt: string;
  children?: ReactNode;
  /** Blend the brand pattern into the left of the hero. */
  pattern?: boolean;
}) {
  return (
    <section className="lg:container-x lg:pt-6">
      <div className="relative isolate flex min-h-[19rem] items-end overflow-hidden rounded-b-[1.75rem] sm:min-h-[24rem] lg:min-h-[28rem] lg:rounded-[2rem]">
        <Photo name={image} alt={imageAlt} sizes="(min-width: 1024px) 1200px, 100vw" priority className="-z-20" />
        {pattern && (
          <div
            className="absolute inset-y-0 left-0 -z-10 w-full bg-native-pattern opacity-90 [mask-image:linear-gradient(to_right,black_25%,transparent_70%)] sm:w-3/4"
            aria-hidden
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/35 to-forest-deep/10" aria-hidden />
        <div className="w-full p-5 text-cream sm:p-8 lg:p-12">
          <p className="text-xs font-bold tracking-[0.18em] text-leaf uppercase">{eyebrow}</p>
          <h1 className="mt-2 max-w-3xl text-[2.2rem] leading-[1.04] font-semibold text-balance text-cream sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mt-3 max-w-xl text-cream/85 sm:text-lg">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Circular-icon discovery shortcut (reference: Native Light homepage). */
export function Shortcut({ href, label, icon: Icon, badge }: { href: string; label: string; icon: LucideIcon; badge?: number }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col items-center gap-2.5 rounded-2xl border border-line/70 bg-paper px-2 py-4 text-center shadow-card transition-transform hover:-translate-y-0.5"
    >
      <span className="relative grid size-12 place-items-center rounded-full bg-forest text-on-forest transition-colors group-hover:bg-accent group-hover:text-on-accent sm:size-14">
        <Icon className="size-[22px] sm:size-6" strokeWidth={1.8} />
        {badge ? <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-accent ring-2 ring-paper" aria-label={`${badge} new`} /> : null}
      </span>
      <span className="text-[0.75rem] leading-tight font-semibold text-forest sm:text-sm">{label}</span>
    </Link>
  );
}

/** Photo tile with icon, title, subtitle and arrow (Tours row in the references). */
export function TourTile({
  href,
  title,
  subtitle,
  image,
  icon: Icon,
  className,
  tall = false,
}: {
  href: string;
  title: string;
  subtitle: string;
  image: ImageName;
  icon: LucideIcon;
  className?: string;
  tall?: boolean;
}) {
  return (
    <Link href={href} className={cn("group relative isolate block overflow-hidden rounded-[1.25rem]", tall ? "aspect-[4/5]" : "aspect-[4/3.2]", className)}>
      <Photo name={image} alt={title} sizes="(min-width: 1024px) 33vw, 80vw" className="-z-10 transition-transform duration-700 group-hover:scale-[1.04]" />
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/25 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 text-cream sm:p-5">
        <span className="min-w-0 flex-1">
          <Icon className="mb-2 size-6 text-cream" strokeWidth={1.8} aria-hidden />
          <span className="block font-display text-xl font-semibold sm:text-2xl">{title}</span>
          <span className="block text-sm text-cream/80">{subtitle}</span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-cream/50 transition-colors group-hover:bg-cream group-hover:text-forest-deep">
          <ArrowRight className="size-4" />
        </span>
      </span>
    </Link>
  );
}

/** Compact square market tile with label strip (Local Market row in the references). */
export function MarketTile({ href, title, image, className }: { href: string; title: string; image: ImageName; className?: string }) {
  return (
    <Link href={href} className={cn("group relative isolate block aspect-square overflow-hidden rounded-[1.1rem]", className)}>
      <Photo name={image} alt={title} sizes="(min-width: 1024px) 25vw, 45vw" className="-z-10 transition-transform duration-700 group-hover:scale-[1.05]" />
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/85 via-transparent to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 text-sm font-semibold text-cream sm:p-4 sm:text-base">
        {title}
        <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
