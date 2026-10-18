"use client";

import Link from "next/link";
import { ArrowLeft, Plus, ShoppingBag, Star } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cart, useCart } from "@/lib/cart-store";
import { getRestaurant, locationLabel, menuSections, type MenuItem, type MenuSection, type Restaurant } from "@/lib/data";
import { cn, naira } from "@/lib/utils";
import { CartConflictDialog, CartDrawer, CartLines, CartTotals, FulfilmentToggle, QtyStepper } from "../cart-ui";
import { HoursRow, RestaurantActions } from "../restaurant-actions";
import { Photo, ProfileNotice } from "../ui";
import { SigArrow, sigBtn, SigEyebrow } from "./ui";

type Tab = "Menu" | "About" | "Reviews";

/** Version B ordering screen: category index, menu rows and a persistent order panel (same cart logic as Version A). */
export function SigMenu({ restaurant: r, menu }: { restaurant: Restaurant; menu: MenuItem[] }) {
  const [tab, setTab] = useState<Tab>("Menu");
  const [drawer, setDrawer] = useState(false);
  const [pending, setPending] = useState<MenuItem | null>(null);
  const summary = useCart();
  const sections = useMemo(() => menuSections.filter((s) => menu.some((m) => m.section === s.name)), [menu]);
  const [active, setActive] = useState<MenuSection>(sections[0]?.name ?? "Signature Dishes");
  const mine = summary.restaurant?.slug === r.slug;
  const qtyOf = (id: string) => (mine ? (summary.cart.lines.find((l) => l.id === id)?.qty ?? 0) : 0);
  const other = summary.cart.restaurant && !mine ? getRestaurant(summary.cart.restaurant) : undefined;
  const closeDrawer = useCallback(() => setDrawer(false), []);

  const add = (m: MenuItem) => cart.add(r.slug, m.id) === "conflict" && setPending(m);
  const jump = (s: MenuSection) => {
    setActive(s);
    document.querySelector(`[data-menu-section="${s}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pb-28 lg:pb-12">
      {/* Banner: photo + info card */}
      <div className="container-x pt-4 lg:pt-8">
        <div className="grid-cols-1 grid overflow-hidden rounded-[2rem] bg-forest-deep text-white shadow-lift md:grid-cols-[1.3fr_1fr]">
          <div className="relative min-h-[13rem] md:min-h-[17rem]">
            <Photo name={r.cover} alt={r.name} sizes="(min-width: 768px) 55vw, 100vw" priority />
            <Link href={`/restaurants/${r.slug}`} aria-label={`Back to ${r.name}`} className="absolute top-4 left-4 grid grid-cols-1 size-10 place-items-center rounded-full bg-white text-forest-deep">
              <ArrowLeft className="size-5" />
            </Link>
          </div>
          <div className="relative isolate flex flex-col justify-center p-6 sm:p-8">
            <div className="absolute inset-0 -z-10 bg-native-pattern opacity-25 mix-blend-luminosity" aria-hidden />
            <SigEyebrow light>{r.type.replace(/ • /g, " · ")}</SigEyebrow>
            <h1 className="mt-2 text-4xl leading-none text-white sm:text-5xl">{r.name}</h1>
            <p className="mt-2 text-white/75">{r.tagline}</p>
            <p className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-forest-deep">
                {r.reviewCount ? (
                  <>
                    <Star className="size-3.5 fill-accent text-accent" /> {r.rating.toFixed(1)} ({r.reviewCount})
                  </>
                ) : (
                  "New on Native"
                )}
              </span>
              <span className="rounded-full border border-white/30 px-3 py-1">{locationLabel(r)}</span>
            </p>
          </div>
        </div>

        <ProfileNotice restaurant={r} className="mt-5" />

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
        <div className="container-x mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[13rem_1fr_21rem]">
          {/* Category index */}
          <nav aria-label="Menu categories" className="min-w-0 sticky top-0 z-20 -mx-4 bg-canvas/95 px-4 py-2 backdrop-blur lg:top-24 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0">
            <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
              {sections.map((s) => {
                const n = menu.filter((m) => m.section === s.name).length;
                return (
                  <li key={s.name} className="shrink-0">
                    <button
                      onClick={() => jump(s.name)}
                      aria-current={active === s.name}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors lg:rounded-xl",
                        active === s.name ? "bg-forest text-on-forest" : "bg-paper text-forest shadow-card hover:bg-mint lg:bg-transparent lg:shadow-none",
                      )}
                    >
                      {s.name} <span className="text-xs opacity-70">{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Menu rows */}
          <div className="min-w-0 space-y-10">
            {sections.map((s) => (
              <section key={s.name} data-menu-section={s.name} className="scroll-mt-20 lg:scroll-mt-28">
                <h2 className="text-2xl text-forest sm:text-3xl">{s.name}</h2>
                <p className="text-sm text-stone">{s.blurb}</p>
                <ul className="mt-4 grid grid-cols-1 gap-3">
                  {menu
                    .filter((m) => m.section === s.name)
                    .map((m) => {
                      const q = qtyOf(m.id);
                      return (
                        <li key={m.id} className={cn("flex items-center gap-4 rounded-2xl bg-paper p-3 shadow-card transition-shadow", q > 0 && "ring-2 ring-forest")}>
                          <div className="min-w-0 flex-1 pl-1">
                            <h3 className="text-base text-forest sm:text-lg">{m.name}</h3>
                            <p className="mt-0.5 line-clamp-2 text-xs text-stone sm:text-sm">{m.note}</p>
                            <div className="mt-2 flex items-center gap-3">
                              <span className="font-extrabold text-forest">{naira(m.price)}</span>
                              {q > 0 ? (
                                <QtyStepper qty={q} name={m.name} size="sm" onChange={(n) => cart.setQty(m.id, n)} />
                              ) : (
                                <button
                                  onClick={() => add(m)}
                                  aria-label={`Add ${m.name} to cart`}
                                  className="inline-flex h-8 items-center gap-1 rounded-full border-2 border-forest px-3 text-xs font-semibold text-forest transition-colors hover:bg-forest hover:text-on-forest"
                                >
                                  <Plus className="size-3.5" strokeWidth={3} /> Add
                                </button>
                              )}
                            </div>
                          </div>
                          <span className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
                            <Photo name={m.image} alt={m.name} sizes="112px" />
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </section>
            ))}
            <p className="text-xs text-stone">
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
        <div className="container-x mt-8 grid grid-cols-1 max-w-4xl gap-6 md:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-ink/85">{r.description}</p>
            <div className="mt-6">
              <RestaurantActions restaurant={r} />
            </div>
          </div>
          <div className="rounded-2xl bg-paper p-5 shadow-card">
            <HoursRow restaurant={r} />
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
      <CartConflictDialog
        pending={pending}
        currentName={other?.name}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) cart.replace(r.slug, pending.id);
          setPending(null);
        }}
      />
    </div>
  );
}
