"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Bike, Minus, Plus, ShoppingBag, Store, Trash2, X } from "lucide-react";
import { useEffect, useId } from "react";
import { cart, useCart, type CartSummary } from "@/lib/cart-store";
import { cn, naira } from "@/lib/utils";
import { Arrow, buttonClass, Photo } from "./ui";

export function QtyStepper({ qty, name, onChange, size = "md", className }: { qty: number; name: string; onChange: (qty: number) => void; size?: "sm" | "md"; className?: string }) {
  const btn = cn("grid place-items-center rounded-full transition-colors", size === "sm" ? "size-7" : "size-9");
  return (
    <div className={cn("inline-flex items-center rounded-full bg-sun text-forest-deep", className)}>
      <button type="button" onClick={() => onChange(qty - 1)} aria-label={qty === 1 ? `Remove ${name}` : `One less ${name}`} className={cn(btn, "hover:bg-sun-deep")}>
        {qty === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
      </button>
      <span className={cn("min-w-5 text-center font-bold", size === "sm" ? "text-xs" : "text-sm")} aria-live="polite">
        {qty}
      </span>
      <button type="button" onClick={() => onChange(qty + 1)} aria-label={`One more ${name}`} className={cn(btn, "hover:bg-sun-deep")}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function FulfilmentToggle({ mode }: { mode: CartSummary["mode"] }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-paper p-1" role="radiogroup" aria-label="Delivery or pickup">
      {(
        [
          ["delivery", "Delivery", Bike],
          ["pickup", "Pickup", Store],
        ] as const
      ).map(([value, label, Icon]) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          onClick={() => cart.setMode(value)}
          className={cn("inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-colors", mode === value ? "bg-forest text-cream" : "text-ink/70 hover:text-forest")}
        >
          <Icon className="size-4" /> {label}
        </button>
      ))}
    </div>
  );
}

export function CartLines({ summary }: { summary: CartSummary }) {
  return (
    <ul className="divide-y divide-line">
      {summary.lines.map(({ item, qty }) => (
        <li key={item.id} className="flex items-center gap-3 py-3">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
            <Photo name={item.image} alt={item.name} sizes="56px" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{item.name}</span>
            <span className="text-sm text-stone">{naira(item.price)}</span>
          </span>
          <span className="flex flex-col items-end gap-1">
            <QtyStepper qty={qty} name={item.name} size="sm" onChange={(q) => cart.setQty(item.id, q)} />
            <span className="text-sm font-bold">{naira(item.price * qty)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CartTotals({ summary }: { summary: CartSummary }) {
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-stone">Subtotal</dt>
        <dd className="font-semibold">{naira(summary.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-stone">{summary.mode === "delivery" ? "Delivery fee" : "Pickup"}</dt>
        <dd className="font-semibold">{summary.fee ? naira(summary.fee) : "Free"}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-2 text-base">
        <dt className="font-bold">Total</dt>
        <dd className="font-display text-xl font-semibold text-forest">{naira(summary.total)}</dd>
      </div>
    </dl>
  );
}

/** Drawer with the live cart: quantities, fulfilment and totals. */
export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const summary = useCart();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-end justify-end sm:items-stretch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close cart" className="absolute inset-0 bg-forest-deep/55" onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pb-safe relative flex max-h-[88dvh] w-full flex-col rounded-t-[1.75rem] bg-cream sm:max-h-none sm:max-w-md sm:rounded-none sm:rounded-l-[1.75rem]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 pt-5 pb-4">
              <div>
                <h2 id={titleId} className="text-2xl font-semibold text-forest">
                  Your order
                </h2>
                {summary.restaurant && <p className="text-sm text-stone">from {summary.restaurant.name}</p>}
              </div>
              <button onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full hover:bg-forest/5">
                <X className="size-5" />
              </button>
            </div>

            {summary.count === 0 ? (
              <div className="px-5 py-14 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-forest">
                  <ShoppingBag className="size-6" />
                </span>
                <p className="mt-4 font-display text-xl font-semibold text-forest">Your cart is empty</p>
                <p className="mt-1 text-sm text-stone">Tap the + on any dish to add it here.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5">
                  <CartLines summary={summary} />
                  <button onClick={() => cart.clear()} className="mb-4 text-sm font-semibold text-stone underline underline-offset-4 hover:text-forest">
                    Clear cart
                  </button>
                </div>
                <div className="space-y-4 border-t border-line px-5 pt-4 pb-5">
                  <FulfilmentToggle mode={summary.mode} />
                  <CartTotals summary={summary} />
                  <Link href="/orders" onClick={onClose} className={buttonClass("primary", "lg", "w-full")}>
                    Go to checkout <Arrow />
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Asks before replacing a cart that holds items from a different restaurant. */
export function CartConflictDialog({
  pending,
  currentName,
  onCancel,
  onConfirm,
}: {
  pending: { name: string } | null;
  currentName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  return (
    <AnimatePresence>
      {pending && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Cancel" className="absolute inset-0 bg-forest-deep/55" onClick={onCancel} />
          <motion.div role="alertdialog" aria-modal="true" aria-labelledby={titleId} initial={{ y: 20 }} animate={{ y: 0 }} className="relative w-full max-w-sm rounded-[1.5rem] bg-cream p-6">
            <h2 id={titleId} className="text-2xl font-semibold text-forest">
              Start a new order?
            </h2>
            <p className="mt-2 text-sm text-stone">
              Your cart has items from {currentName ?? "another restaurant"}. Clear it and add {pending.name} instead?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={onCancel} className={buttonClass("outline", "md")}>
                Keep cart
              </button>
              <button onClick={onConfirm} className={buttonClass("primary", "md")}>
                New order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
