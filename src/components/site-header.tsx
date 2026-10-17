"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useSaved } from "@/lib/saved-store";
import { cn } from "@/lib/utils";
import { openSearch, SearchDialog } from "./search-dialog";
import { Logo } from "./ui";

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/restaurants", label: "Food & Drink" },
  { href: "/dishes", label: "Dishes" },
  { href: "/neighbourhoods", label: "Neighbourhoods" },
  { href: "/culture", label: "Culture" },
];

/** Restaurant detail and menu screens are immersive on mobile (own floating controls, no app bar). */
export const isImmersive = (pathname: string) => /^\/restaurants\/[^/]+(\/menu)?$/.test(pathname);

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { saved } = useSaved();
  const { count } = useCart();
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn = cn(
    "relative grid size-10 place-items-center rounded-full transition-colors",
    overHero ? "text-cream hover:bg-cream/10" : "text-forest hover:bg-forest/5",
  );

  return (
    <>
      <header
        className={cn(
          "inset-x-0 top-0 z-50 transition-colors duration-300",
          pathname === "/" ? "fixed" : "sticky",
          overHero ? "bg-transparent" : "border-b border-line/70 bg-cream/95 backdrop-blur",
          isImmersive(pathname) && "max-lg:hidden",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[72px]">
          <Link href="/" aria-label="Owerri home" className="shrink-0">
            <Logo light={overHero} tagline={pathname === "/"} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors xl:px-4",
                    overHero ? (active ? "text-sun" : "text-cream/80 hover:text-cream") : active ? "text-forest" : "text-ink/60 hover:text-forest",
                  )}
                >
                  {item.label}
                  {active && <span className={cn("absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full", overHero ? "bg-sun" : "bg-forest")} />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={openSearch}
              className={cn(
                "mr-1 hidden h-10 items-center gap-2.5 rounded-full border pr-2 pl-4 text-sm transition-colors xl:inline-flex",
                overHero ? "border-cream/25 text-cream/80 hover:border-cream/50" : "border-line bg-paper text-stone hover:border-forest/30",
              )}
            >
              <Search className="size-4" aria-hidden />
              Search Owerri
              <kbd className={cn("rounded-md px-1.5 py-0.5 font-sans text-[11px] font-semibold", overHero ? "bg-cream/10" : "bg-sand text-ink/60")}>⌘K</kbd>
            </button>
            <button onClick={openSearch} className={cn(iconBtn, "xl:hidden")} aria-label="Search">
              <Search className="size-[22px]" />
            </button>
            <Link href="/saved" className={cn(iconBtn, "hidden lg:grid")} aria-label={`Saved (${saved.length})`}>
              <Heart className="size-5" />
              {saved.length > 0 && <Badge>{saved.length}</Badge>}
            </Link>
            <Link href="/orders" className={iconBtn} aria-label={`Cart and orders (${count} in cart)`}>
              <ShoppingBag className="size-5" />
              {count > 0 && <Badge>{count}</Badge>}
            </Link>
          </div>
        </div>
      </header>
      <SearchDialog />
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-sun px-1 text-[10px] font-bold text-forest-deep">
      {children}
    </span>
  );
}
