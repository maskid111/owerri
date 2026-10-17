"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, House, Menu, Mountain, Store } from "lucide-react";
import { isActivePath, isImmersive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { openNavDrawer } from "./nav-drawer";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/market", label: "Market", icon: Store },
  { href: "/tours", label: "Tours", icon: Mountain },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

/** Mobile bottom bar: the four most-used destinations plus "Menu", which opens the full navigation drawer. */
export function BottomNav() {
  const pathname = usePathname();
  if (isImmersive(pathname)) return null;

  return (
    <nav aria-label="Quick links" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
      <ul className="mx-auto grid h-[64px] max-w-lg grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-forest" : "text-stone")}
              >
                <Icon className={cn("size-[22px]", active && "fill-forest/15")} strokeWidth={active ? 2.2 : 1.8} />
                {label}
                {active && <span className="absolute bottom-1.5 h-[3px] w-7 rounded-full bg-accent" />}
              </Link>
            </li>
          );
        })}
        <li>
          <button onClick={openNavDrawer} className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-stone">
            <Menu className="size-[22px]" strokeWidth={1.8} />
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}
