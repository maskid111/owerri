"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarDays, CheckCircle2, Clock, MapPin, Minus, Navigation, Plus, Star, Tag, Ticket, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { ExploreItem } from "@/lib/data";
import { cn, distanceLabel, formatEventDate, naira } from "@/lib/utils";
import { mapsUrl } from "../explore-card";
import { SaveButton } from "../save-button";
import { Photo } from "../ui";
import { SigArrow, sigBtn, SigTileBody, sigTileClass } from "./ui";

type Variant = "tile" | "row" | "ticket";

/** One discovery item in Version B. Items with an `href` navigate; the rest open the Signature detail panel. */
export function SigExploreItem({ item, variant = "tile", className, aspect }: { item: ExploreItem; variant?: Variant; className?: string; aspect?: string }) {
  const [open, setOpen] = useState(false);
  const body =
    variant === "tile" ? (
      <SigTileBody
        title={item.title}
        subtitle={item.date ? `${formatEventDate(item.date).weekday} ${formatEventDate(item.date).day} ${formatEventDate(item.date).month} · ${item.location}` : item.location}
        image={item.image}
        badge={item.label}
        aspect={aspect}
      />
    ) : variant === "row" ? (
      <RowBody item={item} />
    ) : (
      <TicketBody item={item} />
    );
  const cls = cn(
    "min-w-0",
    variant === "tile" && sigTileClass,
    variant === "row" && "group flex w-full items-center gap-4 rounded-2xl bg-paper p-3 text-left shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
    variant === "ticket" && "group flex w-full overflow-hidden rounded-2xl bg-paper text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
    className,
  );
  return (
    <>
      {item.href ? (
        <Link href={item.href} className={cls}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={cls} aria-haspopup="dialog">
          {body}
        </button>
      )}
      <SigDetailSheet item={open ? item : null} onClose={() => setOpen(false)} />
    </>
  );
}

function RowBody({ item }: { item: ExploreItem }) {
  return (
    <>
      <span className="grid-cols-1 grid w-16 shrink-0 place-items-center self-stretch rounded-xl bg-mint text-center text-forest">
        <span>
          <span className="block text-lg leading-none font-extrabold">{item.distanceKm !== undefined ? distanceLabel(item.distanceKm).split(" ")[0] : "—"}</span>
          <span className="text-xs font-semibold">km</span>
        </span>
      </span>
      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-20">
        <Photo name={item.image} alt={item.title} sizes="80px" className="transition-transform duration-500 group-hover:scale-110" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-xs font-semibold text-forest-light">{item.label}</span>
        <span className="block truncate font-bold text-forest">{item.title}</span>
        <span className="block truncate text-xs text-stone">{item.time}</span>
      </span>
      <ArrowRight className="size-5 shrink-0 text-forest transition-transform group-hover:translate-x-1" />
    </>
  );
}

