"use client";

import { useEffect } from "react";
import { createPersistedStore } from "./persisted-store";

export type SiteTheme = "light" | "forest";
export const THEME_KEY = "native:theme";

export const themes: { id: SiteTheme; name: string; description: string }[] = [
  { id: "light", name: "Native Light", description: "White and warm-cream surfaces, forest-green accents and generous whitespace." },
  { id: "forest", name: "Native Forest", description: "Deep forest-green surfaces, cinematic photography and light text." },
];

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

/** Keeps <html data-theme> in sync with storage (e.g. when another tab changes the setting). */
export function ThemeSync() {
  const theme = useSiteTheme();
  useEffect(() => apply(theme), [theme]);
  return null;
}
