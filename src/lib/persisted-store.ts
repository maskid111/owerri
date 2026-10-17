"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store shared across tabs, read through useSyncExternalStore.
 * The server snapshot is always `fallback`, so markup never depends on storage during prerendering.
 */
export function createPersistedStore<T>(key: string, fallback: T, validate: (value: unknown) => T) {
  const listeners = new Set<() => void>();
  let cache: T | null = null;

  function get(): T {
    if (cache !== null) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? validate(JSON.parse(raw)) : fallback;
    } catch {
      cache = fallback;
    }
    return cache;
  }

  function set(next: T) {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* storage unavailable: keep in memory */
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        cache = null;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue() {
    return useSyncExternalStore(subscribe, get, () => fallback);
  }

  return { get, set, useValue };
}
