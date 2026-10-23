"use client";

import { useEffect } from "react";
import { createPersistedStore } from "./persisted-store";

/**
 * Which complete design system renders the site.
 *  a — Original UI (the existing Native design)
 *  b — Native Signature Experience (separate presentation components under components/sig)
 * Frontend-only prototype: stored in this browser's localStorage, not published to other visitors.
 */
export type DesignVersion = "a" | "b";
export const DESIGN_KEY = "native:design";

export const designVersions: { id: DesignVersion; name: string; tag: string; description: string }[] = [
  { id: "a", name: "Original UI", tag: "Version A", description: "Serif editorial headings, full-width food hero with square shortcut tiles, horizontal header with drawer navigation, photo cards." },
  {
    id: "b",
    name: "Native Signature Experience",
    tag: "Version B",
    description: "Bold sans headings, rounded hero card with a floating search pill, round shortcut bubbles, portrait restaurant cards and a floating dock.",
  },
];

const store = createPersistedStore<DesignVersion>(DESIGN_KEY, "a", (v) => (v === "b" ? "b" : "a"));

function apply(v: DesignVersion) {
  if (v === "b") document.documentElement.dataset.design = "b";
  else delete document.documentElement.dataset.design;
}

export function setDesignVersion(v: DesignVersion) {
  store.set(v);
  apply(v);
  window.scrollTo({ top: 0 });
}

export function useDesignVersion() {
  return store.useValue();
}

/**
 * Keeps <html data-design> in sync when another tab switches versions. The initial value is applied before
 * first paint by theme-script.ts; this deliberately does not re-apply on mount, because the hydration render
 * uses the server default and would briefly flip the page to Version A.
 */
export function DesignSync() {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== DESIGN_KEY && e.key !== null) return;
      let next: DesignVersion = "a";
      try {
        next = JSON.parse(e.newValue ?? "null") === "b" ? "b" : "a";
      } catch {
        /* keep default */
      }
      apply(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
