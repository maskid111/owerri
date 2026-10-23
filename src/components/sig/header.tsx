"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { isActivePath, isImmersive } from "@/lib/navigation";
import { useSaved } from "@/lib/saved-store";
import { cn } from "@/lib/utils";
import { AppMenuList } from "../app-menu";
import { AccountButton } from "../auth/account";
import { openSearch } from "../search-dialog";
import { SigWordmark } from "./ui";

const OPEN_EVENT = "native:open-sig-menu";
export const openSigMenu = () => window.dispatchEvent(new Event(OPEN_EVENT));

/** Food first, then the main discovery sections; everything else lives in the Menu panel. */
const primary = [
  { href: "/restaurants", label: "Food" },
  { href: "/market", label: "Market" },
  { href: "/tours", label: "Tours" },
  { href: "/nearby", label: "Nearby" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Discover" },
];

/** Version B header: one slim, quiet light row — a few text links, the centred logo, and a handful of icons. */
export function SigHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const { saved } = useSaved();
  const icon = "relative grid size-10 place-items-center rounded-full text-forest transition-colors hover:bg-forest/5";
  const dot = "absolute top-1.5 right-1.5 size-2 rounded-full bg-spark";

  return (
    <>
      <header
        className={cn(
          "sticky inset-x-0 top-0 z-40 border-b border-line/60 bg-canvas/90 backdrop-blur-md",
          isImmersive(pathname) && "max-lg:hidden",
        )}
      >
        <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-20">
          <nav aria-label="Main" className="flex items-center">
            <button onClick={openSigMenu} className={cn(icon, "-ml-2 lg:hidden")} aria-label="Open menu">
              <Menu className="size-[22px]" strokeWidth={1.7} />
            </button>
            <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
              {primary.map((l) => {
                const active = isActivePath(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-2 text-[0.92rem] font-medium transition-colors",
                        active ? "text-forest" : "text-ink/70 hover:text-forest",
                      )}
                    >
                      {l.label}
                      {active && <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-[2px] w-4 rounded-full bg-spark" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link href="/" aria-label="Native home" className="justify-self-center">
            <SigWordmark size="sm" />
          </Link>

          <div className="flex items-center justify-end gap-0.5">
            <button onClick={() => openSearch()} className={icon} aria-label="Search">
              <Search className="size-5" strokeWidth={1.8} />
            </button>
            <Link href="/saved" className={cn(icon, "hidden sm:grid")} aria-label={`Saved (${saved.length})`}>
              <Bookmark className="size-5" strokeWidth={1.8} />
              {saved.length > 0 && <span className={dot} />}
            </Link>
            <Link href="/orders" className={icon} aria-label={`Cart and orders (${count} in cart)`}>
              <ShoppingBag className="size-5" strokeWidth={1.8} />
              {count > 0 && <span className={dot} />}
            </Link>
            <AccountButton variant="b" />
            <button
              onClick={openSigMenu}
              className={cn(
                "ml-2 hidden h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-forest transition-colors hover:border-forest/40 lg:inline-flex",
              )}
            >
              <Menu className="size-4" /> Menu
            </button>
          </div>
        </div>
      </header>

      <SigMenuPanel pathname={pathname} />
    </>
  );
}

/** Light slide-in panel with the grouped site menu (see AppMenuList). */
function SigMenuPanel({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[75]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close menu" className="absolute inset-0 bg-forest-deep/40" onClick={close} />
          <motion.nav
            aria-label="Site menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pb-safe absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-canvas px-4 pt-5"
          >
            <div className="flex items-center justify-between">
              <SigWordmark size="sm" />
              <button onClick={close} className="grid size-10 place-items-center rounded-full text-forest hover:bg-forest/5" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <AppMenuList pathname={pathname} onNavigate={close} />
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
