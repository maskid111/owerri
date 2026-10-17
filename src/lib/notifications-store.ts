"use client";

import { useMemo } from "react";
import { useOrders } from "./cart-store";
import { notices, type Notice } from "./data";
import { createPersistedStore } from "./persisted-store";

const NONE: string[] = [];
const readStore = createPersistedStore<string[]>("native:notifications-read", NONE, (v) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : NONE,
);

export type LiveNotice = Notice & { read: boolean };

/** Sample notices plus one update per placed (demo) order, newest first. */
export function useNotifications(): LiveNotice[] {
  const read = readStore.useValue();
  const orders = useOrders();
  return useMemo(() => {
    const fromOrders: Notice[] = orders.slice(0, 5).map((o) => ({
      id: `order-${o.id}`,
      title: `Order ${o.id} confirmed`,
      body: `${o.restaurantName} is preparing your ${o.mode === "delivery" ? "delivery" : "pickup"} order.`,
      when: "Recently",
      href: "/orders",
      kind: "offer",
    }));
    return [...fromOrders, ...notices].map((n) => ({ ...n, read: read.includes(n.id) }));
  }, [read, orders]);
}

export function useUnreadCount() {
  return useNotifications().filter((n) => !n.read).length;
}

export const notificationActions = {
  markRead(id: string) {
    const cur = readStore.get();
    if (!cur.includes(id)) readStore.set([...cur, id]);
  },
  markAllRead(ids: string[]) {
    readStore.set(Array.from(new Set([...readStore.get(), ...ids])));
  },
  reset() {
    readStore.set([]);
  },
};
