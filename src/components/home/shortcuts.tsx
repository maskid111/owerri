"use client";

import { navigation } from "@/lib/navigation";
import { useUnreadCount } from "@/lib/notifications-store";
import { Shortcut } from "../native";

/** Discovery shortcuts from the Native Light reference, in navigation order. */
const hrefs = ["/market", "/tours", "/nearby", "/events", "/saved", "/notifications"];

export function HomeShortcuts() {
  const unread = useUnreadCount();
  const items = hrefs.map((h) => navigation.find((n) => n.href === h)!);
  return (
    <ul className="grid grid-cols-3 gap-1 sm:gap-3 lg:grid-cols-6">
      {items.map((n) => (
        <li key={n.href}>
          <Shortcut href={n.href} label={n.label} icon={n.icon} badge={n.href === "/notifications" ? unread : undefined} />
        </li>
      ))}
    </ul>
  );
}
