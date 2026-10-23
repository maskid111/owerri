"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { isActivePath } from "@/lib/navigation";
import { useUnreadCount } from "@/lib/notifications-store";
import { menuGroups } from "@/lib/services";
import { cn } from "@/lib/utils";
import { ServiceArt } from "./service-art";
import { Photo } from "./ui";

/**
 * The grouped site menu (Explore · Your space · Support) shared by the Version A drawer and the Version B
 * menu panel: illustrated service rows with a one-line hint, then personal and support links, then one
 * quiet culture card.
 */
export function AppMenuList({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const unread = useUnreadCount();

  return (
    <>
      {menuGroups.map((g) => (
        <section key={g.title} className="mt-6 first:mt-5">
          <p className="px-2 text-[0.7rem] font-semibold tracking-[0.16em] text-stone uppercase">{g.title}</p>
          <ul className="mt-2 space-y-0.5">
            {g.items.map((item) => {
              const active = !item.href.includes("#") && isActivePath(pathname, item.href) && !(item.href === "/tours" && pathname !== "/tours");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn("flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors", active ? "bg-mint" : "hover:bg-sand/70")}
                  >
                    {item.art ? (
                      <ServiceArt kind={item.art} className="size-10" />
                    ) : (
                      Icon && (
                        <span className="grid size-10 shrink-0 place-items-center text-forest">
                          <Icon className="size-[22px]" strokeWidth={1.8} />
                        </span>
                      )
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-[0.95rem] leading-tight", active ? "font-semibold text-forest" : "font-medium text-ink")}>{item.label}</span>
                      {item.hint && <span className="mt-0.5 block truncate text-xs text-stone">{item.hint}</span>}
                    </span>
                    {item.href === "/notifications" && unread > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[11px] font-bold text-on-forest">{unread}</span>
                    )}
                    <ChevronRight className="size-4 shrink-0 text-stone" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <Link href="/culture" onClick={onNavigate} className="group relative isolate mt-7 mb-6 flex min-h-32 overflow-hidden rounded-2xl bg-forest-deep p-4 text-white">
        <Photo name="masquerade" alt="" sizes="320px" className="-z-20 opacity-60" />
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep via-forest-deep/85 to-transparent" aria-hidden />
        <span className="flex flex-col justify-between">
          <span>
            <span className="block text-[0.65rem] font-semibold tracking-[0.16em] text-leaf uppercase">Native culture</span>
            <span className="mt-1 block font-display text-xl leading-tight">
              More than food.
              <br />A culture.
            </span>
          </span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
            Explore culture <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>
    </>
  );
}
