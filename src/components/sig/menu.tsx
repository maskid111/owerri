"use client";

import Link from "next/link";
import { ArrowLeft, CakeSlice, ConciergeBell, CupSoda, MapPin, ShoppingBag, Soup, Star, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { locationLabel, menuSections, type MenuItem, type MenuSection, type Restaurant } from "@/lib/data";
import { cn, naira } from "@/lib/utils";
import { CartDrawer, CartLines, CartTotals, FulfilmentToggle } from "../cart-ui";
import { AddToCart, useOrdering } from "../food";
import { HoursRow, RestaurantActions } from "../restaurant-actions";
import { SaveButton } from "../save-button";
import { Photo, ProfileNotice } from "../ui";
import { SigArrow, sigBtn, SigRestaurantCard, SigSection } from "./ui";

type Tab = "Menu" | "About" | "Reviews";

const sectionMeta: Record<MenuSection | "All", { label: string; icon: LucideIcon }> = {
  All: { label: "All", icon: ConciergeBell },
  "Signature Dishes": { label: "Popular", icon: Star },
  "Local Dishes": { label: "Local", icon: Soup },
  Continental: { label: "Continental", icon: UtensilsCrossed },
  Drinks: { label: "Drinks", icon: CupSoda },
  Desserts: { label: "Desserts", icon: CakeSlice },
};

/**
 * Version B restaurant page — profile and ordering in one (used by /restaurants/[slug] and its /menu route):
 * rounded photo hero, tabs, category circles, popular-dish cards, menu rows and a persistent order panel
 * (same cart logic as Version A).
 */
export function SigMenu({ restaurant: r, menu, related = [] }: { restaurant: Restaurant; menu: MenuItem[]; related?: Restaurant[] }) {
  const [tab, setTab] = useState<Tab>("Menu");
  const [section, setSection] = useState<MenuSection | "All">("All");
  const [drawer, setDrawer] = useState(false);
  const { summary, qtyOf, add, setQty, conflict } = useOrdering();
  const sections = useMemo(() => menuSections.filter((s) => menu.some((m) => m.section === s.name)), [menu]);
  const visible = section === "All" ? sections : sections.filter((s) => s.name === section);
  const other = summary.restaurant && summary.restaurant.slug !== r.slug ? summary.restaurant : undefined;
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const addProps = (m: MenuItem) => ({ qty: qtyOf(r.slug, m.id), name: m.name, onAdd: () => add(r.slug, m), onQty: (q: number) => setQty(m.id, q), tone: "outline" as const });

  return (
    <div className="pb-28 lg:pb-12">
      {/* Hero */}
      <div className="container-x pt-3 lg:pt-8">
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-forest-deep p-5 text-white sm:p-8 lg:rounded-[2.5rem] lg:p-10">
          <Photo name={r.cover} alt="" sizes="(min-width: 1280px) 1200px, 100vw" priority className="-z-20 opacity-75" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/70 to-forest-deep/30 lg:bg-gradient-to-r lg:via-forest-deep/80" aria-hidden />
          <div className="flex items-center justify-between">
            <Link href="/restaurants" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-forest-deep">
              <ArrowLeft className="size-4" /> Restaurants
            </Link>
            <SaveButton slug={r.slug} name={r.name} variant="circle" />
          </div>
          <div className="mt-10 flex items-end gap-5 sm:mt-14">
            <span className="relative hidden size-28 shrink-0 overflow-hidden rounded-[1.4rem] ring-4 ring-white/15 sm:block lg:size-36">
              <Photo name={r.gallery[1] ?? r.image} alt={`${r.name} photo`} sizes="144px" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-leaf">{r.type.replace(/ • /g, " · ")}</p>
              <h1 className="mt-1 text-4xl leading-none text-white sm:text-6xl">{r.name}</h1>
              <p className="mt-2 text-white/80">{r.tagline}</p>
              <p className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-forest-deep">
                  {r.reviewCount ? (
                    <>
                      <Star className="size-3.5 fill-spark text-spark" /> {r.rating.toFixed(1)} ({r.reviewCount})
                    </>
                  ) : (
                    "New on Native"
                  )}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1">
                  <MapPin className="size-3.5" /> {locationLabel(r)}
                </span>
                <span className="rounded-full border border-white/30 px-3 py-1">{r.service}</span>
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 flex gap-6 border-b border-line" role="tablist" aria-label={`${r.name} sections`}>
          {(["Menu", "About", "Reviews"] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn("relative pb-3 text-sm font-semibold", tab === t ? "text-forest" : "text-stone hover:text-forest")}
            >
              {t}
              <span className={cn("absolute inset-x-0 -bottom-px h-[3px] rounded-t-full bg-forest transition-transform", tab === t ? "scale-x-100" : "scale-x-0")} />
            </button>
          ))}
        </div>
      </div>

      {tab === "Menu" && (
        <div className="container-x mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_21rem]">
          <div className="min-w-0">
            <ProfileNotice restaurant={r} className="mb-4" />

            {/* Category circles */}
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-5 sm:px-0" role="toolbar" aria-label="Menu categories">
              {(["All", ...sections.map((s) => s.name)] as const).map((s) => {
                const { label, icon: Icon } = sectionMeta[s];
                const active = section === s;
                return (
                  <button key={s} onClick={() => setSection(s)} aria-pressed={active} className="flex w-[4.25rem] shrink-0 flex-col items-center gap-1.5">
                    <span
                      className={cn(
                        "grid size-14 place-items-center rounded-full ring-4 transition-colors",
                        active ? "bg-forest text-on-forest ring-mint" : "bg-paper text-forest shadow-card ring-transparent hover:bg-mint",
                      )}
                    >
                      <Icon className="size-6" strokeWidth={1.7} />
                    </span>
                    <span className={cn("text-xs", active ? "font-bold text-forest" : "font-medium text-stone")}>{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-10">
              {visible.map((s) => {
                const items = menu.filter((m) => m.section === s.name);
                const featured = s.name === "Signature Dishes";
                return (
                  <section key={s.name}>
                    <h2 className="text-2xl text-forest sm:text-3xl">{featured ? "Popular dishes" : s.name}</h2>
                    <p className="text-sm text-stone">{s.blurb}</p>
                    {featured ? (
                      <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                        {items.map((m) => (
                          <li key={m.id} className="flex flex-col rounded-[1.4rem] bg-paper p-2 shadow-card">
                            <span className="relative block aspect-square overflow-hidden rounded-[1.1rem]">
                              <Photo name={m.image} alt={m.name} sizes="(min-width: 1280px) 20vw, 45vw" />
                            </span>
                            <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1.5">
                              <h3 className="leading-snug font-bold text-forest">{m.name}</h3>
                              <p className="mt-0.5 line-clamp-2 text-xs text-stone">{m.note}</p>
                              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                                <span className="font-extrabold text-forest">{naira(m.price)}</span>
                                <AddToCart {...addProps(m)} />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="mt-4 grid grid-cols-1 gap-3">
                        {items.map((m) => {
                          const q = qtyOf(r.slug, m.id);
                          return (
                            <li key={m.id} className={cn("flex items-center gap-4 rounded-2xl bg-paper p-3 shadow-card transition-shadow", q > 0 && "ring-2 ring-forest")}>
                              <div className="min-w-0 flex-1 pl-1">
                                <h3 className="text-base text-forest sm:text-lg">{m.name}</h3>
                                <p className="mt-0.5 line-clamp-2 text-xs text-stone sm:text-sm">{m.note}</p>
                                <div className="mt-2 flex items-center gap-3">
                                  <span className="font-extrabold text-forest">{naira(m.price)}</span>
                                  <AddToCart {...addProps(m)} />
                                </div>
                              </div>
                              <span className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
                                <Photo name={m.image} alt={m.name} sizes="112px" />
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-stone">
              Prices in naira (₦). {r.sampleProfile ? `Sample menu — dishes and prices to be confirmed by ${r.name}.` : "Sample menu — prices are illustrative."}
            </p>
          </div>

          {/* Order panel (desktop) */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <div className="rounded-[1.75rem] bg-paper p-5 shadow-lift">
              <p className="flex items-center gap-2 text-lg font-extrabold text-forest">
                <ShoppingBag className="size-5" /> Your order
              </p>
              {summary.count === 0 ? (
                <p className="mt-3 text-sm text-stone">Add dishes to start an order.</p>
              ) : (
                <>
                  {other && <p className="mt-1 text-xs text-stone">Items from {other.name}</p>}
                  <CartLines summary={summary} />
                  <div className="space-y-4 border-t border-line pt-4">
                    <FulfilmentToggle mode={summary.mode} />
                    <CartTotals summary={summary} />
                    <Link href="/orders" className={sigBtn("solid", "h-12 w-full")}>
                      Checkout <SigArrow />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {tab === "About" && (
        <div className="container-x mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-ink/85">{r.description}</p>
            <ProfileNotice restaurant={r} className="mt-3" />
            <div className="mt-6">
              <RestaurantActions restaurant={r} />
            </div>
          </div>
          <div className="rounded-2xl bg-paper p-5 shadow-card">
            <HoursRow restaurant={r} />
            <p className="mt-4 text-sm text-stone">{r.address}</p>
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <div className="container-x mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {r.reviews.length === 0 && <p className="text-stone">No reviews yet — {r.name} is new on Native.</p>}
          {r.reviews.map((rev) => (
            <figure key={rev.author} className="rounded-2xl bg-forest p-5 text-on-forest">
              <blockquote className="text-lg leading-snug font-semibold">“{rev.text}”</blockquote>
              <figcaption className="mt-3 text-xs font-semibold opacity-70">
                {rev.author} · {rev.date} · {rev.rating}/5
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <SigSection eyebrow="Keep exploring" title="You might also like" href="/restaurants" className="pt-14">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((x) => (
              <SigRestaurantCard key={x.slug} restaurant={x} />
            ))}
          </div>
        </SigSection>
      )}

      {/* Mobile order bar */}
      {summary.count > 0 && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper px-4 py-3 lg:hidden">
          <button onClick={() => setDrawer(true)} className="group flex h-14 w-full items-center gap-3 rounded-full bg-forest pr-2 pl-5 text-on-forest">
            <span className="text-sm font-bold">
              {summary.count} {summary.count === 1 ? "item" : "items"}
            </span>
            <span className="ml-auto text-sm font-extrabold">{naira(summary.subtotal)}</span>
            <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-forest-deep">
              View order <SigArrow />
            </span>
          </button>
        </div>
      )}

      <CartDrawer open={drawer} onClose={closeDrawer} />
      {conflict}
    </div>
  );
}
