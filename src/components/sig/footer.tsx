import Link from "next/link";
import { navigation } from "@/lib/navigation";
import { NewsletterForm } from "../newsletter-form";
import { SigWordmark } from "./ui";

const flat = navigation.flatMap((n) => [n, ...(n.children ?? [])]);
const more = [
  ["/explore", "Explore"],
  ["/restaurants", "Restaurants"],
  ["/dishes", "Dishes"],
  ["/culture", "Culture"],
  ["/neighbourhoods", "Neighbourhoods"],
  ["/orders", "Orders"],
  ["/credits", "Photo credits"],
  ["/admin", "Admin (prototype)"],
];

/** Version B footer: centred wordmark on the full-strength brand pattern. */
export function SigFooter() {
  return (
    <footer className="relative isolate mt-10 overflow-hidden rounded-t-[2.5rem] bg-native-pattern-lg text-white lg:rounded-t-[3.5rem]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/30 via-forest-deep/75 to-forest-deep" aria-hidden />
      <div className="container-x py-14 text-center lg:py-20">
        <SigWordmark light size="lg" />
        <p className="mx-auto mt-5 max-w-md text-white/80">Food, culture, places and experiences from Owerri and Imo State — all in one place.</p>
        <div className="mx-auto mt-7 flex max-w-md justify-center">
          <NewsletterForm dark />
        </div>
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3 text-[0.72rem] font-bold tracking-[0.16em] uppercase">
          {flat.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-white/85 transition-colors hover:text-leaf">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/60">
          {more.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="hover:text-white">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 h-px max-w-4xl bg-white/15" />
        <p className="mt-6 text-xs text-white/55">© 2026 Native Kitchen · Owerri, Imo State, Nigeria · Listings, menus, prices and events are sample content.</p>
      </div>
    </footer>
  );
}
