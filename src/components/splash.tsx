"use client";

import { useEffect } from "react";
import { Wordmark } from "./brand";

/**
 * App-like opening screen: white, the Native wordmark and tagline, then a soft fade into the page.
 * CSS drives the animation (globals.css); this timer is a failsafe so the overlay is always removed,
 * even if animations are paused. It never intercepts pointer events.
 */
export function Splash() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.splash) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => delete root.dataset.splash, reduce ? 800 : 2500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="native-splash" aria-hidden="true">
      <div className="native-splash-inner">
        <Wordmark size="xl" align="center" />
      </div>
    </div>
  );
}
