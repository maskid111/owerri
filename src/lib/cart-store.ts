"use client";

import { getMenu, getRestaurant, type MenuItem, type Restaurant } from "./data";
import { createPersistedStore } from "./persisted-store";

export type Fulfilment = "delivery" | "pickup";
export type CartLine = { id: string; qty: number };
export type Cart = { restaurant: string | null; lines: CartLine[]; mode: Fulfilment };

export type OrderLine = { id: string; name: string; price: number; qty: number };
export type Order = {
  id: string;
  restaurant: string;
  restaurantName: string;
  lines: OrderLine[];
  subtotal: number;
  fee: number;
  total: number;
  mode: Fulfilment;
  address: string;
  note: string;
  placedAt: string; // ISO timestamp
};

export const DELIVERY_FEE = 800;

const EMPTY_CART: Cart = { restaurant: null, lines: [], mode: "delivery" };
const NO_ORDERS: Order[] = [];

const cartStore = createPersistedStore<Cart>("owerri:cart", EMPTY_CART, (v) => {
  const c = v as Partial<Cart> | null;
  if (!c || !Array.isArray(c.lines)) return EMPTY_CART;
  return {
    restaurant: typeof c.restaurant === "string" ? c.restaurant : null,
    lines: c.lines.filter((l): l is CartLine => typeof l?.id === "string" && typeof l?.qty === "number" && l.qty > 0),
    mode: c.mode === "pickup" ? "pickup" : "delivery",
  };
});

const orderStore = createPersistedStore<Order[]>("owerri:orders", NO_ORDERS, (v) => (Array.isArray(v) ? (v as Order[]) : NO_ORDERS));

function commit(next: Cart) {
  cartStore.set(next.lines.length ? next : { ...EMPTY_CART, mode: next.mode });
}

export const cart = {
  /** Adds one of `id`. Returns "conflict" when the cart already holds items from another restaurant. */
  add(restaurant: string, id: string): "ok" | "conflict" {
    const c = cartStore.get();
    if (c.restaurant && c.restaurant !== restaurant && c.lines.length) return "conflict";
    const existing = c.lines.find((l) => l.id === id);
    const lines = existing ? c.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...c.lines, { id, qty: 1 }];
    commit({ ...c, restaurant, lines });
    return "ok";
  },
  /** Empties the cart and starts a new one at `restaurant` with a single `id`. */
  replace(restaurant: string, id: string) {
    commit({ ...cartStore.get(), restaurant, lines: [{ id, qty: 1 }] });
  },
  setQty(id: string, qty: number) {
    const c = cartStore.get();
    commit({ ...c, lines: qty <= 0 ? c.lines.filter((l) => l.id !== id) : c.lines.map((l) => (l.id === id ? { ...l, qty } : l)) });
  },
  setMode(mode: Fulfilment) {
    cartStore.set({ ...cartStore.get(), mode });
  },
  clear() {
    commit({ ...cartStore.get(), lines: [] });
  },
  placeOrder(details: { address: string; note: string }): Order | null {
    const c = cartStore.get();
    const summary = summarise(c);
    if (!summary.restaurant || !summary.lines.length) return null;
    const placedAt = new Date().toISOString();
    const order: Order = {
      id: `OW-${placedAt.slice(2, 10).replace(/-/g, "")}-${String(orderStore.get().length + 1).padStart(3, "0")}`,
      restaurant: summary.restaurant.slug,
      restaurantName: summary.restaurant.name,
      lines: summary.lines.map(({ item, qty }) => ({ id: item.id, name: item.name, price: item.price, qty })),
      subtotal: summary.subtotal,
      fee: summary.fee,
      total: summary.total,
      mode: c.mode,
      address: details.address,
      note: details.note,
      placedAt,
    };
    orderStore.set([order, ...orderStore.get()]);
    commit({ ...c, lines: [] });
    return order;
  },
  clearHistory() {
    orderStore.set([]);
  },
  reorder(order: Order) {
    commit({ restaurant: order.restaurant, mode: order.mode, lines: order.lines.map((l) => ({ id: l.id, qty: l.qty })) });
  },
};

export type CartSummary = {
  restaurant: Restaurant | undefined;
  lines: { item: MenuItem; qty: number }[];
  count: number;
  subtotal: number;
  fee: number;
  total: number;
  mode: Fulfilment;
};

/** Resolves cart lines against the restaurant's menu so prices always come from the central data. */
export function summarise(c: Cart): CartSummary {
  const restaurant = c.restaurant ? getRestaurant(c.restaurant) : undefined;
  const menu = restaurant ? getMenu(restaurant) : [];
  const lines = c.lines
    .map((l) => ({ item: menu.find((m) => m.id === l.id), qty: l.qty }))
    .filter((l): l is { item: MenuItem; qty: number } => Boolean(l.item));
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const fee = c.mode === "delivery" && lines.length ? DELIVERY_FEE : 0;
  return { restaurant, lines, count: lines.reduce((n, l) => n + l.qty, 0), subtotal, fee, total: subtotal + fee, mode: c.mode };
}

export function useCart() {
  const c = cartStore.useValue();
  return { cart: c, ...summarise(c) };
}

export function useOrders() {
  return orderStore.useValue();
}
