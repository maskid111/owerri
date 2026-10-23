"use client";

import { useSyncExternalStore } from "react";

/** Tiny global toast queue (sign-in/out confirmations, gentle prompts). Rendered once by <Toaster />. */
export type Toast = {
  id: number;
  tone: "success" | "info" | "error";
  title: string;
  body?: string;
  action?: { label: string; href: string };
};

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: Toast[] = [];

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function toast(t: Omit<Toast, "id">, ms = 5000) {
  const id = nextId++;
  toasts = [...toasts.slice(-2), { ...t, id }];
  emit();
  window.setTimeout(() => dismissToast(id), ms);
  return id;
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
    () => EMPTY,
  );
}
