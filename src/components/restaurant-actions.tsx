"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight, Navigation, Phone, Share } from "lucide-react";
import { useState } from "react";
import type { Restaurant } from "@/lib/data";
import { useLagosMinutes } from "@/lib/use-lagos-time";
import { cn, hoursLabel, isOpenAt } from "@/lib/utils";
import { mapsUrl } from "./explore-card";

/** Circular Call / Directions / Share actions from the restaurant detail reference. */
export function RestaurantActions({ restaurant: r, className }: { restaurant: Restaurant; className?: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: r.name, text: `${r.name} — ${r.tagline}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share sheet dismissed */
    }
  };

  const item = "flex flex-col items-center gap-2 text-sm font-medium text-ink";
  const circle = "grid size-14 place-items-center rounded-full bg-mint text-forest transition-colors group-hover:bg-forest group-hover:text-cream";

  return (
    <div className={cn("grid grid-cols-3", className)}>
      <a href={`tel:${r.phone}`} className={cn(item, "group")} aria-label={`Call ${r.name}`}>
        <span className={circle}>
          <Phone className="size-[22px]" />
        </span>
        Call
      </a>
      <a href={mapsUrl(r.address)} target="_blank" rel="noreferrer" className={cn(item, "group")} aria-label={`Directions to ${r.name}`}>
        <span className={circle}>
          <Navigation className="size-[22px]" />
        </span>
        Directions
      </a>
      <button type="button" onClick={share} className={cn(item, "group")} aria-label={`Share ${r.name}`}>
        <span className={circle}>{copied ? <Check className="size-[22px]" /> : <Share className="size-[22px]" />}</span>
        <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
      </button>
    </div>
  );
}

/** "Open now · 7:00 AM – 11:00 PM ›" row that expands into full visit details. */
export function HoursRow({ restaurant: r }: { restaurant: Restaurant }) {
  const minutes = useLagosMinutes();
  const [open, setOpen] = useState(false);
  const status = minutes === null ? "Opening hours" : isOpenAt(r.open, r.close, minutes) ? "Open now" : "Closed now";

  return (
    <div className="border-y border-line">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 py-4 text-left">
        <span>
          <span className={cn("block font-bold", status === "Closed now" ? "text-stone" : "text-forest")}>{status}</span>
          <span className="mt-0.5 block text-sm text-ink/80">{hoursLabel(r.open, r.close)}</span>
        </span>
        <ChevronRight className={cn("size-5 text-stone transition-transform", open && "rotate-90")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.dl initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-sm">
            <div className="grid grid-cols-[6rem_1fr] gap-y-2 pb-4">
              <dt className="text-stone">Days</dt>
              <dd className="font-semibold">{r.days}</dd>
              <dt className="text-stone">Address</dt>
              <dd className="font-semibold">{r.address}</dd>
              <dt className="text-stone">Phone</dt>
              <dd className="font-semibold">
                <a href={`tel:${r.phone}`} className="underline underline-offset-4">
                  {r.phone.replace(/^\+234(\d{3})(\d{3})(\d{4})$/, "+234 $1 $2 $3")}
                </a>{" "}
                <span className="font-normal text-stone">(sample)</span>
              </dd>
              <dt className="text-stone">Service</dt>
              <dd className="font-semibold">{r.service}</dd>
            </div>
          </motion.dl>
        )}
      </AnimatePresence>
    </div>
  );
}
