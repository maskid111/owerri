"use client";

import { useCallback } from "react";
import { createPersistedStore } from "./persisted-store";

const EMPTY: string[] = [];

/** Saved slugs — restaurants, places and events share one list (slugs are unique across them). */
const store = createPersistedStore<string[]>("owerri:saved", EMPTY, (v) =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : EMPTY,
);

export function useSaved() {
  const saved = store.useValue();

  const toggle = useCallback((slug: string) => {
    const current = store.get();
    store.set(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  }, []);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return { saved, toggle, isSaved };
}