function TicketBody({ item }: { item: ExploreItem }) {
  const d = item.date ? formatEventDate(item.date) : null;
  return (
    <>
      <span className="relative flex w-[4.5rem] shrink-0 flex-col items-center justify-center bg-forest py-4 text-on-forest sm:w-20">
        {d ? (
          <>
            <span className="text-xs font-semibold opacity-80">{d.weekday}</span>
            <span className="my-0.5 text-3xl leading-none font-extrabold">{d.day}</span>
            <span className="text-xs font-semibold opacity-80">{d.month}</span>
          </>
        ) : (
          <>
            <Star className="size-5" />
            <span className="mt-1 text-sm font-extrabold">{item.rating?.toFixed(1)}</span>
          </>
        )}
        {/* perforation */}
        <span className="absolute inset-y-2 -right-px border-r-2 border-dashed border-canvas" aria-hidden />
      </span>
      <span className="relative hidden w-32 shrink-0 overflow-hidden sm:block">
        <Photo name={item.image} alt={item.title} sizes="128px" className="transition-transform duration-500 group-hover:scale-110" />
      </span>
      <span className="min-w-0 flex-1 p-4">
        <span className="text-xs font-semibold text-forest-light">{item.label}</span>
        <span className="block text-lg leading-tight font-bold text-forest">{item.title}</span>
        <span className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-stone">
          <MapPin className="size-3.5 shrink-0" /> {item.location}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-stone">
          <Clock className="size-3.5 shrink-0" /> {item.time}
        </span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-forest">
          {item.ticketPrice ? (
            <>
              <Ticket className="size-4" /> Tickets · {naira(item.ticketPrice)}
            </>
          ) : (
            <>
              Details <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
      </span>
    </>
  );
}

/** Version B detail panel: slides in from the right on desktop, up from the bottom on mobile. */
export function SigDetailSheet({ item, onClose }: { item: ExploreItem | null; onClose: () => void }) {
  return <AnimatePresence>{item && <Sheet key={item.slug} item={item} onClose={onClose} />}</AnimatePresence>;
}

function Sheet({ item, onClose }: { item: ExploreItem; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const titleId = useId();
  const d = item.date ? formatEventDate(item.date) : null;

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

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-end sm:items-stretch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button aria-label="Close" className="absolute inset-0 bg-forest-deep/60 backdrop-blur-[2px]" onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-y-auto rounded-t-[2rem] bg-canvas text-left sm:max-h-none sm:max-w-md sm:rounded-none"
      >
        <div className="relative aspect-[4/3.4] shrink-0">
          <Photo name={item.image} alt={item.title} sizes="448px" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-forest-deep/30" />
          <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 grid grid-cols-1 size-10 place-items-center rounded-full bg-white text-forest-deep">
            <X className="size-5" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-forest-deep">{item.label}</span>
            <h2 id={titleId} className="mt-3 text-3xl leading-tight text-white">
              {item.title}
            </h2>
          </div>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="mx-auto size-14 text-forest-light" strokeWidth={1.5} />
            <p className="mt-3 text-2xl font-extrabold text-forest">You’re going!</p>
            <p className="mt-2 text-stone">
              {qty} {qty === 1 ? "ticket" : "tickets"} reserved for {item.title}
              {d ? ` on ${d.weekday} ${d.day} ${d.month}` : ""}. Demo booking — nothing was charged.
            </p>
            <button onClick={onClose} className={sigBtn("solid", "mt-6 w-full")}>
              Done
            </button>
          </div>
        ) : (
          <div className="flex-1 p-5 sm:p-6">
            <dl className="grid grid-cols-2 gap-2.5 text-sm">
              {[
                d && { icon: CalendarDays, k: "Date", v: `${d.weekday} ${d.day} ${d.month}` },
                { icon: Clock, k: "When", v: item.time },
                { icon: MapPin, k: "Where", v: item.location + (item.distanceKm !== undefined ? ` · ${distanceLabel(item.distanceKm)}` : "") },
                { icon: Tag, k: "Price", v: item.price },
                item.rating !== undefined && { icon: Star, k: "Rating", v: `${item.rating.toFixed(1)} (${item.reviewCount})` },
              ]
                .filter((x): x is { icon: typeof Clock; k: string; v: string } => Boolean(x))
                .map(({ icon: Icon, k, v }) => (
                  <div key={k} className="rounded-2xl bg-paper p-3 shadow-card">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold text-forest-light">
                      <Icon className="size-3.5" /> {k}
                    </dt>
                    <dd className="mt-1 font-semibold text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
            <p className="mt-5 leading-relaxed text-ink/85">{item.description}</p>

            {item.ticketPrice ? (
              <div className="mt-6 rounded-2xl bg-forest p-4 text-on-forest">
                <div className="flex items-center justify-between">
                  <span>
                    <span className="block text-xs font-semibold opacity-75">Tickets</span>
                    <span className="font-bold">{naira(item.ticketPrice)} each</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Fewer tickets" className="grid-cols-1 grid size-9 place-items-center rounded-full border border-current/40 disabled:opacity-40">
                      <Minus className="size-4" />
                    </button>
                    <span className="w-5 text-center text-lg font-extrabold" aria-live="polite">
                      {qty}
                    </span>
                    <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="More tickets" className="grid-cols-1 grid size-9 place-items-center rounded-full bg-white text-forest-deep">
                      <Plus className="size-4" />
                    </button>
                  </span>
                </div>
                <button onClick={() => setDone(true)} className="group mt-4 flex h-12 w-full items-center justify-between rounded-full bg-white px-5 text-sm font-semibold text-forest-deep">
                  Reserve {qty} · {naira(item.ticketPrice * qty)} <SigArrow />
                </button>
                <p className="mt-2 text-center text-xs opacity-75">Demo booking — no payment is taken.</p>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={mapsUrl(item.location)} target="_blank" rel="noreferrer" className={sigBtn("solid")}>
                  <Navigation className="size-4" /> Directions
                </a>
              </div>
            )}
            <div className="mt-4">
              <SaveButton slug={item.slug} name={item.title} withLabel />
            </div>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}
