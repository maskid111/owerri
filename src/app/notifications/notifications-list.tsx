"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, CheckCheck, Mountain, ShoppingBag, Store } from "lucide-react";
import type { Notice } from "@/lib/data";
import { notificationActions, useNotifications } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";
import { buttonClass, PageHeader } from "@/components/ui";

const icons: Record<Notice["kind"], typeof Store> = { event: CalendarDays, market: Store, tour: Mountain, offer: ShoppingBag, story: BookOpen };

export function NotificationsList() {
  const items = useNotifications();
  const unread = items.filter((n) => !n.read);

  return (
    <>
      <PageHeader title="Notifications" description={unread.length ? `You have ${unread.length} unread ${unread.length === 1 ? "update" : "updates"}.` : "You’re all caught up."}>
        <button
          type="button"
          disabled={!unread.length}
          onClick={() => notificationActions.markAllRead(items.map((n) => n.id))}
          className={buttonClass("outline", "sm", "mt-4")}
        >
          <CheckCheck className="size-4" /> Mark all as read
        </button>
      </PageHeader>
      <ul className="container-x max-w-3xl space-y-3 py-6 lg:mx-0 lg:py-8">
        {items.map((n) => {
          const Icon = icons[n.kind];
          return (
            <li key={n.id}>
              <Link
                href={n.href}
                onClick={() => notificationActions.markRead(n.id)}
                className={cn(
                  "flex gap-4 rounded-[1.25rem] border p-4 transition-colors hover:border-forest/30",
                  n.read ? "border-line/70 bg-paper" : "border-accent/40 bg-mint",
                )}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-forest text-on-forest">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-forest">{n.title}</span>
                    <span className="shrink-0 text-xs text-stone">{n.when}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-ink/80">{n.body}</span>
                </span>
                {!n.read && <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
