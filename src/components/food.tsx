"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { naira } from "@/lib/utils";

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
