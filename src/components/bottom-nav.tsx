"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, ChevronRight, ClipboardList, Compass, Ellipsis, Heart, Home, Image as ImageIcon, MapPinned, Soup, UtensilsCrossed, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { isActivePath, isImmersive } from "./site-header";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/saved", label: "Saved", icon: Heart },
];

const more = [
  { href: "/restaurants", label: "Food & Restaurants", icon: UtensilsCrossed },
  { href: "/dishes", label: "Signature dishes", icon: Soup },
  { href: "/neighbourhoods", label: "Neighbourhoods", icon: MapPinned },
  { href: "/culture", label: "Culture & stories", icon: BookOpen },
  { href: "/credits", label: "Photo credits", icon: ImageIcon },
];

/** Mobile app-style bottom navigation from the references (hidden from lg up). */
export function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const moreActive = more.some((m) => isActivePath(pathname, m.href));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (isImmersive(pathname)) return null;

  return (
    <>
      <nav aria-label="Primary" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
        <ul className="mx-auto grid h-[64px] max-w-lg grid-cols-5">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href) && !(href === "/" && moreActive);
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined} className={cn("relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-forest" : "text-stone")}>
                  <span className="relative">
                    <Icon className={cn("size-[22px]", active && "fill-forest/10")} strokeWidth={active ? 2.2 : 1.8} />
                    {href === "/orders" && count > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-sun px-1 text-[9px] font-bold text-forest-deep">{count}</span>
                    )}
                  </span>
                  {label}
                  {active && <span className="absolute bottom-1.5 h-[3px] w-7 rounded-full bg-forest" />}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className={cn("relative flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold", moreActive ? "text-forest" : "text-stone")}
            >
              <Ellipsis className="size-[22px]" />
              More
              {moreActive && <span className="absolute bottom-1.5 h-[3px] w-7 rounded-full bg-forest" />}
            </button>
          </li>
        </ul>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close menu" className="absolute inset-0 bg-forest-deep/50" onClick={() => setOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="More"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pb-safe absolute inset-x-0 bottom-0 rounded-t-[1.75rem] bg-cream px-4 pt-3"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
              <div className="flex items-center justify-between px-1 pb-2">
                <p className="font-display text-xl font-semibold text-forest">More from Owerri</p>
                <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-forest/5" aria-label="Close">
                  <X className="size-5" />
                </button>
              </div>
              <ul className="pb-5">
                {more.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl px-2 py-3 hover:bg-paper">
                      <span className="grid size-10 place-items-center rounded-xl bg-mint text-forest">
                        <Icon className="size-5" />
                      </span>
                      <span className="flex-1 font-semibold">{label}</span>
                      <ChevronRight className="size-4 text-stone" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
