"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, RotateCcw, ShoppingBag } from "lucide-react";
import { useId, useState } from "react";
import { cart, useCart, useOrders, type Order } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth/session";
import { withNext } from "@/lib/auth/validation";
import { getRestaurant } from "@/lib/data";
import { cn, naira } from "@/lib/utils";
import { CartLines, CartTotals, FulfilmentToggle } from "./cart-ui";
import { Arrow, ButtonLink, buttonClass, Photo } from "./ui";

/*
 * Frontend prototype: placing an order saves it in this browser only. Nothing is sent to the restaurant,
 * no payment is taken and no delivery is arranged — the copy below says so plainly.
 * When real ordering is connected, replace `cart.placeOrder` with the API call and show live statuses.
 */

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
          <p className="mt-1 text-stone">Your cart, checkout and past orders from local kitchens.</p>
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
  const { status } = useAuth();
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
        if (status !== "signedIn") return;
        if (summary.mode === "delivery" && address.trim().length < 6) {
          setError("Please add a delivery address in Owerri.");
          return;
        }
        setError("");
        const order = cart.placeOrder({ address: summary.mode === "delivery" ? address.trim() : "", note: note.trim() });
        if (order) onPlaced(order);
      }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start [&>*]:min-w-0"
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
        {status === "signedIn" ? (
          <button type="submit" className={buttonClass("primary", "lg", "w-full")}>
            Place order · {naira(summary.total)}
          </button>
        ) : (
          <div className="space-y-3 rounded-2xl bg-sand/70 p-4" aria-busy={status === "loading"}>
            <p className="text-sm font-semibold text-forest">Sign in to place your order</p>
            <p className="text-xs text-stone">Your cart is saved on this device — you’ll come straight back here.</p>
            <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
              <Link href={withNext("/sign-in", "/orders")} className={buttonClass("primary", "md", "w-full px-3")}>
                Sign in
              </Link>
              <Link href={withNext("/sign-up", "/orders")} className={buttonClass("outline", "md", "w-full px-3")}>
                Create account
              </Link>
            </div>
          </div>
        )}
        <p className="text-center text-xs leading-relaxed text-stone">
          Preview checkout — online ordering isn’t live yet. Your order is saved in this browser only: it is not sent to {r.name}, no payment is taken and no
          delivery is arranged.
        </p>
      </div>
    </form>
  );
}

function Confirmation({ order, onDone }: { order: Order; onDone: () => void }) {
  return (
    <div className="mx-auto max-w-lg rounded-[1.5rem] border border-line/70 bg-paper p-6 text-center shadow-card sm:p-8">
      <CheckCircle2 className="mx-auto size-14 text-forest-light" strokeWidth={1.5} />
      <h2 className="mt-3 text-3xl font-semibold text-forest">Order preview saved</h2>
      <p className="mt-2 text-stone">
        Reference <span className="font-semibold text-ink">{order.id}</span> · {order.mode === "delivery" ? "Delivery" : "Pickup"} from {order.restaurantName}
      </p>
      <ul className="mt-5 divide-y divide-line rounded-2xl border border-line text-left text-sm">
        {order.lines.map((l) => (
          <li key={l.id} className="flex justify-between gap-3 px-4 py-2.5">
            <span>
              {l.qty}× {l.name}
            </span>
            <span className="font-semibold">{naira(l.price * l.qty)}</span>
          </li>
        ))}
        {order.fee > 0 && (
          <li className="flex justify-between gap-3 px-4 py-2.5 text-stone">
            <span>Delivery fee (sample)</span>
            <span>{naira(order.fee)}</span>
          </li>
        )}
      </ul>
      <p className="mt-4 font-display text-2xl font-semibold text-forest">{naira(order.total)}</p>
      <p className="mt-4 rounded-2xl bg-sand/70 px-4 py-3 text-sm leading-relaxed text-ink/80">
        Online ordering isn’t live yet, so this order has <span className="font-semibold">not</span> been sent to {order.restaurantName} and no delivery has been arranged.
        It’s saved in this browser so you can review or reorder it later.
      </p>
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
  if (!orders.length) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-line px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-forest">
          <ClipboardList className="size-6" />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-forest">No orders yet</p>
        <p className="mt-1 text-stone">Orders you place in this preview will appear here.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {orders.map((o) => {
        const r = getRestaurant(o.restaurant);
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
                <span className="shrink-0 rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-bold text-forest">Preview · not sent</span>
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
