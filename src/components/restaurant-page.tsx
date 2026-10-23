"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CakeSlice,
  ChevronUp,
  ConciergeBell,
  CupSoda,
  MapPin,
  ShoppingBag,
  Soup,
  Star,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { locationLabel, menuSections, type MenuItem, type MenuSection, type Restaurant } from "@/lib/data";
import { cn, naira } from "@/lib/utils";
import { CartDrawer } from "./cart-ui";
import { AddToCart, useOrdering } from "./food";
import { HoursRow, RestaurantActions } from "./restaurant-actions";
import { RestaurantPhotoCard } from "./restaurant-card";
import { SaveButton } from "./save-button";
import { Photo, ProfileNotice, Rating, SectionHeader } from "./ui";

type Tab = "Menu" | "About" | "Reviews" | "Gallery";
const tabs: Tab[] = ["Menu", "About", "Reviews", "Gallery"];

/** Category circles. "Signature Dishes" is shown to diners as "Popular". */
const sectionMeta: Record<MenuSection | "All", { label: string; icon: LucideIcon }> = {
  All: { label: "All", icon: ConciergeBell },
  "Signature Dishes": { label: "Popular", icon: Star },
  "Local Dishes": { label: "Local", icon: Soup },
  Continental: { label: "Continental", icon: UtensilsCrossed },
  Drinks: { label: "Drinks", icon: CupSoda },
  Desserts: { label: "Desserts", icon: CakeSlice },
};

/**
 * Version A restaurant page — profile and menu in one ordering screen (used by /restaurants/[slug] and
 * /restaurants/[slug]/menu): dark photo hero, tabs, category circles, popular-dish cards and menu rows with
 * add-to-cart, then a cart bar that opens the cart drawer and checkout.
 */
