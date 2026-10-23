"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { accountNav, isActivePath, isImmersive, mainNav, navigation } from "@/lib/navigation";
import { useUnreadCount } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";
import { NavDrawer, openNavDrawer } from "./nav-drawer";
import { openSearch } from "./search-dialog";
import { AccountButton } from "./auth/account";
import { LocationChip } from "./home/location";
import { Logo } from "./ui";

/** Discovery sections render as text links (short labels); the rest as labelled icon buttons (text from 2xl) — order is preserved. */
const textItems = mainNav;
const iconItems = accountNav;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const unread = useUnreadCount();
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn = cn(
    "relative grid size-9 shrink-0 place-items-center rounded-full transition-colors sm:size-10",
    overHero ? "text-cream hover:bg-cream/10" : "text-forest hover:bg-forest/5",
  );

  return (
    <>
      <header
        className={cn(
          "inset-x-0 top-0 z-50 transition-colors duration-300",
          pathname === "/" ? "fixed" : "sticky",
          overHero ? "bg-transparent" : "border-b border-line/70 bg-canvas/95 backdrop-blur",
          isImmersive(pathname) && "max-lg:hidden",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-2 px-3 sm:gap-3 sm:px-4 sm:px-6 lg:h-[76px] lg:gap-3 lg:px-6 xl:gap-6 xl:px-8">
          <button onClick={openNavDrawer} className={cn(iconBtn, "-ml-2 lg:hidden")} aria-label="Open menu">
            <Menu className="size-6" />
          </button>
          {pathname === "/" ? (
            // Homepage: logo with the browsing-area indicator beneath it, as in the reference.
            <div className="flex shrink-0 flex-col items-start gap-0.5">
              <Link href="/" aria-label="Native home">
                <Logo light={overHero} tagline={false} />
              </Link>
              <LocationChip light={overHero} />
            </div>
          ) : (
            <Link href="/" aria-label="Native home" className="shrink-0">
              <span className="xl:hidden">
                <Logo light={overHero} tagline={false} />
              </span>
              <span className="hidden xl:block">
                <Logo light={overHero} />
              </span>
            </Link>
          )}

          <nav aria-label="Main" className="ml-auto hidden items-center lg:flex">
            <ul className="flex items-center gap-0.5">
              {textItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                const cls = cn(
                  "relative inline-flex items-center gap-1 rounded-full px-2 py-2 text-[0.82rem] font-semibold whitespace-nowrap transition-colors xl:px-3 xl:text-[0.86rem]",
                  overHero ? (active ? "text-cream" : "text-cream/80 hover:text-cream") : active ? "text-forest" : "text-ink/65 hover:text-forest",
                );
                const bar = active && <span className={cn("absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full", "bg-spark")} />;
                return (
                  <li key={item.href}>
                    {item.children ? (
                      <ToursMenu item={item} className={cls} pathname={pathname} bar={bar} overHero={overHero} />
                    ) : (
                      <Link href={item.href} title={item.label} aria-current={active ? "page" : undefined} className={cls}>
                        {item.short ?? item.label}
                        {bar}
                      </Link>
                    )}
                  </li>
                );
              })}
              <li aria-hidden className={cn("mx-2 h-6 w-px", overHero ? "bg-cream/25" : "bg-line")} />
              {iconItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={item.label}
                      aria-label={item.href === "/notifications" && unread ? `${item.label} (${unread} unread)` : item.label}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-[0.84rem] font-semibold whitespace-nowrap transition-colors",
                        overHero ? "text-cream/85 hover:bg-cream/10 hover:text-cream" : active ? "bg-mint text-forest" : "text-ink/65 hover:bg-forest/5 hover:text-forest",
                      )}
                    >
                      <Icon className="size-[18px]" />
                      <span className="hidden 2xl:inline">{item.label}</span>
                      {item.href === "/notifications" && unread > 0 && <Dot />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={cn("ml-auto flex items-center gap-0.5 lg:ml-2 lg:border-l lg:pl-3", overHero ? "lg:border-cream/25" : "lg:border-line")}>
            <button onClick={openSearch} className={iconBtn} aria-label="Search">
              <Search className="size-5" />
            </button>
            <Link href="/notifications" className={cn(iconBtn, "lg:hidden")} aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}>
              <BellIcon />
              {unread > 0 && <Dot />}
            </Link>
            <Link href="/orders" className={iconBtn} aria-label={`Cart and orders (${count} in cart)`}>
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-on-accent">{count}</span>
              )}
            </Link>
            <AccountButton variant="a" light={overHero} />
          </div>
        </div>
      </header>
      <NavDrawer />
    </>
  );
}

function BellIcon() {
  const Icon = navigation.find((n) => n.href === "/notifications")!.icon;
  return <Icon className="size-5" />;
}

function Dot() {
  return <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent ring-2 ring-canvas" aria-hidden />;
}

function ToursMenu({
  item,
  className,
  pathname,
  bar,
  overHero,
}: {
  item: (typeof navigation)[number];
  className: string;
  pathname: string;
  bar: React.ReactNode;
  overHero: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((v) => !v)} className={className}>
        {item.label}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180", overHero && "opacity-80")} />
        {bar}
      </button>
      {open && (
        <div className="absolute top-full left-1/2 z-50 w-80 -translate-x-1/2 pt-2">
          <div className="rounded-2xl border border-line bg-paper p-2 shadow-lift">
            <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 hover:bg-sand">
              <span className="block text-sm font-semibold text-forest">All tours</span>
              <span className="block text-xs text-stone">{item.description}</span>
            </Link>
            {item.children!.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setOpen(false)}
                aria-current={isActivePath(pathname, c.href) ? "page" : undefined}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-sand"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-on-forest">
                  <c.icon className="size-[18px]" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-forest">{c.label}</span>
                  <span className="block text-xs text-stone">{c.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
