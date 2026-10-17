"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Clock, MapPin, Minus, Navigation, Plus, Star, Tag, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { ExploreItem } from "@/lib/data";
import { cn, distanceLabel, formatEventDate, naira } from "@/lib/utils";
import { SaveButton } from "./save-button";
import { Arrow, buttonClass, Photo } from "./ui";

export function mapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location}, Imo State, Nigeria`)}`;
}

function DateBadge({ iso, className }: { iso: string; className?: string }) {
  const d = formatEventDate(iso);
  return (
    <span className={cn("flex w-[3.6rem] flex-col items-center rounded-xl bg-paper py-1.5 leading-none text-forest shadow-card", className)}>
      <span className="text-[10px] font-bold tracking-wider uppercase">{d.weekday}</span>
      <span className="my-0.5 font-display text-[1.65rem] font-semibold">{d.day}</span>
      <span className="text-[10px] font-bold tracking-wider uppercase">{d.month}</span>
    </span>
  );
}

function ctaLabel(item: ExploreItem) {
  if (item.kind === "restaurant") return "View place";
  return item.ticketPrice ? "Get Tickets" : "Details";
}

/** Image-led discovery card from the Explore reference. */
export function ExploreCard({ item, className, priority, size = "md" }: { item: ExploreItem; className?: string; priority?: boolean; size?: "md" | "lg" }) {
  const [open, setOpen] = useState(false);
  const cta = buttonClass("primary", "sm", "px-4");

  return (
    <article className={cn("flex flex-col overflow-hidden rounded-[1.25rem] border border-line/70 bg-paper shadow-card", className)}>
      <div className={cn("relative overflow-hidden", size === "lg" ? "aspect-[16/9]" : "aspect-[16/10]")}>
        <Photo name={item.image} alt={item.title} sizes={size === "lg" ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"} priority={priority} />
        {item.date ? (
          <DateBadge iso={item.date} className="absolute bottom-3 left-3" />
        ) : (
          <span className="absolute top-3 left-3 rounded-md bg-forest px-2 py-1 text-[11px] font-bold text-on-forest">{item.label}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className={cn("leading-tight font-semibold text-forest", size === "lg" ? "text-2xl sm:text-[1.7rem]" : "text-xl")}>{item.title}</h3>
        <ul className="mt-2 space-y-1 text-sm text-ink/80">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-forest" aria-hidden />
            <span className="truncate">{item.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-forest" aria-hidden />
            <span className="truncate">{item.time}</span>
          </li>
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {item.href ? (
            <Link href={item.href} className={cta}>
              {ctaLabel(item)} <Arrow />
            </Link>
          ) : (
            <button type="button" onClick={() => setOpen(true)} className={cta}>
              {ctaLabel(item)} <Arrow />
            </button>
          )}
          <SaveButton slug={item.slug} name={item.title} />
        </div>
      </div>
      <ExploreDialog item={open ? item : null} onClose={() => setOpen(false)} />
    </article>
  );
}

/** Details sheet for events and places, with a mock ticket reservation flow. */
export function ExploreDialog({ item, onClose }: { item: ExploreItem | null; onClose: () => void }) {
  return <AnimatePresence>{item && <DialogBody key={item.slug} item={item} onClose={onClose} />}</AnimatePresence>;
}

function DialogBody({ item, onClose }: { item: ExploreItem; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState<"details" | "done">("details");
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const d = item.date ? formatEventDate(item.date) : null;

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button aria-label="Close" className="absolute inset-0 bg-forest-deep/55" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-canvas sm:rounded-[1.75rem]"
      >
        <div className="relative aspect-[16/9]">
          <Photo name={item.image} alt={item.title} sizes="512px" />
          <button onClick={onClose} aria-label="Close" className="absolute top-3 left-3 grid size-10 place-items-center rounded-full bg-paper text-forest shadow-card">
            <X className="size-5" />
          </button>
          <SaveButton slug={item.slug} name={item.title} variant="circle" className="absolute top-3 right-3" />
        </div>

        {step === "details" ? (
          <div className="p-5 sm:p-6">
            <span className="inline-block rounded-md bg-mint px-2 py-1 text-[11px] font-bold text-forest">{item.label}</span>
            <h2 id={titleId} className="mt-2 text-[1.7rem] leading-tight font-semibold text-forest">
              {item.title}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/85">
              {d && (
                <li className="flex items-center gap-2.5">
                  <Clock className="size-4 text-forest" /> {d.weekday} {d.day} {d.month} {d.year} · {item.time}
                </li>
              )}
              {!d && (
                <li className="flex items-center gap-2.5">
                  <Clock className="size-4 text-forest" /> {item.time}
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-forest" /> {item.location}
                {item.distanceKm !== undefined && <span className="text-stone">· {distanceLabel(item.distanceKm)}</span>}
              </li>
              <li className="flex items-center gap-2.5">
                <Tag className="size-4 text-forest" /> {item.price}
              </li>
              {item.rating !== undefined && (
                <li className="flex items-center gap-2.5">
                  <Star className="size-4 fill-star text-star" /> <span className="font-bold">{item.rating.toFixed(1)}</span>
                  <span className="text-stone">({item.reviewCount} reviews)</span>
                </li>
              )}
            </ul>
            <p className="mt-4 leading-relaxed text-ink/85">{item.description}</p>

            {item.ticketPrice ? (
              <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Tickets</p>
                    <p className="text-sm text-stone">{naira(item.ticketPrice)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      aria-label="Fewer tickets"
                      className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-40"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-5 text-center font-bold" aria-live="polite">
                      {qty}
                    </span>
                    <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="More tickets" className="grid size-9 place-items-center rounded-full bg-accent text-on-accent">
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <span className="text-sm text-stone">Total</span>
                  <span className="font-display text-xl font-semibold text-forest">{naira(item.ticketPrice * qty)}</span>
                </div>
                <button type="button" onClick={() => setStep("done")} className={buttonClass("primary", "lg", "mt-4 w-full")}>
                  Reserve {qty} {qty === 1 ? "ticket" : "tickets"} <Arrow />
                </button>
                <p className="mt-2 text-center text-xs text-stone">Demo booking — no payment is taken.</p>
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={mapsUrl(item.location)} target="_blank" rel="noreferrer" className={buttonClass("primary", "md")}>
                  <Navigation className="size-4" /> Get directions
                </a>
                <SaveButton slug={item.slug} name={item.title} withLabel />
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center">
            <CheckCircle2 className="mx-auto size-14 text-forest-light" strokeWidth={1.5} />
            <h2 id={titleId} className="mt-3 text-2xl font-semibold text-forest">
              Tickets reserved
            </h2>
            <p className="mt-2 text-stone">
              {qty} {qty === 1 ? "ticket" : "tickets"} for {item.title}
              {d ? ` on ${d.weekday} ${d.day} ${d.month}` : ""}. Show this confirmation at the gate. (Demo — nothing was charged.)
            </p>
            <button type="button" onClick={onClose} className={buttonClass("forest", "lg", "mt-6 w-full")}>
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
