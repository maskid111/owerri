"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isActivePath, isImmersive, navigation } from "@/lib/navigation";
import { useUnreadCount } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";

/** Version B mobile dock: every section in order (as in the reference), scrollable, icon above label. */
export function SigDock() {
  const pathname = usePathname();
  const unread = useUnreadCount();
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    ref.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  if (isImmersive(pathname)) return null;

  return (
    <nav aria-label="Sections" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper shadow-[0_-8px_24px_-16px_rgb(7_42_29/0.35)] lg:hidden">
      <ul ref={ref} className="no-scrollbar flex h-16 snap-x items-stretch overflow-x-auto px-1">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href} className="snap-start">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-full w-[4.6rem] flex-col items-center justify-center gap-1 text-center text-[10px] leading-tight font-bold", active ? "text-forest" : "text-stone")}
              >
                <span className={cn("relative grid h-7 w-11 place-items-center rounded-full transition-colors", active && "bg-forest text-on-forest")}>
                  <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                  {href === "/notifications" && unread > 0 && <span className="absolute -top-0.5 right-1 size-2 rounded-full bg-accent" />}
                </span>
                <span className="line-clamp-1 px-0.5">{label}</span>
                {active && <span className="absolute bottom-1 size-1 rounded-full bg-spark" aria-hidden />}
              </Link>
            </li>
          );
        })}
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
