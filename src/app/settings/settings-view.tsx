"use client";

import Link from "next/link";
import { ChevronRight, Palette, Trash2 } from "lucide-react";
import { useState } from "react";
import { FulfilmentToggle } from "@/components/cart-ui";
import { PageHeader } from "@/components/ui";
import { cart, useCart, useOrders } from "@/lib/cart-store";
import { notificationActions } from "@/lib/notifications-store";
import { createPersistedStore } from "@/lib/persisted-store";
import { useSaved } from "@/lib/saved-store";
import { themes, useSiteTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Prefs = { eventReminders: boolean; marketAlerts: boolean; offers: boolean };
const DEFAULT_PREFS: Prefs = { eventReminders: true, marketAlerts: true, offers: false };
const prefsStore = createPersistedStore<Prefs>("native:prefs", DEFAULT_PREFS, (v) => ({ ...DEFAULT_PREFS, ...(typeof v === "object" && v ? (v as Partial<Prefs>) : {}) }));

const card = "rounded-[1.25rem] border border-line/70 bg-paper p-5 shadow-card sm:p-6";

/** `chrome={false}` drops the page title so another design version can supply its own header. */
export function SettingsView({ chrome = true }: { chrome?: boolean }) {
  const prefs = prefsStore.useValue();
  const { mode } = useCart();
  const { saved, toggle } = useSaved();
  const orders = useOrders();
  const theme = useSiteTheme();
  const [done, setDone] = useState("");

  const flash = (msg: string) => {
    setDone(msg);
    window.setTimeout(() => setDone(""), 2200);
  };

  return (
    <>
      {chrome && <PageHeader title="Settings" description="Preferences are stored in this browser only — there are no accounts in this preview." />}
      <div className="container-x grid max-w-5xl gap-5 py-6 lg:mx-0 lg:grid-cols-2 lg:py-8">
        <section className={card}>
          <h2 className="text-xl font-semibold text-forest">Notifications</h2>
          <div className="mt-4 space-y-3">
            {(
              [
                ["eventReminders", "Event reminders", "Tickets, festivals and live music"],
                ["marketAlerts", "Market updates", "Fresh produce and new stalls"],
                ["offers", "Offers from kitchens", "Delivery deals and specials"],
              ] as const
            ).map(([key, label, hint]) => (
              <button
                key={key}
                role="switch"
                aria-checked={prefs[key]}
                onClick={() => prefsStore.set({ ...prefs, [key]: !prefs[key] })}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-line px-4 py-3 text-left"
              >
                <span>
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-sm text-stone">{hint}</span>
                </span>
                <Switch on={prefs[key]} />
              </button>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="text-xl font-semibold text-forest">Ordering</h2>
          <p className="mt-1 text-sm text-stone">Default way to receive food orders.</p>
          <div className="mt-4 max-w-xs">
            <FulfilmentToggle mode={mode} />
          </div>
          <h2 className="mt-8 text-xl font-semibold text-forest">Appearance</h2>
          <p className="mt-1 text-sm text-stone">
            The site is currently shown in <span className="font-semibold text-ink">{themes.find((t) => t.id === theme)?.name}</span>. Appearance is a site-wide setting managed by
            administrators.
          </p>
          <Link href="/admin" className="mt-4 flex items-center gap-3 rounded-2xl border border-line px-4 py-3 hover:border-forest/30">
            <span className="grid size-10 place-items-center rounded-full bg-forest text-on-forest">
              <Palette className="size-5" />
            </span>
            <span className="flex-1 font-semibold">Admin · Website Appearance</span>
            <ChevronRight className="size-4 text-stone" />
          </Link>
        </section>

        <section className={cn(card, "lg:col-span-2")}>
          <h2 className="text-xl font-semibold text-forest">Data on this device</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <DangerButton label={`Clear saved (${saved.length})`} disabled={!saved.length} onClick={() => { saved.forEach(toggle); flash("Saved items cleared."); }} />
            <DangerButton label={`Clear order history (${orders.length})`} disabled={!orders.length} onClick={() => { cart.clearHistory(); flash("Order history cleared."); }} />
            <DangerButton label="Mark notifications unread" onClick={() => { notificationActions.reset(); flash("Notifications reset."); }} />
          </div>
          <p className="mt-3 h-5 text-sm font-semibold text-forest-light" role="status">
            {done}
          </p>
        </section>
      </div>
    </>
  );
}

function Switch({ on }: { on: boolean }) {
  return (
    <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", on ? "bg-accent" : "bg-ink/15")}>
      <span className={cn("absolute top-1 size-4 rounded-full bg-white shadow transition-all", on ? "left-6" : "left-1")} />
    </span>
  );
}

function DangerButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink hover:border-forest/40 disabled:opacity-40"
    >
      <Trash2 className="size-4" /> {label}
    </button>
  );
}
