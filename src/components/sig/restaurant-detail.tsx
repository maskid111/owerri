import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { getMenu, getRestaurant, locationLabel, restaurants } from "@/lib/data";
import { naira } from "@/lib/utils";
import { ReserveButton } from "../reserve-dialog";
import { HoursRow, RestaurantActions } from "../restaurant-actions";
import { SaveButton } from "../save-button";
import { Photo, ProfileNotice } from "../ui";
import { SigArrow, sigBtn, SigEyebrow, SigRestaurantCard, SigSection } from "./ui";

/** Version B restaurant profile. */
export async function SigRestaurantDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) notFound();
  const signature = getMenu(r).filter((m) => m.section === "Signature Dishes");
  const related = restaurants.filter((x) => x.slug !== r.slug && x.categories.some((c) => r.categories.includes(c))).slice(0, 4);

  return (
    <>
      <section className="relative isolate flex min-h-[26rem] items-end overflow-hidden bg-forest-deep text-white lg:min-h-[34rem]">
        <Photo name={r.cover} alt={`${r.name} — ${r.type}`} sizes="100vw" priority className="-z-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-forest-deep/20" />
        <Link href="/restaurants" className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-forest-deep lg:top-6 lg:left-8">
          <ArrowLeft className="size-4" /> Restaurants
        </Link>
        <SaveButton slug={r.slug} name={r.name} variant="circle" className="absolute top-4 right-4 lg:top-6 lg:right-8" />
        <div className="container-x pb-10 lg:pb-14">
          <SigEyebrow light>{r.type.replace(/ • /g, " · ")}</SigEyebrow>
          <h1 className="mt-3 max-w-3xl text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">{r.name}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">{r.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-bold text-forest-deep">
              {r.reviewCount ? (
                <>
                  <Star className="size-4 fill-accent text-accent" /> {r.rating.toFixed(1)} · {r.reviewCount} reviews
                </>
              ) : (
                "New on Native"
              )}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5">
              <MapPin className="size-4" /> {locationLabel(r)}
            </span>
            <span className="rounded-full border border-white/30 px-3 py-1.5">{r.service}</span>
          </div>
        </div>
      </section>

      <div className="container-x grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_24rem] lg:py-14">
        <div>
          <SigEyebrow>About</SigEyebrow>
          <p className="mt-3 text-xl leading-relaxed text-ink/90">{r.description}</p>
          <ProfileNotice restaurant={r} className="mt-5" />
          <div className="mt-5 flex flex-wrap gap-2">
            {r.tags.map((t) => (
              <span key={t} className="rounded-full border-2 border-line px-3 py-1 text-xs font-bold text-forest">
                {t}
              </span>
            ))}
          </div>

          <div data-anchor="dishes" className="mt-12 flex scroll-mt-28 items-end justify-between border-b border-line pb-3">
            <h2 className="text-3xl text-forest">Signature dishes</h2>
            <Link href={`/restaurants/${r.slug}/menu`} className="text-xs font-semibold text-forest underline underline-offset-4">
              Full menu
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {signature.map((m) => (
              <li key={m.id}>
                <Link href={`/restaurants/${r.slug}/menu`} className="group flex items-center gap-4 py-4">
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold text-forest">{m.name}</span>
                    <span className="line-clamp-2 block text-sm text-stone">{m.note}</span>
                  </span>
                  <span className="font-extrabold text-forest">{naira(m.price)}</span>
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-full">
                    <Photo name={m.image} alt={m.name} sizes="80px" className="transition-transform duration-500 group-hover:scale-110" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid grid-cols-3 gap-3">
            {r.gallery.map((g, i) => (
              <div key={g} className={i === 0 ? "relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-2xl" : "relative aspect-square overflow-hidden rounded-2xl"}>
                <Photo name={g} alt={`${r.name} photo`} sizes="(min-width: 1024px) 30vw, 60vw" />
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-3xl text-forest">What people say</h2>
          {r.reviews.length === 0 && <p className="mt-3 text-stone">No reviews yet — {r.name} is new on Native.</p>}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {r.reviews.map((rev) => (
              <figure key={rev.author} className="rounded-2xl bg-forest p-5 text-on-forest">
                <p className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={i < rev.rating ? "size-4 fill-current" : "size-4 opacity-30"} />
                  ))}
                </p>
                <blockquote className="mt-3 text-lg leading-snug font-semibold">“{rev.text}”</blockquote>
                <figcaption className="mt-3 text-xs font-semibold opacity-70">
                  {rev.author} · {rev.date}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.75rem] bg-paper p-5 shadow-lift">
            <RestaurantActions restaurant={r} />
            <div className="mt-5">
              <HoursRow restaurant={r} />
            </div>
            {r.service === "Dine-in only" ? (
              <Link href={`/restaurants/${r.slug}/menu`} className={sigBtn("solid", "mt-5 h-12 w-full")}>
                View menu <SigArrow />
              </Link>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href="#dishes" className={sigBtn("outline", "h-12")}>
                  View menu
                </Link>
                <Link href={`/restaurants/${r.slug}/menu`} className={sigBtn("solid", "h-12")}>
                  Order now
                </Link>
              </div>
            )}
            {r.service === "Dine-in only" && <ReserveButton name={r.name} className="mt-3 w-full" />}
            <p className="mt-3 text-center text-xs text-stone">{r.address}</p>
          </div>
        </aside>
      </div>

      {/* Mobile: keep ordering one tap away while reading the profile */}
      {r.service !== "Dine-in only" && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
          <Link href={`/restaurants/${r.slug}/menu`} className={sigBtn("solid", "h-12 w-full")}>
            Order now <SigArrow />
          </Link>
        </div>
      )}

      {related.length > 0 && (
        <SigSection eyebrow="Keep exploring" title="You might also like" href="/restaurants" className="pb-24 lg:pb-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((x) => (
              <SigRestaurantCard key={x.slug} restaurant={x} />
            ))}
          </div>
        </SigSection>
      )}
    </>
  );
}
