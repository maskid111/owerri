"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CakeSlice, ChevronUp, ConciergeBell, CupSoda, MapPin, Plus, ShoppingBag, Soup, Star, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { cart, useCart } from "@/lib/cart-store";
import { areaName, getRestaurant, menuSections, type MenuItem, type MenuSection, type Restaurant } from "@/lib/data";
import { cn, distanceLabel, naira } from "@/lib/utils";
import { CartConflictDialog, CartDrawer, QtyStepper } from "./cart-ui";
import { HoursRow, RestaurantActions } from "./restaurant-actions";
import { LogoMark, Photo, Rating } from "./ui";

type Tab = "Menu" | "About" | "Reviews" | "Photos";
const tabs: Tab[] = ["Menu", "About", "Reviews", "Photos"];

const sectionIcons: Record<MenuSection | "All", LucideIcon> = {
  All: ConciergeBell,
  "Signature Dishes": Star,
  "Local Dishes": Soup,
  Continental: UtensilsCrossed,
  Drinks: CupSoda,
  Desserts: CakeSlice,
};

export function MenuView({ restaurant: r, menu }: { restaurant: Restaurant; menu: MenuItem[] }) {
  const [tab, setTab] = useState<Tab>("Menu");
  const [section, setSection] = useState<MenuSection | "All">("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, setPending] = useState<MenuItem | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const summary = useCart();

  const available = useMemo(() => menuSections.filter((s) => menu.some((m) => m.section === s.name)), [menu]);
  const visible = section === "All" ? available : available.filter((s) => s.name === section);
  const qtyOf = (id: string) => (summary.restaurant?.slug === r.slug ? (summary.cart.lines.find((l) => l.id === id)?.qty ?? 0) : 0);

  const choose = (s: MenuSection | "All") => {
    setSection(s);
    const el = listRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const add = (item: MenuItem) => {
    if (cart.add(r.slug, item.id) === "conflict") setPending(item);
  };

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const otherRestaurant = summary.cart.restaurant && summary.cart.restaurant !== r.slug ? getRestaurant(summary.cart.restaurant) : undefined;

  return (
    <div className="pb-28">
      {/* Banner */}
      <div className="lg:container-x lg:pt-6">
        <div className="relative h-[13.5rem] overflow-hidden sm:h-64 lg:h-80 lg:rounded-[1.75rem]">
          <Photo name={r.cover} alt={`${r.name} — ${r.type}`} sizes="(min-width: 1024px) 1200px, 100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <Link href={`/restaurants/${r.slug}`} aria-label={`Back to ${r.name}`} className="absolute top-4 left-4 grid size-10 place-items-center rounded-full bg-paper text-forest shadow-card">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-paper px-3 py-1.5 text-sm shadow-card">
            <Star className="size-4 fill-star text-star" aria-hidden />
            <span className="font-bold">{r.rating.toFixed(1)}</span>
            <span className="text-stone">({r.reviewCount})</span>
          </span>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 pb-9 sm:p-6 sm:pb-10 lg:pb-7">
            <div className="text-cream">
              <h1 className="flex items-center gap-1.5 text-[1.7rem] leading-tight font-semibold sm:text-4xl">
                <LogoMark light className="size-6 sm:size-7" /> {r.name}
              </h1>
              <p className="mt-1 text-sm text-cream/90">{r.type}</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-cream/90">
                <MapPin className="size-3.5" aria-hidden /> {distanceLabel(r.distanceKm)} · {areaName(r.area)}, Imo State
              </p>
            </div>
            <p className="hidden max-w-[12rem] text-right font-display text-2xl leading-tight text-leaf italic sm:block">{r.tagline}</p>
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className="relative -mt-5 rounded-t-[1.5rem] bg-canvas lg:mt-0 lg:rounded-none">
        <div className="container-x pt-4 lg:pt-6">
          <div role="tablist" aria-label={`${r.name} sections`} className="grid grid-cols-4 gap-1 rounded-full border border-line bg-paper p-1 lg:max-w-xl">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn("h-9 rounded-full text-sm font-semibold transition-colors", tab === t ? "bg-forest text-on-forest" : "text-ink/75 hover:text-forest")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "Menu" && (
          <div ref={listRef} className="scroll-mt-0 lg:scroll-mt-[76px]">
            {/* Section icons */}
            <div className="sticky top-0 z-30 border-b border-line/70 bg-canvas/95 backdrop-blur lg:top-[76px]">
              <div className="container-x no-scrollbar flex gap-1 overflow-x-auto py-3 sm:gap-3" role="toolbar" aria-label="Menu categories">
                {(["All", ...available.map((s) => s.name)] as const).map((s) => {
                  const Icon = sectionIcons[s];
                  const active = section === s;
                  return (
                    <button key={s} onClick={() => choose(s)} aria-pressed={active} className="flex w-[4.6rem] shrink-0 flex-col items-center gap-1.5 sm:w-24">
                      <span className={cn("grid h-9 w-12 place-items-center rounded-full transition-colors", active ? "bg-accent text-on-accent" : "bg-mint/70 text-forest")}>
                        <Icon className="size-[18px]" strokeWidth={1.9} />
                      </span>
                      <span className={cn("text-center text-[0.68rem] leading-tight sm:text-xs", active ? "font-bold text-forest" : "font-medium text-ink/70")}>{s}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="container-x">
              {visible.map((s) => {
                const items = menu.filter((m) => m.section === s.name);
                return (
                  <section key={s.name} aria-labelledby={`sec-${s.name}`} className="pt-5 lg:pt-8">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h2 id={`sec-${s.name}`} className="text-[1.3rem] leading-tight font-semibold text-forest sm:text-2xl">
                          {s.name}
                        </h2>
                        <p className="text-[0.78rem] text-stone sm:text-sm">{s.blurb}</p>
                      </div>
                      {section === "All" ? (
                        <button onClick={() => choose(s.name)} className="inline-flex shrink-0 items-center gap-1 text-[0.78rem] font-bold text-forest">
                          See all <ArrowRight className="size-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => choose("All")} className="shrink-0 text-[0.78rem] font-bold text-forest underline underline-offset-4">
                          Show all categories
                        </button>
                      )}
                    </div>
                    <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6 sm:gap-y-6 lg:grid-cols-3">
                      {(section === "All" ? items.slice(0, 6) : items).map((m, i) => (
                        <MenuCard
                          key={m.id}
                          item={m}
                          qty={qtyOf(m.id)}
                          onAdd={() => add(m)}
                          onQty={(q) => cart.setQty(m.id, q)}
                          className={cn(section === "All" && i >= 4 && "max-lg:hidden")}
                        />
                      ))}
                    </ul>
                    {section === "All" && items.length > 4 && (
                      <button onClick={() => choose(s.name)} className={cn("mt-3 text-sm font-semibold text-forest underline underline-offset-4", items.length <= 6 && "lg:hidden")}>
                        See all {items.length} in {s.name}
                      </button>
                    )}
                  </section>
                );
              })}
              <p className="pt-6 text-xs text-stone">Prices in Nigerian naira (₦). Sample menu — prices are illustrative.</p>
            </div>
          </div>
        )}

        {tab === "About" && (
          <div className="container-x max-w-3xl pt-6 lg:mx-0">
            <h2 className="text-2xl font-semibold text-forest">About {r.name}</h2>
            <p className="mt-3 leading-relaxed text-ink/85">{r.description}</p>
            <RestaurantActions restaurant={r} className="mt-6 max-w-sm" />
            <div className="mt-6">
              <HoursRow restaurant={r} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {r.tags.map((t) => (
                <span key={t} className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === "Reviews" && (
          <div className="container-x pt-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl font-semibold text-forest">{r.rating.toFixed(1)}</span>
              <span>
                <Rating value={r.rating} />
                <span className="block text-sm text-stone">{r.reviewCount.toLocaleString("en-US")} reviews</span>
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {r.reviews.map((rev) => (
                <figure key={rev.author} className="rounded-[1.25rem] border border-line/70 bg-paper p-5 shadow-card">
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

        {tab === "Photos" && (
          <ul className="container-x grid grid-cols-2 gap-3 pt-6 sm:grid-cols-3 lg:grid-cols-4">
            {[...r.gallery, ...menu.map((m) => m.image)]
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((name) => (
                <li key={name} className="relative aspect-square overflow-hidden rounded-2xl">
                  <Photo name={name} alt={`${r.name} photo`} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Cart bar */}
      {summary.count > 0 && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6">
          <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 rounded-2xl bg-pine pr-2 pl-3 text-cream shadow-lift ring-1 ring-cream/10">
            <button onClick={() => setDrawerOpen(true)} className="flex min-w-0 items-center gap-2.5 text-left" aria-label="Open cart">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream/10">
                <ShoppingBag className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-sm font-semibold">
                  {summary.count} {summary.count === 1 ? "item" : "items"} <ChevronUp className="size-4" />
                </span>
                {otherRestaurant && <span className="block truncate text-[11px] text-cream/70">from {otherRestaurant.name}</span>}
              </span>
            </button>
            <div className="ml-auto text-right">
              <p className="text-[11px] text-cream/70">Total</p>
              <p className="font-bold">{naira(summary.subtotal)}</p>
            </div>
            <button onClick={() => setDrawerOpen(true)} className="inline-flex h-12 items-center gap-1.5 rounded-xl bg-leaf px-4 text-sm font-bold text-forest-deep hover:bg-cream sm:px-6">
              View Cart <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <CartDrawer open={drawerOpen} onClose={closeDrawer} />
      <CartConflictDialog
        pending={pending}
        currentName={otherRestaurant?.name}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) cart.replace(r.slug, pending.id);
          setPending(null);
        }}
      />
    </div>
  );
}

function MenuCard({ item, qty, onAdd, onQty, className }: { item: MenuItem; qty: number; onAdd: () => void; onQty: (q: number) => void; className?: string }) {
  return (
    <li className={cn("flex gap-2.5 sm:gap-4", className)}>
      <span className="relative aspect-square w-[42%] max-w-[7.5rem] shrink-0 self-start overflow-hidden rounded-xl sm:rounded-2xl">
        <Photo name={item.image} alt={item.name} sizes="(min-width: 640px) 120px, 20vw" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display text-[0.86rem] leading-tight font-semibold text-forest sm:text-lg">{item.name}</h3>
        <p className="mt-1 line-clamp-3 text-[0.7rem] leading-snug text-stone sm:text-sm">{item.note}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-1 pt-1.5">
          <span className="text-[0.82rem] font-bold sm:text-base">{naira(item.price)}</span>
          {qty > 0 ? (
            <QtyStepper qty={qty} name={item.name} size="sm" onChange={onQty} />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Add ${item.name} to cart`}
              className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-on-accent transition-colors hover:bg-accent-hover sm:size-9"
            >
              <Plus className="size-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
