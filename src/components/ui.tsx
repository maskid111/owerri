import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { img, type ImageName } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Native Kitchen leaf mark (green on light surfaces, leaf-green on dark ones). */
export function LogoMark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("shrink-0", light ? "text-leaf" : "text-accent", className)} aria-hidden>
      <path d="M8 25C6.5 15.5 12.5 7 26 5c.8 12.6-6.6 20.4-18 20Z" fill="currentColor" />
      <path d="M8.5 24.5C12 18.5 16 14 21.5 10" stroke={light ? "#0a2c1e" : "var(--color-canvas)"} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export const BRAND = { name: "Native Kitchen", tagline: "Native, beyond the plate" };

export function Logo({ light = false, tagline = true, className }: { light?: boolean; tagline?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark light={light} className="size-7 sm:size-8" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[1.22rem] font-semibold tracking-tight whitespace-nowrap sm:text-[1.6rem]", light ? "text-cream" : "text-forest")}>
          Native <span className="font-normal italic">Kitchen</span>
        </span>
        {tagline && <span className={cn("mt-1 text-[0.62rem] font-semibold tracking-[0.08em]", light ? "text-cream/80" : "text-stone")}>{BRAND.tagline}</span>}
      </span>
    </span>
  );
}

/** "Explore by interest ··· See all →" style section header from the references. */
export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "See all",
  light = false,
  className,
  as: Tag = "h2",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  linkLabel?: string;
  light?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <Tag className={cn("text-[1.45rem] leading-tight font-semibold sm:text-3xl", light ? "text-cream" : "text-forest")}>{title}</Tag>
        {subtitle && <p className={cn("mt-1 text-sm", light ? "text-cream/70" : "text-stone")}>{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-1 pb-1 text-[0.8rem] font-bold sm:text-sm",
            light ? "text-cream hover:text-leaf" : "text-forest hover:text-forest-light",
          )}
        >
          {linkLabel}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star className="size-4 fill-star text-star" aria-hidden />
      <span className="font-bold text-ink">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-stone">({count.toLocaleString("en-US")})</span>}
      <span className="sr-only">out of 5</span>
    </span>
  );
}

type Variant = "primary" | "forest" | "outline" | "light" | "cream";
type Size = "sm" | "md" | "lg";

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" && "h-9 px-4 text-[0.8rem]",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-14 px-7 text-base",
    variant === "primary" && "bg-accent text-on-accent hover:bg-accent-hover",
    variant === "forest" && "bg-forest text-on-forest hover:bg-forest-light",
    variant === "outline" && "border border-line bg-paper text-forest hover:border-forest/40",
    variant === "light" && "border border-cream/30 bg-cream/10 text-cream hover:bg-cream/20",
    variant === "cream" && "bg-cream text-forest-deep hover:bg-leaf",
    className,
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: { href: string; children: ReactNode; variant?: Variant; size?: Size; className?: string } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Arrow() {
  return <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />;
}

/** Rounded filter chip ("All", "Food & Drink", …). */
export function chipClass(active: boolean, className?: string) {
  return cn(
    "inline-flex h-9 shrink-0 items-center justify-center rounded-full border px-4 text-[0.82rem] font-semibold whitespace-nowrap transition-colors",
    active ? "border-forest bg-forest text-on-forest" : "border-line bg-paper text-ink/80 hover:border-forest/40 hover:text-forest",
    className,
  );
}

/** next/image wrapper for the local photography library. Parent must be positioned with a size. */
export function Photo({
  name,
  alt,
  sizes,
  priority = false,
  className,
}: {
  name: ImageName;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return <Image src={img(name)} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
}

/** Compact page header used on inner pages (mobile-app style title + optional description). */
export function PageHeader({ title, description, children, className }: { title: ReactNode; description?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <header className={cn("container-x pt-5 pb-2 lg:pt-10", className)}>
      <h1 className="text-[1.9rem] leading-tight font-semibold text-forest sm:text-4xl lg:text-5xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-[0.95rem] text-stone sm:text-base">{description}</p>}
      {children}
    </header>
  );
}

export function SampleNote({ className, children }: { className?: string; children?: ReactNode }) {
  return <p className={cn("text-xs text-stone", className)}>{children ?? "Listings, prices and dates are sample content for this preview."}</p>;
}
