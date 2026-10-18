"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Bookmark, ChevronDown, LayoutGrid, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { isActivePath, isImmersive, navigation, type NavItem } from "@/lib/navigation";
import { useUnreadCount } from "@/lib/notifications-store";
import { useSaved } from "@/lib/saved-store";
import { cn } from "@/lib/utils";
import { openSearch } from "../search-dialog";
import { SigWordmark } from "./ui";

/** Version B header: dark band with a centred wordmark and search, plus a sticky icon rail of every section. */
export function SigHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const { saved } = useSaved();
  const unread = useUnreadCount();
  const [menu, setMenu] = useState(false);
  const immersive = isImmersive(pathname);
  const home = pathname === "/";
  const [pastHero, setPastHero] = useState(false);

  // On the homepage the header floats discreetly over the video; the icon rail slides in after the hero.
  useEffect(() => {
    if (!home) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  const icon = "relative grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10";
  const badge = "absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-leaf px-1 text-[10px] font-bold text-forest-deep";

  return (
    <>
      <header className={cn("z-40 text-white", home ? "absolute inset-x-0 top-0 bg-transparent" : "relative bg-forest-deep", immersive && "max-lg:hidden")}>
        <div className="container-x grid h-[72px] grid-cols-[1fr_auto_1fr] items-center lg:h-[88px]">
          <div className="flex items-center gap-1">
            <button onClick={() => setMenu(true)} className={cn(icon, "lg:hidden")} aria-label="Open menu">
              <LayoutGrid className="size-[22px]" />
            </button>
            {home && (
              <button onClick={() => openSearch()} className={cn(icon, "hidden lg:grid")} aria-label="Search">
                <Search className="size-5" />
              </button>
            )}
          </div>
          <Link href="/" aria-label="Native home" className="justify-self-center">
            <SigWordmark light />
          </Link>
          <div className="flex items-center justify-end gap-0.5">
            <Link href="/notifications" className={cn(icon, "max-sm:hidden")} aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}>
              <Bell className="size-5" />
              {unread > 0 && <span className={badge}>{unread}</span>}
            </Link>
            <Link href="/saved" className={cn(icon, "hidden lg:grid")} aria-label={`Saved (${saved.length})`}>
              <Bookmark className="size-5" />
              {saved.length > 0 && <span className={badge}>{saved.length}</span>}
            </Link>
            <Link href="/orders" className={icon} aria-label={`Cart and orders (${count} in cart)`}>
              <ShoppingBag className="size-5" />
              {count > 0 && <span className={badge}>{count}</span>}
            </Link>
          </div>
        </div>
        <div className={cn("container-x pb-5", home && "hidden")}>
          <button
            type="button"
            onClick={openSearch}
            className="mx-auto flex h-11 w-full max-w-xl items-center gap-3 rounded-full bg-white pr-1.5 pl-2 text-left text-stone transition-shadow hover:ring-4 hover:ring-white/20"
          >
            <span className="grid size-8 place-items-center rounded-full bg-forest text-on-forest">
              <Search className="size-4" />
            </span>
            <span className="flex-1 truncate text-sm">Search for food, places, events…</span>
            <kbd className="mr-2 hidden rounded-md bg-sand px-2 py-0.5 font-sans text-[11px] font-semibold text-stone sm:inline">⌘K</kbd>
          </button>
        </div>
      </header>

      {/* Desktop icon rail — every section in order */}
      <nav
        aria-label="Main"
        className={cn(
          "top-0 z-40 hidden border-b border-line bg-paper/95 backdrop-blur transition-transform duration-300 lg:block",
          home ? cn("fixed inset-x-0", !pastHero && "-translate-y-full") : "sticky",
        )}
      >
        <ul className="container-x flex items-stretch justify-center">
          {navigation.map((item) => (
            <li key={item.href} className="relative">
              {item.children ? <RailDropdown item={item} pathname={pathname} unread={unread} /> : <RailLink item={item} pathname={pathname} unread={unread} />}
            </li>
          ))}
        </ul>
      </nav>

      <SigMenuSheet open={menu} onClose={() => setMenu(false)} pathname={pathname} unread={unread} />
    </>
  );
}

