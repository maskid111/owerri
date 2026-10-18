"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, House, Menu, Store, UtensilsCrossed } from "lucide-react";
import { useEffect } from "react";
import { isActivePath, isImmersive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { openSigMenu } from "./header";

const dockItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/restaurants", label: "Food", icon: UtensilsCrossed },
  { href: "/market", label: "Market", icon: Store },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

/** Version B mobile dock: a small floating pill with four destinations and Menu — calm, thumb-friendly. */
export function SigDock() {
  const pathname = usePathname();
  if (isImmersive(pathname)) return null;

  return (
    <nav aria-label="Quick links" className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3 pb-2 lg:hidden">
      <ul className="mx-auto flex h-14 max-w-sm items-stretch justify-around rounded-full border border-line/70 bg-paper/95 px-2 shadow-lift backdrop-blur">
        {dockItems.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium", active ? "text-forest" : "text-stone")}
              >
                <Icon className="size-5" strokeWidth={active ? 2.1 : 1.7} />
                {label}
                {active && <span className="absolute bottom-1 h-[2px] w-3 rounded-full bg-spark" aria-hidden />}
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <button onClick={openSigMenu} className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-stone">
            <Menu className="size-5" strokeWidth={1.7} />
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}

/** Version B anchors use data-anchor (ids belong to Version A); scroll to them on hash navigation. */
export function SigHashScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const go = () => {
      if (document.documentElement.dataset.design !== "b" || !location.hash) return;
      const el = document.querySelector(`[data-anchor="${CSS.escape(location.hash.slice(1))}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const t = window.setTimeout(go, 80);
    window.addEventListener("hashchange", go);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", go);
    };
  }, [pathname]);
  return null;
}
