"use client";

import Link from "next/link";
import { BookOpen, Bookmark, CalendarDays, CheckCheck, Mountain, ShoppingBag, Store } from "lucide-react";
import { useState } from "react";
import { exploreItems, restaurants, type Notice } from "@/lib/data";
import { notificationActions, useNotifications } from "@/lib/notifications-store";
import { useSaved } from "@/lib/saved-store";
import { cn } from "@/lib/utils";
import { SigExploreItem } from "./explore-item";
import { SigArrow, sigBtn, SigPageHeader, SigRestaurantCard } from "./ui";

export function SigSaved() {
  const { saved } = useSaved();
  const [tab, setTab] = useState<"all" | "food" | "places">("all");
  const food = restaurants.filter((r) => saved.includes(r.slug));
  const other = exploreItems.filter((x) => x.kind !== "restaurant" && saved.includes(x.slug));
  const total = food.length + other.length;

  return (
    <>
      <SigPageHeader eyebrow="Your collection" title="Saved" description="Everything you’ve hearted — kitchens, stalls, stays and events — stored on this device.">
        <div className="inline-flex rounded-full bg-sand p-1" role="tablist" aria-label="Filter saved">
          {(
            [
              ["all", `All · ${total}`],
              ["food", `Food · ${food.length}`],
              ["places", `Places & events · ${other.length}`],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={cn("rounded-full px-4 py-2 text-xs font-semibold transition-colors", tab === k ? "bg-forest text-on-forest" : "text-ink/70 hover:text-forest")}
            >
              {l}
            </button>
          ))}
        </div>
      </SigPageHeader>
      <div className="container-x py-12">
        {total === 0 ? (
          <div className="mx-auto max-w-lg rounded-[2rem] bg-paper p-10 text-center shadow-card">
            <span className="mx-auto grid grid-cols-1 size-16 place-items-center rounded-full bg-forest text-on-forest">
              <Bookmark className="size-7" />
            </span>
            <p className="mt-5 text-2xl font-extrabold text-forest">Nothing saved yet</p>
            <p className="mt-2 text-stone">Tap the heart on anything you’d like to come back to.</p>
            <Link href="/explore" className={sigBtn("solid", "mt-6")}>
              Start exploring <SigArrow />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {tab !== "places" && food.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {food.map((r) => (
                  <SigRestaurantCard key={r.slug} restaurant={r} />
                ))}
              </div>
            )}
            {tab !== "food" && other.length > 0 && (
              <div className="grid-cols-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {other.map((x) => (
                  <SigExploreItem key={x.slug} item={x} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const icons: Record<Notice["kind"], typeof Store> = { event: CalendarDays, market: Store, tour: Mountain, offer: ShoppingBag, story: BookOpen };

export function SigNotifications() {
  const items = useNotifications();
  const unread = items.filter((n) => !n.read).length;

  return (
    <>
      <SigPageHeader eyebrow="Inbox" title="Notifications" description={unread ? `${unread} unread ${unread === 1 ? "update" : "updates"}` : "You’re all caught up."}>
        <button type="button" disabled={!unread} onClick={() => notificationActions.markAllRead(items.map((n) => n.id))} className={sigBtn("outline")}>
          <CheckCheck className="size-4" /> Mark all read
        </button>
      </SigPageHeader>
      <ol className="container-x relative max-w-3xl py-12">
        <span className="absolute top-12 bottom-12 left-[2.15rem] w-px bg-line sm:left-[2.65rem]" aria-hidden />
        {items.map((n) => {
          const Icon = icons[n.kind];
          return (
            <li key={n.id} className="relative mb-4 flex gap-4">
              <span className={cn("relative z-10 grid size-10 shrink-0 place-items-center rounded-full ring-4 ring-canvas", n.read ? "bg-sand text-stone" : "bg-forest text-on-forest")}>
                <Icon className="size-[18px]" />
              </span>
              <Link
                href={n.href}
                onClick={() => notificationActions.markRead(n.id)}
                className={cn("group flex-1 rounded-2xl p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift", n.read ? "bg-paper" : "bg-paper ring-2 ring-forest")}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-bold text-forest">{n.title}</span>
                  <span className="shrink-0 text-xs font-semibold text-stone">{n.when}</span>
                </span>
                <span className="mt-1 block text-sm text-ink/80">{n.body}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