export function RestaurantPage({ restaurant: r, menu, related }: { restaurant: Restaurant; menu: MenuItem[]; related: Restaurant[] }) {
  const [tab, setTab] = useState<Tab>("Menu");
  const [section, setSection] = useState<MenuSection | "All">("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { summary, qtyOf, add, setQty, conflict } = useOrdering();
  const tabsRef = useRef<HTMLDivElement>(null);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const available = useMemo(() => menuSections.filter((s) => menu.some((m) => m.section === s.name)), [menu]);
  const visible = section === "All" ? available : available.filter((s) => s.name === section);
  const kind = r.type.split(" • ")[0];
  const chips = [r.service === "Dine-in only" ? "Dine-in" : r.service, ...r.tags.filter((t) => t !== "New on Native")].slice(0, 4);

  const choose = (s: MenuSection | "All") => {
    setSection(s);
    const el = tabsRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" });
  };

  const addProps = (m: MenuItem) => ({ qty: qtyOf(r.slug, m.id), name: m.name, onAdd: () => add(r.slug, m), onQty: (q: number) => setQty(m.id, q) });

  return (
    <div className="pb-28">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest-deep text-white">
        <Photo name={r.cover} alt="" sizes="100vw" priority className="-z-20 opacity-70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/80 to-forest-deep/40 lg:bg-gradient-to-r lg:via-forest-deep/85 lg:to-forest-deep/30" aria-hidden />
        <div className="container-x pt-4 pb-7 lg:pt-8 lg:pb-9">
          <div className="flex items-center justify-between gap-3">
            <Link href="/restaurants" className="inline-flex items-center gap-2 rounded-full bg-white/12 py-2 pr-4 pl-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20">
              <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Restaurants</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <SaveButton slug={r.slug} name={r.name} variant="circle" />
          </div>

          <div className="mt-6 flex items-end gap-4 sm:gap-6">
            <span className="relative hidden aspect-[4/3] w-44 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/20 sm:block lg:w-56">
              <Photo name={r.gallery[1] ?? r.image} alt={`${r.name} photo`} sizes="224px" />
            </span>
            <div className="min-w-0">
              <span className="inline-block rounded-full border border-spark/70 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-[0.14em] text-spark uppercase">{kind}</span>
              <h1 className="mt-2 font-display text-[2.1rem] leading-[1.05] font-semibold sm:text-5xl">{r.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4" aria-hidden /> {locationLabel(r)}
                </span>
                {r.reviewCount ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-4 fill-spark text-spark" aria-hidden /> {r.rating.toFixed(1)} ({r.reviewCount.toLocaleString("en-US")} reviews)
                  </span>
                ) : (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">New on Native</span>
                )}
              </p>
              <p className="mt-1.5 text-sm text-white/75">{r.tagline}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {chips.map((c, i) => (
                  <li key={c} className="inline-flex items-center gap-1 rounded-full border border-white/25 px-2.5 py-1 text-xs">
                    {i === 0 && <Truck className="size-3.5" aria-hidden />} {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div ref={tabsRef} className="sticky top-0 z-30 scroll-mt-0 bg-forest-deep text-white lg:top-[76px]">
        <div role="tablist" aria-label={`${r.name} sections`} className="container-x no-scrollbar flex gap-6 overflow-x-auto border-t border-white/10 sm:gap-9">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn("relative shrink-0 py-3.5 text-sm font-semibold transition-colors", tab === t ? "text-spark" : "text-white/70 hover:text-white")}
            >
              {t}
              {tab === t && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-spark" />}
            </button>
          ))}
        </div>
      </div>

      {tab === "Menu" && (
        <div className="container-x">
          <ProfileNotice restaurant={r} className="mt-4" />

          {/* Category circles */}
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pt-6 pb-2 sm:mx-0 sm:gap-7 sm:px-0" role="toolbar" aria-label="Menu categories">
            {(["All", ...available.map((s) => s.name)] as const).map((s) => {
              const { label, icon: Icon } = sectionMeta[s];
              const active = section === s;
              return (
                <button key={s} onClick={() => choose(s)} aria-pressed={active} className="flex w-16 shrink-0 flex-col items-center gap-2 sm:w-20">
                  <span
                    className={cn(
                      "grid size-14 place-items-center rounded-full transition-colors sm:size-16",
                      active ? "bg-forest text-on-forest shadow-card" : "bg-sand text-forest hover:bg-mint",
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.7} />
                  </span>
                  <span className={cn("text-xs", active ? "font-bold text-forest" : "font-medium text-ink/70")}>{label}</span>
                  <span className={cn("-mt-1 h-[3px] w-5 rounded-full", active ? "bg-forest" : "bg-transparent")} aria-hidden />
                </button>
              );
            })}
          </div>

          {visible.map((s) => {
            const items = menu.filter((m) => m.section === s.name);
            const featured = s.name === "Signature Dishes";
            return (
              <section key={s.name} aria-labelledby={`menu-${s.name}`} className="pt-8 lg:pt-10">
                <div className="flex items-end gap-3">
                  <h2 id={`menu-${s.name}`} className="font-display text-2xl font-semibold text-forest sm:text-3xl">
                    {featured ? "Popular dishes" : s.name}
                  </h2>
                  <span className="mb-2.5 h-[2px] w-8 rounded-full bg-spark" aria-hidden />
                  <span className="ml-auto mb-1 text-xs text-stone">{items.length} items</span>
                </div>
                {featured ? (
                  <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {items.map((m) => (
                      <li key={m.id} className="flex flex-col overflow-hidden rounded-2xl bg-forest-deep text-white shadow-card">
                        <span className="relative block aspect-[4/3]">
                          <Photo name={m.image} alt={m.name} sizes="(min-width: 1024px) 25vw, 50vw" />
                          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-deep to-transparent" aria-hidden />
                        </span>
                        <div className="flex flex-1 flex-col px-3 pb-3 sm:px-3.5">
                          <h3 className="font-semibold leading-snug">{m.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-white/65">{m.note}</p>
                          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                            <span className="font-semibold">{naira(m.price)}</span>
                            <AddToCart {...addProps(m)} />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {items.map((m) => (
                      <li key={m.id} className="flex items-center gap-3 rounded-2xl border border-line/70 bg-paper p-2.5 shadow-card sm:gap-4">
                        <span className="relative size-20 shrink-0 overflow-hidden rounded-xl sm:size-24">
                          <Photo name={m.image} alt={m.name} sizes="96px" />
                        </span>
                        <div className="min-w-0 flex-1 py-1">
                          <h3 className="font-semibold text-forest">{m.name}</h3>
                          <p className="mt-0.5 line-clamp-2 text-xs text-stone sm:text-sm">{m.note}</p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="font-semibold">{naira(m.price)}</span>
                            <AddToCart {...addProps(m)} />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
          <p className="pt-6 text-xs text-stone">
            Prices in Nigerian naira (₦). {r.sampleProfile ? `Sample menu — dishes and prices to be confirmed by ${r.name}.` : "Sample menu — prices are illustrative."}
          </p>
        </div>
      )}

      {tab === "About" && (
        <div className="container-x grid max-w-5xl grid-cols-1 gap-8 pt-8 lg:mx-auto lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">About {r.name}</h2>
            <p className="mt-3 leading-relaxed text-ink/85">{r.description}</p>
            <ProfileNotice restaurant={r} className="mt-3" />
            <RestaurantActions restaurant={r} className="mt-6 max-w-sm" />
          </div>
          <div className="rounded-2xl border border-line/70 bg-paper px-5 py-2 shadow-card">
            <HoursRow restaurant={r} />
            <p className="flex items-center gap-2 py-4 text-sm text-ink/80">
              <MapPin className="size-4 text-forest" aria-hidden /> {r.address}
            </p>
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <div className="container-x pt-8">
          {r.reviewCount ? (
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl font-semibold text-forest">{r.rating.toFixed(1)}</span>
              <span>
                <Rating value={r.rating} />
                <span className="block text-sm text-stone">{r.reviewCount.toLocaleString("en-US")} reviews</span>
              </span>
            </div>
          ) : (
            <p className="text-stone">No reviews yet — {r.name} is new on Native.</p>
          )}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {r.reviews.map((rev) => (
              <figure key={rev.author} className="rounded-2xl border border-line/70 bg-paper p-5 shadow-card">
                <Rating value={rev.rating} />
                <blockquote className="mt-2 font-display text-lg leading-snug text-forest">“{rev.text}”</blockquote>
                <figcaption className="mt-3 text-sm text-stone">
                  {rev.author} · {rev.date}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {tab === "Gallery" && (
        <ul className="container-x grid grid-cols-2 gap-3 pt-8 sm:grid-cols-3 lg:grid-cols-4">
          {[...r.gallery, ...menu.map((m) => m.image)]
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((name) => (
              <li key={name} className="relative aspect-square overflow-hidden rounded-2xl">
                <Photo name={name} alt={`${r.name} photo`} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
              </li>
            ))}
        </ul>
      )}

      {related.length > 0 && (
        <section className="container-x pt-14">
          <SectionHeader title="You might also like" href="/restaurants" />
          <div className="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {related.map((x) => (
              <RestaurantPhotoCard key={x.slug} restaurant={x} className="w-[84%] shrink-0 snap-start sm:w-auto" />
            ))}
          </div>
        </section>
      )}

      {/* Cart bar */}
      {summary.count > 0 && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6">
          <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 rounded-2xl bg-forest-deep pr-2 pl-3 text-white shadow-lift ring-1 ring-white/10">
            <button onClick={() => setDrawerOpen(true)} className="flex min-w-0 items-center gap-2.5 text-left" aria-label="Open cart">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10">
                <ShoppingBag className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-sm font-semibold">
                  {summary.count} {summary.count === 1 ? "item" : "items"} <ChevronUp className="size-4" />
                </span>
                {summary.restaurant && summary.restaurant.slug !== r.slug && <span className="block truncate text-[11px] text-white/70">from {summary.restaurant.name}</span>}
              </span>
            </button>
            <div className="ml-auto text-right">
              <p className="text-[11px] text-white/70">Subtotal</p>
              <p className="font-bold">{naira(summary.subtotal)}</p>
            </div>
            <button onClick={() => setDrawerOpen(true)} className="inline-flex h-12 items-center gap-1.5 rounded-xl bg-spark px-4 text-sm font-bold text-forest-deep hover:bg-[#f5b33a] sm:px-6">
              View cart <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <CartDrawer open={drawerOpen} onClose={closeDrawer} />
      {conflict}
    </div>
  );
}
