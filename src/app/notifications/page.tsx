import type { Metadata } from "next";
import { NotificationsList } from "./notifications-list";
import { Design } from "@/components/design";
import { SigNotifications } from "@/components/sig/client-pages";

export const metadata: Metadata = { title: "Notifications", description: "Updates on your orders, events, market finds and offers." };

function NotificationsPage() {
  return <NotificationsList />;
}

export default function Page() {
  return <Design a={<NotificationsPage />} b={<SigNotifications />} />;
}
