"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, RotateCcw, ShoppingBag } from "lucide-react";
import { useId, useState, useSyncExternalStore } from "react";
import { cart, useCart, useOrders, type Order } from "@/lib/cart-store";
import { getRestaurant } from "@/lib/data";
import { cn, naira } from "@/lib/utils";
import { CartLines, CartTotals, FulfilmentToggle } from "./cart-ui";
import { Arrow, ButtonLink, buttonClass, Photo } from "./ui";

/** Current minute (ms / 60000), refreshed every 30s. Null during SSR. */
function useMinuteClock() {
  return useSyncExternalStore<number | null>(
    (cb) => {
      const id = window.setInterval(cb, 30_000);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / 60_000),
    () => null,
  );
}

function orderStatus(order: Order, nowMinute: number | null) {
  if (nowMinute === null) return "Placed";
  const elapsed = nowMinute - Math.floor(Date.parse(order.placedAt) / 60_000);
  if (elapsed < 10) return "Preparing";
  if (elapsed < 40) return order.mode === "delivery" ? "On the way" : "Ready for pickup";
  return order.mode === "delivery" ? "Delivered" : "Collected";
}

/** `chrome={false}` drops the page title so another design version can supply its own header. */
export function OrdersView({ chrome = true }: { chrome?: boolean }) {
  const orders = useOrders();
  const [tab, setTab] = useState<"cart" | "history">("cart");
  const [placed, setPlaced] = useState<Order | null>(null);

  return (
    <div className="container-x pb-12">
      {chrome && (
        <div className="pt-5 lg:pt-10">
          <h1 className="text-[1.9rem] font-semibold text-forest sm:text-4xl lg:text-5xl">Orders</h1>
          <p className="mt-1 text-stone">Your cart, checkout and past orders from Owerri kitchens.</p>
        </div>
      )}

      <div role="tablist" className="mt-5 grid max-w-sm grid-cols-2 gap-1 rounded-full border border-line bg-paper p-1">
        {(
          [
            ["cart", "Cart"],
            ["history", `Past orders${orders.length ? ` (${orders.length})` : ""}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn("h-9 rounded-full text-sm font-semibold transition-colors", tab === key ? "bg-forest text-on-forest" : "text-ink/75 hover:text-forest")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "cart" &&
          (placed ? (
            <Confirmation
              order={placed}
              onDone={() => {
                setPlaced(null);
                setTab("history");
              }}
            />
          ) : (
            <Checkout
              onPlaced={(o) => {
                setPlaced(o);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ))}
        {tab === "history" && <History orders={orders} onReorder={() => setTab("cart")} />}
      </div>
    </div>
  );
}

function Checkout({ onPlaced }: { onPlaced: (o: Order) => void }) {
  const summary = useCart();
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const addressId = useId();
  const noteId = useId();

  if (!summary.restaurant || summary.count === 0) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-line px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-forest">
          <ShoppingBag className="size-6" />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-forest">Your cart is empty</p>
        <p className="mx-auto mt-1 max-w-sm text-stone">Browse local kitchens and tap the + on any dish to start an order.</p>
        <ButtonLink href="/restaurants" className="mt-6">
          Find something to eat <Arrow />
        </ButtonLink>
      </div>
    );
  }

  const r = summary.restaurant;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (summary.mode === "delivery" && address.trim().length < 6) {
          setError("Please add a delivery address in Owerri.");
          return;
        }
        setError("");
        const order = cart.placeOrder({ address: summary.mode === "delivery" ? address.trim() : "", note: note.trim() });
        if (order) onPlaced(order);
      }}
      className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start"
    >
      <div className="rounded-[1.25rem] border border-line/70 bg-paper p-4 shadow-card sm:p-6">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
            <Photo name={r.cover} alt={r.name} sizes="56px" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl font-semibold text-forest">{r.name}</p>
            <p className="text-sm text-stone">{r.type}</p>
          </div>
          <Link href={`/restaurants/${r.slug}/menu`} className="text-sm font-semibold text-forest underline underline-offset-4">
            Add more
          </Link>
        </div>
        <CartLines summary={summary} />
        {r.service === "Dine-in only" && <p className="mt-2 rounded-xl bg-tint px-3 py-2 text-sm text-forest">This venue is usually dine-in only — this demo still lets you place an order.</p>}
      </div>

      <div className="space-y-4 rounded-[1.25rem] border border-line/70 bg-paper p-4 shadow-card sm:p-6 lg:sticky lg:top-24">
        <FulfilmentToggle mode={summary.mode} />
        {summary.mode === "delivery" ? (
          <label htmlFor={addressId} className="block">
            <span className="mb-1.5 block text-sm font-semibold">Delivery address</span>
            <input
              id={addressId}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 12 Wetheral Road, Owerri"
              aria-invalid={Boolean(error)}
              className="h-11 w-full rounded-xl border border-line bg-canvas px-4 text-sm outline-none focus:border-forest"
            />
            {error && <span className="mt-1.5 block text-xs text-red-700">{error}</span>}
          </label>
        ) : (
          <p className="rounded-xl bg-mint px-3 py-2 text-sm text-forest">Pick up from {r.address}.</p>
        )}
        <label htmlFor={noteId} className="block">
          <span className="mb-1.5 block text-sm font-semibold">Note for the kitchen (optional)</span>
          <textarea
            id={noteId}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Extra pepper, no onions…"
            className="w-full resize-none rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none focus:border-forest"
          />
        </label>
        <CartTotals summary={summary} />
        <button type="submit" className={buttonClass("primary", "lg", "w-full")}>
          Place order · {naira(summary.total)}
        </button>
        <p className="text-center text-xs text-stone">Demo checkout — pay on {summary.mode === "delivery" ? "delivery" : "pickup"}. No payment is taken.</p>
      </div>
    </form>
  );
}

function Confirmation({ order, onDone }: { order: Order; onDone: () => void }) {
  const steps = order.mode === "delivery" ? ["Confirmed", "Preparing", "On the way", "Delivered"] : ["Confirmed", "Preparing", "Ready for pickup"];
  return (
    <div className="mx-auto max-w-lg rounded-[1.5rem] border border-line/70 bg-paper p-6 text-center shadow-card sm:p-8">
      <CheckCircle2 className="mx-auto size-14 text-forest-light" strokeWidth={1.5} />
      <h2 className="mt-3 text-3xl font-semibold text-forest">Order placed</h2>
      <p className="mt-2 text-stone">
        {order.restaurantName} has your order <span className="font-semibold text-ink">{order.id}</span>.{" "}
        {order.mode === "delivery" ? "Estimated delivery in 30–45 minutes." : "Ready for pickup in about 20 minutes."}
      </p>
      <ol className="mt-6 flex items-start justify-between gap-2 text-[11px] font-semibold text-stone">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
            <span className={cn("grid size-7 place-items-center rounded-full text-xs", i === 0 ? "bg-forest text-on-forest" : "bg-sand text-stone")}>{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <p className="mt-6 font-display text-2xl font-semibold text-forest">{naira(order.total)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button onClick={onDone} className={buttonClass("forest", "md")}>
          View past orders
        </button>
        <ButtonLink href="/restaurants" variant="outline">
          Order more
        </ButtonLink>
      </div>
    </div>
  );
}

function History({ orders, onReorder }: { orders: Order[]; onReorder: () => void }) {
  const now = useMinuteClock();
  if (!orders.length) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-line px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-forest">
          <ClipboardList className="size-6" />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-forest">No orders yet</p>
        <p className="mt-1 text-stone">Orders you place will appear here.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {orders.map((o) => {
        const r = getRestaurant(o.restaurant);
        const status = orderStatus(o, now);
        return (
          <li key={o.id} className="flex gap-4 rounded-[1.25rem] border border-line/70 bg-paper p-4 shadow-card">
            {r && (
              <span className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                <Photo name={r.image} alt={o.restaurantName} sizes="80px" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-display text-lg font-semibold text-forest">{o.restaurantName}</p>
                <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold", status === "Delivered" || status === "Collected" ? "bg-mint text-forest" : "bg-tint text-forest")}>
                  {status}
                </span>
              </div>
              <p className="text-xs text-stone">
                {o.id} · {new Date(o.placedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" })}
              </p>
              <p className="mt-1 line-clamp-1 text-sm text-ink/80">{o.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold">{naira(o.total)}</span>
                <button
                  onClick={() => {
                    cart.reorder(o);
                    onReorder();
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest underline underline-offset-4"
                >
                  <RotateCcw className="size-3.5" /> Reorder
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