function railClass(active: boolean) {
  return cn(
    "group relative flex h-[70px] min-w-[78px] flex-col items-center justify-center gap-1.5 px-2 text-[0.68rem] font-bold whitespace-nowrap transition-colors xl:min-w-[92px] xl:text-[0.72rem]",
    active ? "text-forest" : "text-stone hover:text-forest",
  );
}

function RailLink({ item, pathname, unread }: { item: NavItem; pathname: string; unread: number }) {
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link href={item.href} aria-current={active ? "page" : undefined} className={railClass(active)}>
      <span className={cn("relative grid size-8 place-items-center rounded-full transition-all", active ? "bg-forest text-on-forest" : "group-hover:bg-mint")}>
        <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
        {item.href === "/notifications" && unread > 0 && <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-accent ring-2 ring-paper" />}
      </span>
      {item.label}
      <span className={cn("absolute inset-x-6 top-0 h-[3px] rounded-b-full bg-spark transition-transform", active ? "scale-x-100" : "scale-x-0")} />
    </Link>
  );
}

function RailDropdown({ item, pathname }: { item: NavItem; pathname: string; unread: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

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
    <div ref={ref}>
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((v) => !v)} className={railClass(active)}>
        <span className={cn("grid size-8 place-items-center rounded-full transition-all", active ? "bg-forest text-on-forest" : "group-hover:bg-mint")}>
          <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
        </span>
        <span className="flex items-center gap-0.5">
          {item.label} <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} />
        </span>
        <span className={cn("absolute inset-x-6 top-0 h-[3px] rounded-b-full bg-spark transition-transform", active ? "scale-x-100" : "scale-x-0")} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 z-50 w-[22rem] -translate-x-1/2 pt-2">
          <div className="grid grid-cols-2 gap-2 rounded-3xl bg-forest-deep p-2 shadow-lift">
            {[{ ...item, label: "All tours" }, ...item.children!].map((c, i) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setOpen(false)}
                className={cn("group flex flex-col gap-2 rounded-2xl p-4 text-white transition-colors hover:bg-white/10", i === 0 && "col-span-2 bg-white/5")}
              >
                <c.icon className="size-5 text-leaf" />
                <span className="text-sm font-bold">{c.label}</span>
                {c.description && <span className="text-xs text-white/65">{c.description}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Mobile full-screen grid menu on the brand pattern. */
function SigMenuSheet({ open, onClose, pathname, unread }: { open: boolean; onClose: () => void; pathname: string; unread: number }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const items = navigation.flatMap((n) => [n, ...(n.children ?? [])]);

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          aria-label="Site menu"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[75] overflow-y-auto bg-native-pattern-lg lg:hidden"
        >
          <div className="min-h-full bg-forest-deep/85 px-4 pt-4 pb-10">
            <div className="flex items-center justify-between">
              <SigWordmark light size="sm" />
              <button onClick={onClose} className="grid-cols-1 grid size-11 place-items-center rounded-full bg-white text-forest-deep" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-8 grid grid-cols-3 gap-2.5">
              {items.map((item, i) => {
                const active = isActivePath(pathname, item.href) && !(item.children && pathname !== item.href);
                const Icon = item.icon;
                return (
                  <motion.li key={item.href} initial={{ y: 12 }} animate={{ y: 0 }} transition={{ delay: 0.02 * i }}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl p-2 text-center text-[0.72rem] leading-tight font-bold",
                        active ? "bg-leaf text-forest-deep" : "bg-white text-forest",
                      )}
                    >
                      <span className={cn("grid size-11 place-items-center rounded-full", active ? "bg-forest-deep text-leaf" : "bg-forest text-on-forest")}>
                        <Icon className="size-5" />
                      </span>
                      {item.label}
                      {item.href === "/notifications" && unread > 0 && (
                        <span className="absolute top-2 right-2 grid grid-cols-1 h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] text-on-accent">{unread}</span>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-2.5 text-sm font-semibold text-white">
              {[
                ["/explore", "Explore everything"],
                ["/restaurants", "Food & restaurants"],
                ["/culture", "Culture & heritage"],
                ["/orders", "Cart & orders"],
              ].map(([href, label]) => (
                <Link key={href} href={href} onClick={onClose} className="rounded-2xl border border-white/25 px-4 py-3 hover:bg-white/10">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
