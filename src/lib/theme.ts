"use client";

import { useEffect } from "react";
import { createPersistedStore } from "./persisted-store";

export type SiteTheme = "light" | "forest";
export const THEME_KEY = "native:theme";

/**
 * Website background themes. Chosen ONLY in the admin prototype (/admin) — there is deliberately no public
 * toggle. Applies to both design versions. Stored in this browser (`native:theme`) and applied before first
 * paint by theme-script.ts; it is not yet a central setting shared with every visitor.
 */
export const themes: { id: SiteTheme; option: string; name: string; description: string }[] = [
  { id: "light", option: "Option 1", name: "Native Original", description: "The established Native look: white and warm-cream surfaces, forest-green type and accents." },
  { id: "forest", option: "Option 2", name: "Native Forest Dark", description: "A complete dark system: layered forest greens, warm cream text and cinematic food photography." },
];

export const themeLabel = (id: SiteTheme) => {
  const t = themes.find((x) => x.id === id)!;
  return `${t.option} — ${t.name}`;
};

const store = createPersistedStore<SiteTheme>(THEME_KEY, "light", (v) => (v === "forest" ? "forest" : "light"));

function apply(theme: SiteTheme) {
  if (theme === "forest") document.documentElement.dataset.theme = "forest";
  else delete document.documentElement.dataset.theme;
}

export function setSiteTheme(theme: SiteTheme) {
  store.set(theme);
  apply(theme);
}

export function useSiteTheme() {
  return store.useValue();
}

/**
 * Keeps <html data-theme> in sync when another tab changes the setting. The initial theme is applied before
 * first paint by theme-script.ts; re-applying on mount would use the hydration (server) default and flash
 * Option 1 for a moment, so this only reacts to storage changes.
 */
export function ThemeSync() {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_KEY && e.key !== null) return;
      let next: SiteTheme = "light";
      try {
        next = JSON.parse(e.newValue ?? "null") === "forest" ? "forest" : "light";
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
