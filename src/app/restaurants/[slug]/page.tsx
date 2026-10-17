import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { ReserveButton } from "@/components/reserve-dialog";
import { HoursRow, RestaurantActions } from "@/components/restaurant-actions";
import { FeaturedCard } from "@/components/restaurant-card";
import { SaveButton } from "@/components/save-button";
import { Arrow, ButtonLink, Photo, Rating, SampleNote, SectionHeader } from "@/components/ui";
import { areaName, getMenu, getRestaurant, restaurants } from "@/lib/data";
import { distanceLabel, naira } from "@/lib/utils";

export function generateStaticParams() {
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/restaurants/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) return { title: "Not found" };
  return { title: r.name, description: `${r.type} in ${areaName(r.area)}, Owerri. ${r.description}` };
}

export default async function RestaurantPage({ params }: PageProps<"/restaurants/[slug]">) {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) notFound();

  const menu = getMenu(r);
  const popular = menu.filter((m) => m.section === "Signature Dishes").slice(0, 4);
  const related = restaurants.filter((x) => x.slug !== r.slug && x.categories.some((c) => r.categories.includes(c))).slice(0, 3);

  return (
    <>
      <div className="lg:container-x lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pt-8 xl:gap-16">
        {/* Cover */}
        <div>
          <Link href="/restaurants" className="group mb-4 hidden items-center gap-2 text-sm font-semibold text-stone hover:text-forest lg:inline-flex">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /> Food & Restaurants
          </Link>
          <div className="relative aspect-[4/3.3] overflow-hidden rounded-b-[1.75rem] lg:aspect-[4/3] lg:rounded-[1.75rem]">
            <Photo name={r.cover} alt={`${r.name} — ${r.type}`} sizes="(min-width: 1024px) 55vw, 100vw" priority />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent lg:hidden" />
            <Link
              href="/restaurants"
              aria-label="Back to restaurants"
              className="absolute top-4 left-4 grid size-10 place-items-center rounded-full bg-paper text-forest shadow-card lg:hidden"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <SaveButton slug={r.slug} name={r.name} variant="circle" className="absolute top-4 right-4" />
          </div>
          <ul className="mt-3 hidden grid-cols-3 gap-3 lg:grid">
            {r.gallery.slice(1, 4).map((g) => (
              <li key={g} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Photo name={g} alt={`${r.name} photo`} sizes="18vw" />
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div className="container-x pt-5 lg:w-auto lg:px-0 lg:pt-10">
          <h1 className="text-[2.1rem] leading-[1.08] font-semibold text-forest lg:text-5xl">{r.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.95rem] text-ink/80">
            <Rating value={r.rating} count={r.reviewCount} className="text-[0.95rem]" />
            <span className="text-stone">·</span>
            {r.type.split(" • ").join(" · ")}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[0.95rem] text-ink/80">
            <MapPin className="size-4 fill-forest text-paper" aria-hidden /> {distanceLabel(r.distanceKm)} · {areaName(r.area)}
          </p>

          <RestaurantActions restaurant={r} className="mt-6 max-w-sm" />

          <p className="mt-6 leading-relaxed text-ink/85">{r.description}</p>

          <div className="mt-5">
            <HoursRow restaurant={r} />
          </div>

          <ButtonLink href={`/restaurants/${r.slug}/menu`} size="lg" className="mt-6 w-full text-base">
            View menu
          </ButtonLink>
          {r.service === "Dine-in only" ? (
            <ReserveButton name={r.name} className="mt-3 w-full" />
          ) : (
            <p className="mt-3 text-center text-sm text-stone">{r.service} · order from the menu</p>
          )}
        </div>
      </div>

      {/* Popular dishes */}
      <section className="container-x pt-10 lg:pt-16">
        <SectionHeader title="Popular dishes" subtitle="Our most loved and recommended." href={`/restaurants/${r.slug}/menu`} linkLabel="Full menu" />
        <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
          {popular.map((m) => (
            <Link key={m.id} href={`/restaurants/${r.slug}/menu`} className="group w-[44%] shrink-0 snap-start sm:w-auto">
              <span className="relative block aspect-square overflow-hidden rounded-2xl">
                <Photo name={m.image} alt={m.name} sizes="(min-width: 640px) 25vw, 44vw" className="transition-transform duration-500 group-hover:scale-[1.04]" />
              </span>
              <span className="mt-2 block font-display font-semibold text-forest sm:text-lg">{m.name}</span>
              <span className="text-sm font-bold">{naira(m.price)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="container-x pt-10 lg:pt-16">
        <SectionHeader title="What people say" subtitle={`${r.rating.toFixed(1)} average from ${r.reviewCount.toLocaleString("en-US")} reviews`} />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {r.reviews.map((rev) => (
            <figure key={rev.author} className="rounded-[1.25rem] border border-line/70 bg-paper p-5 shadow-card">
              <Rating value={rev.rating} />
              <blockquote className="mt-2 font-display text-lg leading-snug text-forest">“{rev.text}”</blockquote>
              <figcaption className="mt-3 text-sm text-stone">
                {rev.author} · {rev.date}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {r.tags.map((t) => (
            <span key={t} className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
              {t}
            </span>
          ))}
        </div>
        <SampleNote className="mt-4">Sample listing — photos illustrate the style of venue and dishes, not this exact business.</SampleNote>
      </section>

      {related.length > 0 && (
        <section className="container-x py-10 lg:py-16">
          <SectionHeader title="You might also like" href="/restaurants" />
          <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {related.map((x) => (
              <FeaturedCard key={x.slug} restaurant={x} badge={null} className="w-[86%] shrink-0 snap-start sm:w-auto" />
            ))}
          </div>
          <div className="mt-6 lg:hidden">
            <ButtonLink href="/restaurants" variant="outline" className="w-full">
              Browse all restaurants <Arrow />
            </ButtonLink>
          </div>
        </section>
      )}
    </>
  );
}
