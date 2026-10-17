"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { isActivePath, navigation, type NavItem } from "@/lib/navigation";
import { useUnreadCount } from "@/lib/notifications-store";
import { useLagosMinutes } from "@/lib/use-lagos-time";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "./ui";

const OPEN_EVENT = "native:open-nav";
export const openNavDrawer = () => window.dispatchEvent(new Event(OPEN_EVENT));

/** Slide-in navigation drawer from the mobile reference: greeting, full menu in order, "Explore More" card. */
export function NavDrawer() {
  const [open, setOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);
  const pathname = usePathname();
  const minutes = useLagosMinutes();
  const unread = useUnreadCount();
  const greeting = minutes === null ? "Welcome," : minutes < 720 ? "Good morning," : minutes < 1020 ? "Good afternoon," : "Good evening,";

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const row = (item: NavItem, child = false) => {
    const active = item.href === "/" ? pathname === "/" : isActivePath(pathname, item.href) && !(item.children && pathname !== item.href);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        onClick={close}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition-colors",
          child && "py-2 pl-11 text-sm",
          active ? "bg-sand font-semibold text-forest" : "text-ink hover:bg-sand/60",
        )}
      >
        <Icon className={cn("shrink-0 text-forest", child ? "size-[18px]" : "size-[22px]")} strokeWidth={active ? 2.3 : 1.9} />
        <span className="flex-1">{item.label}</span>
        {item.href === "/notifications" && unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-on-accent">{unread}</span>}
        <ChevronRight className="size-4 text-stone" />
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[75]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close menu" className="absolute inset-0 bg-forest-deep/60" onClick={close} />
          <motion.nav
            aria-label="Site"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="pb-safe absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto rounded-r-[1.75rem] bg-paper px-4 pt-5"
          >
            <div className="flex items-center justify-between px-1">
              <Logo />
              <button onClick={close} className="grid size-10 place-items-center rounded-full text-forest hover:bg-forest/5" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>

            <Link href="/settings" onClick={close} className="mt-5 flex items-center gap-3 rounded-2xl px-1 py-2">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-native-pattern ring-2 ring-mint">
                <LogoMark light className="size-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-stone">{greeting}</span>
                <span className="block font-display text-xl font-semibold text-forest">Explorer</span>
                <span className="block text-xs text-stone">Discover. Explore. Experience.</span>
              </span>
              <ChevronRight className="size-5 text-stone" />
            </Link>

            <ul className="mt-4 space-y-0.5">
              {navigation.slice(0, 5).map((item) => (
                <li key={item.href}>
                  {item.children ? (
                    <>
                      <div className="flex items-center">
                        <div className="flex-1">{row(item)}</div>
                        <button
                          type="button"
                          onClick={() => setToursOpen((v) => !v)}
                          aria-expanded={toursOpen || item.children.some((c) => isActivePath(pathname, c.href))}
                          aria-label="Show tour types"
                          className="grid size-10 place-items-center rounded-xl text-forest hover:bg-sand"
                        >
                          <ChevronDown className={cn("size-4 transition-transform", (toursOpen || item.children.some((c) => isActivePath(pathname, c.href))) && "rotate-180")} />
                        </button>
                      </div>
                      {(toursOpen || item.children.some((c) => isActivePath(pathname, c.href))) && (
                        <ul className="space-y-0.5">
                          {item.children.map((c) => (
                            <li key={c.href}>{row(c, true)}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    row(item)
                  )}
                </li>
              ))}
            </ul>
            <div className="my-3 h-px bg-line" />
            <ul className="space-y-0.5">
              {navigation.slice(5).map((item) => (
                <li key={item.href}>{row(item)}</li>
              ))}
            </ul>

            <Link href="/explore" onClick={close} className="relative isolate mt-5 mb-5 flex items-center gap-3 overflow-hidden rounded-2xl bg-pine p-4 text-cream">
              <span className="absolute inset-0 -z-10 bg-native-pattern opacity-40" aria-hidden />
              <LogoMark light className="size-8" />
              <span className="flex-1">
                <span className="block font-semibold">Explore More</span>
                <span className="block text-xs text-cream/80">Food · Culture · Places · Experiences</span>
              </span>
              <span className="grid size-9 place-items-center rounded-full border border-cream/60">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
