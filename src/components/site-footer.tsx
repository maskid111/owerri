import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";
import { Logo } from "./ui";

const columns = [
  {
    title: "Discover",
    links: [
      { href: "/explore", label: "Explore Owerri" },
      { href: "/restaurants", label: "Food & restaurants" },
      { href: "/explore?cat=Stays", label: "Hotels & stays" },
      { href: "/explore?cat=Events", label: "Events" },
    ],
  },
  {
    title: "Culture",
    links: [
      { href: "/culture", label: "Culture & stories" },
      { href: "/dishes", label: "Signature dishes" },
      { href: "/neighbourhoods", label: "Neighbourhoods" },
      { href: "/culture#weekend", label: "A weekend in Owerri" },
    ],
  },
  {
    title: "Your Owerri",
    links: [
      { href: "/saved", label: "Saved places" },
      { href: "/orders", label: "Cart & orders" },
      { href: "/credits", label: "Photo credits" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="container-x py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo light tagline />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/65">
              Discover the flavours, people and places that make Owerri, Imo State special — from steel-pot bukas to rooftop dinners.
            </p>
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">Weekend picks in your inbox</p>
              <NewsletterForm dark />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-bold tracking-[0.16em] text-sun uppercase">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-cream/70 transition-colors hover:text-cream">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row sm:justify-between">
          <p>© 2026 Owerri · Owerri, Imo State, Nigeria</p>
          <p>Listings, menus, prices and events are sample content for this preview.</p>
        </div>
      </div>
    </footer>
  );
}
