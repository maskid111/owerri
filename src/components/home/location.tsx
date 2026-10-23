"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Location indicator for the homepage header. It reflects where the listed restaurants and places are
 * today; choosing another area isn't available yet, and the panel says so rather than pretending.
 */
export function LocationChip({ light = false, className }: { light?: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className={cn("inline-flex items-center gap-1 text-xs font-medium", light ? "text-white/85 hover:text-white" : "text-stone hover:text-forest")}
      >
        <MapPin className="size-3.5" aria-hidden /> Owerri <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} aria-hidden />
        <span className="sr-only">— browsing area</span>
      </button>
      {open && (
        <div id={id} role="dialog" aria-label="Browsing area" className="absolute top-full left-0 z-50 mt-2 w-64 rounded-2xl border border-line bg-paper p-4 text-left text-sm text-ink shadow-lift">
          <p className="font-semibold text-forest">Browsing Owerri</p>
          <p className="mt-1 text-stone">The restaurants and places listed on Native right now are in Owerri. Choosing another area isn’t available yet.</p>
        </div>
      )}
    </div>
  );
}
