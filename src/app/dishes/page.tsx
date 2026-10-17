import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { chipClass, PageHeader, Photo } from "@/components/ui";
import { dishes, getMenu, restaurants } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Signature Dishes",
  description: "A field guide to Owerri’s essential dishes — Ofe Owerri, nkwobi, abacha, egusi, isi ewu and more — and where to order them.",
};

/** Menu catalogue ids that correspond to each dish, used for "Where to order". */
const menuIds: Record<string, string[]> = {
  "ofe-owerri": ["ofe-owerri"],
  nkwobi: ["nkwobi"],
  abacha: ["abacha-ugba"],
  egusi: ["egusi-pounded-yam"],
  "isi-ewu": ["isi-ewu"],
  "ofe-nsala": ["ofe-nsala"],
  "pepper-soup": ["goat-pepper-soup"],
  suya: ["beef-suya", "suya-platter"],
};

const heatLabel = ["Mild", "Gentle warmth", "Spicy", "Fiery"];

export default function DishesPage() {
  return (
    <>
      <PageHeader title="Signature dishes" description="The soups, small chops and grills that define Owerri — what’s in them, how to eat them, and where to order the best versions.">
        <nav aria-label="Jump to dish" className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {dishes.map((d) => (
            <a key={d.slug} href={`#${d.slug}`} className={chipClass(false)}>
              {d.name}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="container-x space-y-5 py-6 lg:space-y-8 lg:py-10">
        {dishes.map((d, i) => {
          const ids = menuIds[d.slug] ?? [];
          const where = restaurants.filter((r) => getMenu(r).some((m) => ids.includes(m.id))).slice(0, 3);
          return (
            <article
              key={d.slug}
              id={d.slug}
              className="grid scroll-mt-24 overflow-hidden rounded-[1.25rem] border border-line/70 bg-paper shadow-card md:grid-cols-2 lg:rounded-[1.75rem]"
            >
              <div className={cn("relative aspect-[4/3] md:aspect-auto md:min-h-[22rem]", i % 2 === 1 && "md:order-2")}>
                <Photo name={d.image} alt={d.name} sizes="(min-width: 768px) 50vw, 100vw" priority={i === 0} />
              </div>
              <div className="flex flex-col p-5 sm:p-8">
                <p className="text-xs font-bold tracking-[0.14em] text-forest-light uppercase">{d.kind}</p>
                <h2 className="mt-1 text-3xl font-semibold text-forest sm:text-4xl">{d.name}</h2>
                {d.igbo && <p className="font-display text-lg text-stone italic">{d.igbo}</p>}
                <p className="mt-3 leading-relaxed text-ink/85">{d.description}</p>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs font-bold tracking-[0.12em] text-stone uppercase">Heat</dt>
                    <dd className="mt-1 flex items-center gap-0.5">
                      {[1, 2, 3].map((n) => (
                        <Flame key={n} className={cn("size-4", n <= d.heat ? "fill-sun text-sun-deep" : "text-ink/20")} />
                      ))}
                      <span className="ml-1.5 font-semibold">{heatLabel[d.heat]}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-[0.12em] text-stone uppercase">Best with</dt>
                    <dd className="mt-1 font-semibold">{d.bestWith}</dd>
                  </div>
                </dl>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {d.ingredients.map((ing) => (
                    <li key={ing} className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-forest">
                      {ing}
                    </li>
                  ))}
                </ul>
                {where.length > 0 && (
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="text-xs font-bold tracking-[0.12em] text-stone uppercase">Where to order</p>
                    <ul className="mt-2 space-y-1.5">
                      {where.map((r) => (
                        <li key={r.slug}>
                          <Link href={`/restaurants/${r.slug}/menu`} className="group flex items-center justify-between gap-4 text-sm font-semibold text-forest">
                            {r.name}
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
