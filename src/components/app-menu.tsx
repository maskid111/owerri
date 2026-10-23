"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { isActivePath } from "@/lib/navigation";
import { useUnreadCount } from "@/lib/notifications-store";
import { menuGroups } from "@/lib/services";
import { cn } from "@/lib/utils";
import { MenuAccountCard } from "./auth/account";
import { ServiceArt } from "./service-art";
import { Photo } from "./ui";

/**
 * The grouped site menu (Explore · Your space · Support) shared by the Version A drawer and the Version B
 * menu panel: illustrated service rows with a one-line hint (with the Native Kitchen banner under
 * Restaurants), then personal and support links, then the "Taste the regions" banner.
 */
export function AppMenuList({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const unread = useUnreadCount();

  return (
    <>
      <MenuAccountCard pathname={pathname} onNavigate={onNavigate} />
      {menuGroups.map((g) => (
        <section key={g.title} className="mt-6 first:mt-5">
          <p className="px-2 text-[0.7rem] font-semibold tracking-[0.16em] text-stone uppercase">{g.title}</p>
          <ul className="mt-2 space-y-0.5">
            {g.items.map((item) => {
              const active = !item.href.includes("#") && isActivePath(pathname, item.href) && !(item.href === "/tours" && pathname !== "/tours");
              const Icon = item.icon;
              return (
                <Fragment key={item.href}>
                  <li>
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
                  {item.href === "/restaurants" && (
                    <li className="py-1.5">
                      <NativeKitchenBanner onNavigate={onNavigate} />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ul>
        </section>
      ))}

      <TasteRegionsBanner onNavigate={onNavigate} />
    </>
  );
}

/** Menu banner under Restaurants: Native Kitchen — food stories, people and culture (links to Discover). */
function NativeKitchenBanner({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Link href="/blog" onClick={onNavigate} className="group relative isolate flex min-h-[6.5rem] overflow-hidden rounded-2xl bg-forest-deep text-white">
      <span className="absolute inset-y-0 right-0 -z-20 w-[48%]">
        <Photo name="nkwobi" alt="" sizes="180px" className="transition-transform duration-500 group-hover:scale-[1.05]" />
      </span>
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep from-45% via-forest-deep/70 to-transparent" aria-hidden />
      <span className="flex flex-col justify-center gap-1 px-4 py-3.5">
        <span className="flex items-center gap-2">
          <BookOpen className="size-[18px] shrink-0" aria-hidden />
          <span className="font-semibold">Native Kitchen</span>
          <span className="rounded-full bg-leaf px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wide text-[#0a2c1e] uppercase">New</span>
        </span>
        <span className="max-w-[12rem] text-xs text-white/80">Food stories, people &amp; culture.</span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold">
          Read now <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </Link>
  );
}

/** Closing menu banner: discover dishes and flavours (links to the dish guide). */
function TasteRegionsBanner({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Link href="/dishes" onClick={onNavigate} className="group relative isolate mt-7 mb-6 flex min-h-[6.5rem] items-center overflow-hidden rounded-2xl bg-[#2a1a10] text-white">
      <span className="absolute inset-y-0 right-0 -z-20 w-[50%]">
        <Photo name="spices" alt="" sizes="180px" className="transition-transform duration-500 group-hover:scale-[1.05]" />
      </span>
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2a1a10] from-40% via-[#2a1a10]/70 to-transparent" aria-hidden />
      <span className="flex w-full items-center gap-3 px-4 py-4">
        <span className="min-w-0 flex-1">
          <span className="block text-[0.6rem] font-bold tracking-[0.16em] text-white/75 uppercase">Taste the regions</span>
          <span className="mt-1 block max-w-[13rem] text-[0.95rem] leading-snug font-semibold">From soups to street food, discover Nigeria’s flavours.</span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/70 transition-colors group-hover:bg-white group-hover:text-[#2a1a10]" aria-hidden>
          <ArrowRight className="size-4" />
        </span>
      </span>
    </Link>
  );
}
