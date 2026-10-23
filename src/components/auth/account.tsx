"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Bookmark, ChevronRight, CircleHelp, LogOut, MailWarning, Settings, ShoppingBag, User as UserIcon, type LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { initials, useAuth } from "@/lib/auth/session";
import { withNext } from "@/lib/auth/validation";
import { useOrders } from "@/lib/cart-store";
import { useSaved } from "@/lib/saved-store";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { AuthNotice, PrototypeTag, type Variant } from "./auth-ui";

/** Account menu destinations — all existing pages except My Profile (/account). */
export const accountLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "My Profile", href: "/account", icon: UserIcon },
  { label: "My Orders", href: "/orders", icon: ShoppingBag },
  { label: "Saved Items", href: "/saved", icon: Bookmark },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help & Support", href: "/help", icon: CircleHelp },
];

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full bg-forest font-semibold text-on-forest", className)} aria-hidden>
      {initials(name)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Sign-out confirmation                                               */
/* ------------------------------------------------------------------ */

/** `request()` opens a confirmation dialog; render `dialog` once. Cart and saved items are kept. */
export function useSignOut() {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const confirm = async () => {
    setBusy(true);
    await signOut();
    setBusy(false);
    setOpen(false);
    toast({ tone: "info", title: "You’ve signed out", body: "Your cart and saved items stay on this device." });
  };

  const dialog = (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[85] flex items-end justify-center p-4 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Cancel" className="absolute inset-0 bg-forest-deep/55" onClick={() => setOpen(false)} />
          <motion.div role="alertdialog" aria-modal="true" aria-labelledby={titleId} initial={{ y: 16 }} animate={{ y: 0 }} className="relative w-full max-w-sm rounded-[1.5rem] bg-canvas p-6">
            <h2 id={titleId} className="text-2xl font-semibold text-forest">
              Sign out of Native?
            </h2>
            <p className="mt-2 text-sm text-stone">Your cart and saved items stay on this device, so you can carry on browsing.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button autoFocus onClick={() => setOpen(false)} className="h-11 rounded-full border border-line bg-paper text-sm font-semibold text-forest hover:border-forest/40">
                Stay signed in
              </button>
              <button onClick={confirm} disabled={busy} className="h-11 rounded-full bg-forest text-sm font-semibold text-on-forest hover:bg-forest-light disabled:opacity-60">
                {busy ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { request: () => setOpen(true), dialog };
}

/* ------------------------------------------------------------------ */
/* Header account button + menu                                        */
/* ------------------------------------------------------------------ */

/**
 * Visitors: a "Sign in" link (icon on small screens). Signed in: initials avatar opening the account menu.
 * `light` = white styling over the homepage hero (Version A).
 */
export function AccountButton({ variant, light = false }: { variant: Variant; light?: boolean }) {
  const { status, user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { request, dialog } = useSignOut();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status === "loading") return <span className="size-9 shrink-0 sm:size-10" aria-hidden />;

  if (!user) {
    return (
      <Link
        href={withNext("/sign-in", pathname)}
        className={cn(
          "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full text-sm font-semibold transition-colors sm:h-10",
          "max-xl:w-9 max-xl:justify-center sm:max-xl:w-10 xl:px-4",
          light ? "text-cream hover:bg-cream/10 xl:border xl:border-cream/40" : "text-forest hover:bg-forest/5 xl:border xl:border-line",
          variant === "b" && "xl:border-line",
        )}
        aria-label="Sign in"
      >
        <UserIcon className="size-5 xl:size-4" />
        <span className="hidden xl:inline">Sign in</span>
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={`Account menu for ${user.name}`}
        className={cn("grid size-9 place-items-center rounded-full ring-2 transition-shadow sm:size-10", light ? "ring-cream/40" : "ring-transparent hover:ring-forest/20")}
      >
        <Avatar name={user.name} className={cn("size-8 text-xs sm:size-9", light && "bg-cream text-forest-deep")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={cn("absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden border border-line bg-paper text-ink shadow-lift", variant === "a" ? "rounded-2xl" : "rounded-[1.5rem]")}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Avatar name={user.name} className="size-10 text-sm" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-forest">{user.name}</p>
                <p className="truncate text-xs text-stone">{user.email}</p>
              </div>
            </div>
            <ul className="p-1.5">
              {accountLinks.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link role="menuitem" href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sand">
                    <Icon className="size-[18px] text-forest" aria-hidden /> {label}
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-line pt-1">
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    request();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-sand"
                >
                  <LogOut className="size-[18px] text-forest" aria-hidden /> Sign out
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {dialog}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Site menu (drawer / panel) account card                             */
/* ------------------------------------------------------------------ */

export function MenuAccountCard({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const { status, user } = useAuth();
  if (status === "loading") return <div className="mt-5 h-[4.5rem]" aria-hidden />;
  if (user)
    return (
      <Link href="/account" onClick={onNavigate} className="mt-5 flex items-center gap-3 rounded-2xl bg-sand/70 px-3 py-3 transition-colors hover:bg-sand">
        <Avatar name={user.name} className="size-11 text-sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-forest">{user.name}</span>
          <span className="block text-xs text-stone">View profile</span>
        </span>
        <ChevronRight className="size-4 text-stone" />
      </Link>
    );
  return (
    <div className="mt-5 rounded-2xl bg-sand/70 p-4">
      <p className="text-sm font-semibold text-forest">Your Native account</p>
      <p className="mt-0.5 text-xs text-stone">Track orders and keep your favourites.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href={withNext("/sign-in", pathname)} onClick={onNavigate} className="inline-flex h-10 items-center justify-center rounded-full bg-forest text-sm font-semibold text-on-forest">
          Sign in
        </Link>
        <Link href={withNext("/sign-up", pathname)} onClick={onNavigate} className="inline-flex h-10 items-center justify-center rounded-full border border-line bg-paper text-sm font-semibold text-forest">
          Create account
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* My Profile (/account) — a protected page                            */
/* ------------------------------------------------------------------ */

export function AccountView({ variant }: { variant: Variant }) {
  const { status, user, isPrototype } = useAuth();
  const orders = useOrders();
  const { saved } = useSaved();
  const { request, dialog } = useSignOut();
  const card = variant === "a" ? "rounded-[1.25rem] border border-line/70 bg-paper shadow-card" : "rounded-[1.75rem] bg-paper shadow-card";

  if (status === "loading") return <div className="container-x min-h-[50vh] py-16" aria-busy="true" />;

  if (!user)
    return (
      <div className="container-x py-12 lg:py-20">
        <div className={cn("mx-auto max-w-md px-6 py-10 text-center", card)}>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-forest" aria-hidden>
            <UserIcon className="size-6" />
          </span>
          <h1 className={cn("mt-4 text-forest", variant === "a" ? "font-display text-3xl font-semibold" : "text-3xl")}>Sign in to see your profile</h1>
          <p className="mt-2 text-stone">Your profile, orders and saved places in one place. Browsing and ordering food don’t need an account.</p>
          <div className="mt-6 grid gap-3">
            <Link href={withNext("/sign-in", "/account")} className="inline-flex h-12 items-center justify-center rounded-full bg-forest font-semibold text-on-forest hover:bg-forest-light">
              Sign in
            </Link>
            <Link href={withNext("/sign-up", "/account")} className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper font-semibold text-forest hover:border-forest/40">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );

  const since = new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const counts: Record<string, string | undefined> = {
    "/orders": orders.length ? `${orders.length} ${orders.length === 1 ? "order" : "orders"}` : undefined,
    "/saved": saved.length ? `${saved.length} saved` : undefined,
  };

  return (
    <div className="container-x py-8 lg:py-14">
      <div className={cn("flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7", card)}>
        <Avatar name={user.name} className="size-16 text-xl sm:size-20 sm:text-2xl" />
        <div className="min-w-0 flex-1">
          <h1 className={cn("text-forest", variant === "a" ? "font-display text-3xl font-semibold" : "text-3xl")}>{user.name}</h1>
          <p className="mt-1 break-all text-stone">{user.email}</p>
          <p className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
            {user.emailVerified ? (
              <span className="rounded-full bg-mint px-2.5 py-1 text-forest">Email verified</span>
            ) : (
              <Link href="/verify-email?next=/account" className="inline-flex items-center gap-1 rounded-full bg-[#fdf1dc] px-2.5 py-1 text-[#7a4f00] dark:bg-[#33270c] dark:text-[#f6d48e]">
                <MailWarning className="size-3.5" aria-hidden /> Verify your email
              </Link>
            )}
            {user.isDemo && <span className="rounded-full bg-sand px-2.5 py-1 text-ink/70">Demo account</span>}
          </p>
        </div>
        <button onClick={request} className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full border border-line bg-paper px-5 text-sm font-semibold text-forest hover:border-forest/40 sm:self-center">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className={cn("p-5 sm:p-6", card)} aria-labelledby="profile-details">
          <h2 id="profile-details" className="text-lg font-semibold text-forest">
            Profile details
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Full name", user.name],
              ["Email", user.email],
              ["Phone", user.phone ?? "Not added"],
              ["Member since", since],
            ].map(([k, val]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3">
                <dt className="text-stone">{k}</dt>
                <dd className="font-medium break-all">{val}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-label="Account" className={cn("p-2", card)}>
          <ul className="grid grid-cols-1 sm:grid-cols-2">
            {accountLinks
              .filter((l) => l.href !== "/account")
              .map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-3 rounded-2xl px-3 py-3.5 transition-colors hover:bg-sand/70">
                    <span className="grid size-10 place-items-center rounded-full bg-mint text-forest">
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-forest">{label}</span>
                      {counts[href] && <span className="block text-xs text-stone">{counts[href]}</span>}
                    </span>
                    <ChevronRight className="size-4 text-stone" />
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      {isPrototype && (
        <AuthNotice tone="info" title="Prototype account" className="mt-6">
          Profile details are kept in this browser only. Sign-in here is a demonstration, not secure authentication <PrototypeTag />
        </AuthNotice>
      )}
      {dialog}
    </div>
  );
}
