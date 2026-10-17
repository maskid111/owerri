"use client";

import { useSyncExternalStore } from "react";

/** Minutes since midnight in Africa/Lagos (Owerri's time zone), re-evaluated every 30s. Null during SSR. */
function subscribeClock(cb: () => void) {
  const id = window.setInterval(cb, 30_000);
  return () => window.clearInterval(id);
}

function lagosMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

export function useLagosMinutes() {
  return useSyncExternalStore<number | null>(subscribeClock, lagosMinutes, () => null);
}
