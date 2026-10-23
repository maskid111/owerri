"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, House, Menu, Store, UtensilsCrossed } from "lucide-react";
import { isActivePath, isImmersive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { openNavDrawer } from "./nav-drawer";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/restaurants", label: "Food", icon: UtensilsCrossed },
  { href: "/market", label: "Market", icon: Store },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

/** Mobile bottom bar: Home, Food, Market and Saved plus "Menu", which opens the full navigation drawer. */
export function BottomNav() {
  const pathname = usePathname();
  if (isImmersive(pathname)) return null;

  return (
    <nav aria-label="Quick links" className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-forest-deep text-white shadow-[0_-8px_24px_rgba(8,35,26,0.18)] lg:hidden">
      <ul className="mx-auto grid h-[64px] max-w-lg grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-spark" : "text-white/70")}
              >
                <Icon className={cn("size-[22px]", active && "fill-spark/20")} strokeWidth={active ? 2.2 : 1.8} />
                {label}
                {active && <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-spark" />}
              </Link>
            </li>
          );
        })}
        <li>
          <button onClick={openNavDrawer} className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-white/70">
            <Menu className="size-[22px]" strokeWidth={1.8} />
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}
