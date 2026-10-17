"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, BookOpen, CalendarDays, Compass, CornerDownLeft, MapPin, Search, Soup, Store, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { areaName, dishes, events, neighbourhoods, places, restaurants, stories } from "@/lib/data";
import { cn } from "@/lib/utils";

export const OPEN_SEARCH_EVENT = "owerri:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

type Result = { href: string; title: string; meta: string; group: string; icon: ReactNode };

const all: Result[] = [
  ...restaurants.map((r) => ({
    href: `/restaurants/${r.slug}`,
    title: r.name,
    meta: `${r.type} · ${areaName(r.area)}`,
    group: "Places to eat",
    icon: <Store className="size-4" />,
  })),
  ...events.map((e) => ({
    href: `/explore?item=${e.slug}`,
    title: e.title,
    meta: `${e.venue} · ${e.time}`,
    group: "Events",
    icon: <CalendarDays className="size-4" />,
  })),
  ...places.map((p) => ({
    href: `/explore?item=${p.slug}`,
    title: p.name,
    meta: `${p.kind} · ${areaName(p.area)}`,
    group: "Places to go",
    icon: <Compass className="size-4" />,
  })),
  ...dishes.map((d) => ({
    href: `/dishes#${d.slug}`,
    title: d.name,
    meta: d.igbo ? `${d.igbo} · ${d.kind}` : d.kind,
    group: "Dishes",
    icon: <Soup className="size-4" />,
  })),
  ...neighbourhoods.map((n) => ({
    href: `/neighbourhoods#${n.slug}`,
    title: n.name,
    meta: n.vibe,
    group: "Neighbourhoods",
    icon: <MapPin className="size-4" />,
  })),
  ...stories.map((s) => ({
    href: `/stories/${s.slug}`,
    title: s.title,
    meta: s.category,
    group: "Stories",
    icon: <BookOpen className="size-4" />,
  })),
];

const suggestions = ["Ofe Owerri", "Suya", "Hotel", "Festival", "Café", "Rooftop"];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all.filter((r) => r.group === "Places to eat").slice(0, 5);
    return all
      .filter((r) => `${r.title} ${r.meta} ${r.group}`.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const go = (href: string) => {
    close();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button aria-label="Close search" className="absolute inset-0 bg-forest-deep/50 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search Native Kitchen"
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-canvas shadow-2xl shadow-forest-deep/30"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search className="size-5 text-stone" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    go(results[active].href);
                  }
                }}
                placeholder="Search food, places, events…"
                className="h-16 flex-1 bg-transparent text-base outline-none placeholder:text-stone/70"
                aria-label="Search"
              />
              <button onClick={close} className="rounded-full p-2 text-stone hover:bg-forest/5" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>

            {!query && (
              <div className="flex flex-wrap gap-2 px-5 pt-4">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold hover:border-forest hover:text-forest"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <ul className="max-h-[50vh] overflow-y-auto p-3" role="listbox">
              {results.length === 0 && (
                <li className="px-3 py-10 text-center text-sm text-stone">No matches for “{query}”. Try a dish, a venue or a neighbourhood.</li>
              )}
              {results.map((r, i) => (
                <li key={r.href + r.title} role="option" aria-selected={i === active}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                      i === active ? "bg-sand" : "hover:bg-sand/60",
                    )}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-mint text-forest">{r.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{r.title}</span>
                      <span className="block truncate text-xs text-stone">
                        {r.group} · {r.meta}
                      </span>
                    </span>
                    {i === active ? <CornerDownLeft className="size-4 text-stone" /> : <ArrowUpRight className="size-4 text-stone/50" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
