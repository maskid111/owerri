"use client";

import { useEffect } from "react";
import { createPersistedStore } from "./persisted-store";

/**
 * Which complete design system renders the site.
 *  a — Original UI (the existing Native design, with its Light / Forest palettes)
 *  b — Native Signature Experience (separate presentation components under components/sig)
 * Frontend-only prototype: stored in this browser's localStorage, not published to other visitors.
 */
export type DesignVersion = "a" | "b";
export const DESIGN_KEY = "native:design";

export const designVersions: { id: DesignVersion; name: string; tag: string; description: string }[] = [
  { id: "a", name: "Original UI", tag: "Version A", description: "Serif editorial headings, left-aligned video hero, horizontal header with drawer navigation, photo cards with white bodies." },
  {
    id: "b",
    name: "Native Signature Experience",
    tag: "Version B",
    description: "Bold sans headings, centred video hero with one search pill, icon rail and all-sections dock, caption-bar cards and ticket-style events.",
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

/** Keeps <html data-design> in sync with storage (e.g. another tab switched versions). */
export function DesignSync() {
  const v = useDesignVersion();
  useEffect(() => apply(v), [v]);
  return null;
}
