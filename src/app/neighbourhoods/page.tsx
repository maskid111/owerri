import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHeader, Photo } from "@/components/ui";
import { neighbourhoods, places, restaurants } from "@/lib/data";

export const metadata: Metadata = {
  title: "Neighbourhoods",
  description: "Get to know Owerri, Imo State by area — where to eat, drink and spend time in Ikenegbu, New Owerri, Douglas Road and beyond.",
};

export default function NeighbourhoodsPage() {
  return (
    <>
      <PageHeader title="Neighbourhoods" description="Leafy lunch spots, late-night streets and a lake worth the drive — here’s Owerri, area by area." />
      <section className="container-x grid gap-5 py-6 md:grid-cols-2 lg:py-10">
        {neighbourhoods.map((n, i) => {
          const spots = [...restaurants.filter((r) => r.area === n.slug).map((r) => ({ name: r.name, href: `/restaurants/${r.slug}` })), ...places.filter((p) => p.area === n.slug).map((p) => ({ name: p.name, href: `/explore?item=${p.slug}` }))].slice(0, 4);
          return (
            <article key={n.slug} id={n.slug} className="scroll-mt-24 overflow-hidden rounded-[1.25rem] border border-line/70 bg-paper shadow-card">
              <div className="relative aspect-[16/9]">
                <Photo name={n.image} alt={`${n.name}, Owerri`} sizes="(min-width: 768px) 50vw, 100vw" priority={i < 2} />
                <span className="absolute top-3 left-3 rounded-md bg-forest px-2 py-1 text-[11px] font-bold text-cream">{n.vibe}</span>
              </div>
              <div className="p-5 sm:p-6">
                <h2 className="text-2xl font-semibold text-forest sm:text-3xl">{n.name}</h2>
                <p className="mt-2 leading-relaxed text-ink/85">{n.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {n.knownFor.map((k) => (
                    <span key={k} className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-forest">
                      {k}
                    </span>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-ink/80">
                  <Clock className="size-4 text-forest" /> Best time: <span className="font-semibold">{n.bestTime}</span>
                </p>
                {spots.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                    {spots.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className="group flex items-center justify-between text-sm font-semibold text-forest">
                          {s.name}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
