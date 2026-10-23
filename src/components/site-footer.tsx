import Link from "next/link";
import { navigation } from "@/lib/navigation";
import { NewsletterForm } from "./newsletter-form";
import { Logo } from "./ui";

const flat = navigation.flatMap((n) => [n, ...(n.children ?? [])]);

const columns = [
  { title: "Discover", links: flat.slice(0, 7) }, // Home … Events & Hangouts, in nav order
  { title: "You", links: flat.slice(7) }, // Saved … Help / Support
  {
    title: "More",
    links: [
      { href: "/explore", label: "Explore everything" },
      { href: "/dishes", label: "Signature dishes" },
      { href: "/culture", label: "Culture & heritage" },
      { href: "/orders", label: "Cart & orders" },
      { href: "/credits", label: "Photo credits" },
      { href: "/admin", label: "Admin (prototype)" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-native-pattern-lg text-cream">
      {/* The supplied pattern, darkened for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-forest-deep/60" aria-hidden />
      <div className="container-x py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">
              Food, culture, places and experiences — all in one place. Native, beyond the plate.
            </p>
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">Weekend picks in your inbox</p>
              <NewsletterForm dark />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-bold tracking-[0.16em] text-leaf uppercase">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-cream/75 transition-colors hover:text-cream">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-cream/15 pt-6 text-xs text-cream/60 sm:flex-row sm:justify-between">
          <p>© 2026 Native</p>
          <p>Listings, menus, prices and events are sample content for this preview.</p>
        </div>
      </div>
    </footer>
  );
}
