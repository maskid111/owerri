"use client";

import Link from "next/link";
import { ArrowRight, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { cart, useCart } from "@/lib/cart-store";
import type { MenuItem, Restaurant } from "@/lib/data";
import { cn, naira } from "@/lib/utils";
import { CartConflictDialog, QtyStepper } from "./cart-ui";
import { Photo } from "./ui";

/**
 * Add-to-cart helpers shared by restaurant pages and dish cards in both design versions. Adding a dish from a
 * different restaurant asks first (the cart holds one restaurant at a time) — render `conflict` once.
 */
export function useOrdering() {
  const summary = useCart();
  const [pending, setPending] = useState<{ slug: string; item: MenuItem } | null>(null);
  const qtyOf = (slug: string, id: string) => (summary.cart.restaurant === slug ? (summary.cart.lines.find((l) => l.id === id)?.qty ?? 0) : 0);
  const add = (slug: string, item: MenuItem) => {
    if (cart.add(slug, item.id) === "conflict") setPending({ slug, item });
  };
  const conflict = (
    <CartConflictDialog
      pending={pending?.item ?? null}
      currentName={summary.restaurant?.name}
      onCancel={() => setPending(null)}
      onConfirm={() => {
        if (pending) cart.replace(pending.slug, pending.item.id);
        setPending(null);
      }}
    />
  );
  return { summary, qtyOf, add, setQty: cart.setQty, conflict };
}

/** "+ Add" pill that turns into a quantity stepper once the dish is in the cart. */
export function AddToCart({
  qty,
  name,
  onAdd,
  onQty,
  tone = "warm",
  className,
}: {
  qty: number;
  name: string;
  onAdd: () => void;
  onQty: (q: number) => void;
  tone?: "warm" | "outline";
  className?: string;
}) {
  if (qty > 0) return <QtyStepper qty={qty} name={name} size="sm" onChange={onQty} className={className} />;
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Add ${name} to cart`}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-3.5 text-xs font-semibold transition-colors",
        tone === "warm" ? "bg-spark text-forest-deep hover:bg-[#f5b33a]" : "border-2 border-forest text-forest hover:bg-forest hover:text-on-forest",
        className,
      )}
    >
      <Plus className="size-3.5" strokeWidth={3} /> Add
    </button>
  );
}

/** Popular dishes with prices and add-to-cart, straight from the homepage. Version A: dark cards; B: light cards. */
export function PopularDishes({ dishes, variant }: { dishes: { restaurant: Restaurant; item: MenuItem }[]; variant: "a" | "b" }) {
  const { qtyOf, add, setQty, conflict } = useOrdering();
  return (
    <>
      <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {dishes.map(({ restaurant: r, item: m }) => {
          const qty = qtyOf(r.slug, m.id);
          const href = `/restaurants/${r.slug}`;
          return variant === "a" ? (
            <li key={`${r.slug}-${m.id}`} className="w-[64%] shrink-0 snap-start overflow-hidden rounded-2xl bg-forest-deep text-white shadow-card sm:w-auto">
              <Link href={href} className="group relative block aspect-[4/3] overflow-hidden">
                <Photo name={m.image} alt={m.name} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 64vw" className="transition-transform duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-deep to-transparent" aria-hidden />
              </Link>
              <div className="px-3.5 pt-1 pb-3.5">
                <Link href={href} className="block truncate font-semibold hover:underline">
                  {m.name}
                </Link>
                <p className="truncate text-xs text-white/65">{r.name}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-semibold">{naira(m.price)}</span>
                  <AddToCart qty={qty} name={m.name} onAdd={() => add(r.slug, m)} onQty={(q) => setQty(m.id, q)} />
                </div>
              </div>
            </li>
          ) : (
            <li key={`${r.slug}-${m.id}`} className="w-[64%] shrink-0 snap-start rounded-[1.4rem] bg-paper p-2 shadow-card sm:w-auto">
              <Link href={href} className="group relative block aspect-square overflow-hidden rounded-[1.1rem]">
                <Photo name={m.image} alt={m.name} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 64vw" className="transition-transform duration-500 group-hover:scale-[1.04]" />
              </Link>
              <div className="px-1.5 pt-3 pb-1.5">
                <Link href={href} className="block truncate font-bold text-forest hover:underline">
                  {m.name}
                </Link>
                <p className="truncate text-xs text-stone">{r.name}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-extrabold text-forest">{naira(m.price)}</span>
                  <AddToCart qty={qty} name={m.name} onAdd={() => add(r.slug, m)} onQty={(q) => setQty(m.id, q)} tone="outline" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {conflict}
    </>
  );
}

/** Floating cart indicator for food listing pages: item count, subtotal and a clear checkout action. */
export function FloatingCartBar() {
  const s = useCart();
  if (!s.count || !s.restaurant) return null;
  return (
    <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 px-3 lg:bottom-6">
      <Link
        href="/orders"
        className="group mx-auto flex h-14 max-w-lg items-center gap-3 rounded-full bg-forest-deep pr-2 pl-5 text-white shadow-lift ring-1 ring-white/10"
        aria-label={`Checkout: ${s.count} ${s.count === 1 ? "item" : "items"} from ${s.restaurant.name}, ${naira(s.subtotal)}`}
      >
        <ShoppingBag className="size-5 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold">
            {s.count} {s.count === 1 ? "item" : "items"}
          </span>
          <span className="text-white/70"> · {s.restaurant.name}</span>
        </span>
        <span className="text-sm font-semibold">{naira(s.subtotal)}</span>
        <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-forest-deep">
          Checkout <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
}
