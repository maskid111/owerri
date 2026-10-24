import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, ChevronDown, Clock, Flame, Mail, Trees } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { AppearanceSettings } from "@/app/admin/appearance-settings";
import { ContactForm } from "@/app/help/contact-form";
import { SettingsView } from "@/app/settings/settings-view";
import { dishes, exploreItems, getMenu, relatedRestaurants, getRestaurant, getStory, marketSections, neighbourhoods, places, restaurants, stories, type MarketGroup } from "@/lib/data";
import type { FeedScope, FeedSort } from "@/lib/feed";
import { faqs } from "@/lib/help";
import type { ImageName } from "@/lib/images";
import { videoCredits, wikimediaCredits } from "@/lib/images";
import { cn } from "@/lib/utils";
import { OrdersView } from "../orders-view";
import { Photo } from "../ui";
import { SigExploreItem } from "./explore-item";
import { SigMenu } from "./menu";
import { SigRestaurants, SigRestaurantsFromParams } from "./restaurants";
import { SigFeed, SigScopedFeed } from "./feed";
import { FloatingCartBar } from "../food";
import { SigArrow, sigBtn, SigEyebrow, SigNote, SigPageHeader, SigRestaurantRow, SigSection, SigStoryFeature, SigStoryRow, SigTile } from "./ui";

/* ------------------------------------------------------------------ */
/* Discovery feed pages                                                */
/* ------------------------------------------------------------------ */

export function SigFeedPage({
  scope,
  eyebrow,
  title,
  description,
  image,
  defaultSort = "recommended",
}: {
  scope: FeedScope;
  eyebrow: string;
  title: ReactNode;
  description: string;
  image: ImageName;
  defaultSort?: FeedSort;
}) {
  return (
    <>
      <SigPageHeader eyebrow={eyebrow} title={title} description={description} image={image} />
      <Suspense fallback={<SigFeed scope={scope} initialSort={defaultSort} />}>
        <SigScopedFeed scope={scope} defaultSort={defaultSort} />
      </Suspense>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Farmers Market                                                      */
/* ------------------------------------------------------------------ */

const groups: { name: MarketGroup; id: string; blurb: string }[] = [
  { name: "Fresh Produce", id: "fresh-produce", blurb: "Yams, greens, tomatoes and peppers — picked this week." },
  { name: "Spices & Ingredients", id: "spices-ingredients", blurb: "The building blocks of Ofe Owerri, pepper soup and ofe akwu." },
  { name: "Crafts & Handmade", id: "crafts-handmade", blurb: "Pottery, weaving and fabric from local makers." },
];

export function SigMarket() {
  const kitchens = restaurants.filter((r) => r.categories.includes("Local") && r.service !== "Dine-in only").slice(0, 6);
  return (
    <>
      <SigPageHeader
        eyebrow="Farmers Market"
        title={
          <>
            From the farm, the pot
            <br className="hidden sm:block" /> and the maker’s hands
          </>
        }
        description="Order traditional food from local kitchens, then find the produce, spices and crafts that feel like home."
        image="market-women"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {marketSections.map((m) => (
            <Link key={m.name} href={m.href} className="rounded-full border border-line px-4 py-2 text-sm font-medium text-forest transition-colors hover:border-forest hover:bg-forest hover:text-on-forest">
              {m.name}
            </Link>
          ))}
        </div>
      </SigPageHeader>

      <SigSection eyebrow="Aisle 01" title="Traditional Food" href="/restaurants?category=Local" anchor="traditional-food" className="pt-14">
        <div className="grid-cols-1 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <SigTile href="/dishes" title="Learn the signature dishes" subtitle="Ofe Owerri, nkwobi, abacha and more" image="egusi" aspect="aspect-[4/3] lg:aspect-[4/3.6]" />
          <div className="grid-cols-1 grid content-start gap-3">
            {kitchens.map((r) => (
              <SigRestaurantRow key={r.slug} restaurant={r} />
            ))}
          </div>
        </div>
      </SigSection>

      {groups.map((g, i) => {
        const stalls = places.filter((p) => p.marketGroup === g.name).map((p) => exploreItems.find((x) => x.slug === p.slug)!);
        return (
          <SigSection key={g.id} eyebrow={`Aisle 0${i + 2}`} title={g.name} anchor={g.id} className="pt-14">
            <p className="-mt-2 mb-5 text-stone">{g.blurb}</p>
            <div className="grid-cols-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stalls.map((s) => (
                <SigExploreItem key={s.slug} item={s} />
              ))}
            </div>
          </SigSection>
        );
      })}

      <section className="container-x pt-14">
        <SigPatternBand eyebrow="Cook it at home" title="Bring the market to your kitchen." href="/dishes" cta="Dish guide" image="spices-2">
          Ehu for Ofe Owerri, uziza for pepper soup, ogiri for ofe nsala — our dish guide explains each ingredient.
        </SigPatternBand>
      </section>
      <SigNote>Stalls, prices and opening hours are sample content for this preview.</SigNote>
    </>
  );
}

/** Pattern band with a circular photo — Version B's promotional banner. */
export function SigPatternBand({ eyebrow, title, children, href, cta, image }: { eyebrow: string; title: string; children: ReactNode; href: string; cta: string; image: ImageName }) {
  return (
    <div className="relative isolate flex flex-col items-center gap-8 overflow-hidden rounded-[2rem] bg-native-pattern-lg p-7 text-white sm:flex-row sm:p-10 lg:rounded-[2.75rem] lg:p-14">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/85 via-forest-deep/50 to-forest-deep/20" aria-hidden />
      <div className="flex-1">
        <SigEyebrow light>{eyebrow}</SigEyebrow>
        <h2 className="mt-3 text-3xl leading-tight text-white sm:text-5xl">{title}</h2>
        <p className="mt-3 max-w-lg text-white/85">{children}</p>
        <Link href={href} className={sigBtn("white", "mt-6")}>
          {cta} <SigArrow />
        </Link>
      </div>
      <div className="relative size-52 shrink-0 overflow-hidden rounded-full border-[6px] border-white/80 shadow-lift sm:size-64">
        <Photo name={image} alt="" sizes="256px" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tours                                                               */
/* ------------------------------------------------------------------ */

export function SigTours() {
  const stays = exploreItems.filter((x) => x.label === "Getaway" || x.label === "Stay");
  const nature = exploreItems.filter((x) => x.label === "Nature");
  return (
    <>
      <SigPageHeader eyebrow="Tours" title="Slow down. Look around." description="Lodges in the palms, lakes at sunset and forest rivers — all within easy reach." image="green-hills">
        <div className="flex justify-center gap-3">
          <Link href="/tours/stays" className={sigBtn("solid")}>
            <BedDouble className="size-4" /> Stays & Getaways
          </Link>
          <Link href="/tours/nature" className={sigBtn("outline")}>
            <Trees className="size-4" /> Nature & Places
          </Link>
        </div>
      </SigPageHeader>
      <SigSection eyebrow="Tours" title="Stays & Getaways" href="/tours/stays" className="pt-14">
        <div className="grid-cols-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stays.slice(0, 4).map((x) => (
            <SigExploreItem key={x.slug} item={x} aspect="aspect-[3/4]" />
          ))}
        </div>
      </SigSection>
      <SigSection eyebrow="Tours" title="Nature & Places" href="/tours/nature" className="pt-14">
        <div className="grid-cols-1 grid gap-3 md:grid-cols-2">
          {nature.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant="row" />
          ))}
        </div>
      </SigSection>
      <section className="container-x pt-14">
        <SigPatternBand eyebrow="Weekend plan" title="Three days, six stops." href="/culture" cta="See culture & weekend ideas" image="lake-sunset">
          Pair a lakeside afternoon with the city’s best kitchens and a night of live highlife.
        </SigPatternBand>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Blog, stories, culture                                              */
/* ------------------------------------------------------------------ */

export function SigBlog() {
  const [lead, ...rest] = stories;
  return (
    <>
      <SigPageHeader eyebrow="Discover" title="Stories beyond the plate" description="Food, heritage and the people who keep local traditions alive." image="masquerade" />
      <SigSection eyebrow="Featured" title="Read this first" className="pt-14">
        <div className="grid-cols-1 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <SigStoryFeature story={lead} />
          <div>
            {rest.map((s, i) => (
              <SigStoryRow key={s.slug} story={s} index={i} />
            ))}
          </div>
        </div>
      </SigSection>
      <section className="container-x pt-14">
        <SigPatternBand eyebrow="Our story" title="Native, beyond the plate." href="/culture" cta="Culture & heritage" image="farm-woman">
          Native started with food and grew into a guide to everything around the table: markets, makers, festivals and places.
        </SigPatternBand>
      </section>
    </>
  );
}

export async function SigStory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const more = stories.filter((s) => s.slug !== story.slug);
  return (
    <article>
      <SigPageHeader eyebrow={`${story.category} · ${story.readTime}`} title={story.title} description={story.dek} image={story.image}>
        <p className="text-sm text-stone">
          {story.author} · {story.date}
        </p>
      </SigPageHeader>
      <div className="container-x grid grid-cols-1 gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <div className="max-w-2xl">
          {story.body.map((b, i) => (
            <div key={i} className="mb-8">
              {b.heading && <h2 className="mb-2 text-2xl text-forest sm:text-3xl">{b.heading}</h2>}
              <p className={cn("leading-relaxed", i === 0 ? "border-l-4 border-forest pl-5 text-xl font-semibold text-forest" : "text-lg text-ink/85")}>{b.text}</p>
            </div>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SigEyebrow>More stories</SigEyebrow>
          <div className="mt-2">
            {more.map((s) => (
              <SigStoryRow key={s.slug} story={s} />
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}

export function SigCulture() {
  const whatsOn = exploreItems.filter((x) => x.kind === "event" && (x.categories.includes("Culture") || x.categories.includes("Music")));
  const culturalPlaces = exploreItems.filter((x) => x.kind === "place" && x.categories.includes("Culture"));
  return (
    <>
      <SigPageHeader eyebrow="Culture & Heritage" title="The city beyond the plate" description="Festivals, masquerades, highlife nights, art and the stories behind them." image="festival" />
      <SigSection eyebrow="What’s on" title="Culture & music" href="/events?cat=Culture" className="pt-14">
        <div className="grid-cols-1 grid gap-4 md:grid-cols-2">
          {whatsOn.map((x) => (
            <SigExploreItem key={x.slug} item={x} variant="ticket" />
          ))}
        </div>
      </SigSection>
      <section className="container-x pt-14" data-anchor="weekend">
        <SigPatternBand eyebrow="Heritage" title="Mbari: art made as an offering to the earth." href="/stories/mbari-houses-for-the-earth" cta="Read the story" image="masquerade">
          Owerri’s Mbari houses remain one of the most celebrated art traditions in Igboland; their spirit lives on in galleries, masquerades and workshops.
        </SigPatternBand>
      </section>
      <SigSection eyebrow="Visit" title="Places to experience" className="pt-14">
        <div className="grid-cols-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {culturalPlaces.map((x) => (
            <SigExploreItem key={x.slug} item={x} />
          ))}
        </div>
      </SigSection>
      <SigSection eyebrow="Read" title="Stories from the Heartland" href="/blog" className="pt-14">
        <div className="grid-cols-1 grid gap-x-10 md:grid-cols-2">
          {stories.map((s) => (
            <SigStoryRow key={s.slug} story={s} />
          ))}
        </div>
      </SigSection>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Dishes & neighbourhoods                                             */
/* ------------------------------------------------------------------ */

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

export function SigDishes() {
  return (
    <>
      <SigPageHeader eyebrow="Dish guide" title="Signature dishes" description="What’s in them, how to eat them, and where to order the best versions." image="soups-spread">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:flex-wrap sm:justify-center">
          {dishes.map((d) => (
            <a key={d.slug} href={`#${d.slug}`} className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium text-forest transition-colors hover:border-forest hover:bg-forest hover:text-on-forest">
              {d.name}
            </a>
          ))}
        </div>
      </SigPageHeader>
      <div className="container-x grid grid-cols-1 gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((d) => {
          const where = restaurants.filter((r) => getMenu(r).some((m) => (menuIds[d.slug] ?? []).includes(m.id))).slice(0, 2);
          return (
            <article key={d.slug} data-anchor={d.slug} className="scroll-mt-28 overflow-hidden rounded-[1.6rem] bg-paper shadow-card">
              <div className="relative aspect-square">
                <Photo name={d.image} alt={d.name} sizes="(min-width: 1024px) 33vw, 50vw" />
                <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-forest-deep">{d.kind}</span>
                <span className="absolute top-3 right-3 flex gap-0.5 rounded-full bg-forest-deep/80 px-2 py-1">
                  {[1, 2, 3].map((n) => (
                    <Flame key={n} className={cn("size-3.5", n <= d.heat ? "fill-leaf text-leaf" : "text-white/30")} />
                  ))}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-2xl text-forest">{d.name}</h2>
                {d.igbo && <p className="text-xs font-semibold text-forest-light">{d.igbo}</p>}
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-ink/80">{d.description}</p>
                <p className="mt-3 text-xs text-stone">
                  <span className="font-bold text-forest">Best with:</span> {d.bestWith}
                </p>
                {where.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {where.map((r) => (
                      <Link key={r.slug} href={`/restaurants/${r.slug}/menu`} className="rounded-full bg-mint px-3 py-1.5 text-xs font-bold text-forest hover:bg-forest hover:text-on-forest">
                        Order at {r.name}
                      </Link>
                    ))}
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

export function SigNeighbourhoods() {
  return (
    <>
      <SigPageHeader eyebrow="Owerri, area by area" title="Neighbourhoods" description="Leafy lunch spots, late-night streets and a lake worth the drive." image="rooftop-lights" />
      <div className="container-x space-y-5 py-12">
        {neighbourhoods.map((n, i) => {
          const spots = restaurants.filter((r) => r.area === n.slug).slice(0, 3);
          return (
            <article key={n.slug} data-anchor={n.slug} className={cn("grid scroll-mt-28 overflow-hidden rounded-[1.75rem] bg-paper shadow-card md:grid-cols-[1fr_1.3fr]", i % 2 === 1 && "md:[&>*:first-child]:order-2")}>
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[16rem]">
                <Photo name={n.image} alt={n.name} sizes="(min-width: 768px) 45vw, 100vw" />
              </div>
              <div className="p-6 sm:p-8">
                <SigEyebrow>{n.vibe}</SigEyebrow>
                <h2 className="mt-2 text-3xl text-forest">{n.name}</h2>
                <p className="mt-2 text-ink/80">{n.description}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-stone">
                  <Clock className="size-4" /> Best time: <span className="font-bold text-forest">{n.bestTime}</span>
                </p>
                {spots.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {spots.map((r) => (
                      <SigRestaurantRow key={r.slug} restaurant={r} />
                    ))}
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

/* ------------------------------------------------------------------ */
/* Utility pages                                                       */
/* ------------------------------------------------------------------ */

export function SigCredits() {
  return (
    <>
      <SigPageHeader eyebrow="Photography" title="Photo credits" description="Photos illustrate dishes, venues and moods — not the specific sample businesses or events listed." />
      <div className="container-x grid grid-cols-1 max-w-4xl gap-5 py-12">
        <div className="rounded-[1.6rem] bg-paper p-6 shadow-card">
          <h2 className="text-xl text-forest">Homepage video</h2>
          {videoCredits.map((v) => (
            <p key={v.file} className="mt-2 text-sm text-ink/85">
              <span className="font-bold">{v.title}</span> — {v.author}.
            </p>
          ))}
        </div>
        <div className="rounded-[1.6rem] bg-paper p-6 shadow-card">
          <h2 className="text-xl text-forest">Unsplash</h2>
          <p className="mt-2 text-sm text-ink/85">
            Most photographs are from Unsplash and used under the{" "}
            <a className="font-bold underline underline-offset-4" href="https://unsplash.com/license" target="_blank" rel="noreferrer">
              Unsplash License
            </a>
            .
          </p>
        </div>
        <div className="rounded-[1.6rem] bg-paper p-6 shadow-card">
          <h2 className="text-xl text-forest">Wikimedia Commons (CC BY-SA 4.0, resized)</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {wikimediaCredits.map((c) => (
              <li key={c.image} className="flex items-center gap-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full">
                  <Photo name={c.image} alt={c.title} sizes="56px" />
                </span>
                <span className="min-w-0 text-sm">
                  <a href={c.url} target="_blank" rel="noreferrer" className="block truncate font-bold text-forest underline underline-offset-4">
                    {c.title}
                  </a>
                  <span className="text-stone">by {c.author}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function SigSettings() {
  return (
    <>
      <SigPageHeader eyebrow="Your preferences" title="Settings" description="Preferences are stored in this browser only — there are no accounts in this preview." />
      <div className="pt-6">
        <SettingsView chrome={false} />
      </div>
    </>
  );
}

export function SigOrders() {
  return (
    <>
      <SigPageHeader eyebrow="Cart & checkout" title="Orders" description="Your cart, checkout and past orders from local kitchens." />
      <div className="pt-8">
        <OrdersView chrome={false} />
      </div>
    </>
  );
}

export function SigHelp() {
  return (
    <>
      <SigPageHeader eyebrow="We’re here to help" title="Help / Support" description="Quick answers, and a way to reach the Native team." />
      <div className="container-x py-12">
        <div className="grid-cols-1 grid gap-4 md:grid-cols-2">
          {faqs.map((f, i) => (
            <details key={f.q} className="group rounded-[1.4rem] bg-paper p-5 shadow-card open:ring-2 open:ring-forest">
              <summary className="flex cursor-pointer list-none items-start gap-4 [&::-webkit-details-marker]:hidden">
                <span className="text-2xl leading-none font-extrabold text-tint">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-bold text-forest">{f.q}</span>
                <ChevronDown className="mt-0.5 size-5 shrink-0 text-forest transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 pl-12 text-sm leading-relaxed text-ink/80">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-native-pattern-lg p-8 text-white">
            <div className="absolute inset-0 -z-10 bg-forest-deep/70" aria-hidden />
            <Mail className="size-8 text-leaf" />
            <h2 className="mt-4 text-3xl text-white">Still need a hand?</h2>
            <p className="mt-2 text-white/80">Send us a note about an order, a ticket or a listing. This prototype validates the form but doesn’t send it anywhere.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/orders" className={sigBtn("white", "h-10")}>
                Your orders
              </Link>
              <Link href="/settings" className={sigBtn("ghost", "h-10")}>
                Settings
              </Link>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </>
  );
}

export function SigAdmin() {
  return (
    <>
      <SigPageHeader eyebrow="Admin · Prototype" title="Website Design Selector" description="Choose which complete design system this browser shows." />
      <AppearanceSettings chrome={false} />
    </>
  );
}

export function SigNotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="text-[7rem] leading-none font-extrabold text-tint sm:text-[10rem]">404</span>
      <h1 className="-mt-4 text-3xl text-forest sm:text-5xl">This plate has been cleared</h1>
      <p className="mt-3 max-w-md text-stone">The page you’re looking for doesn’t exist — but there’s plenty more to explore.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={sigBtn("solid")}>
          Back home <SigArrow />
        </Link>
        <Link href="/explore" className={sigBtn("outline")}>
          Explore
        </Link>
      </div>
    </section>
  );
}

export function SigRestaurantsPage() {
  return (
    <>
      <SigPageHeader eyebrow="Order food" title="Restaurants" description="Find a restaurant or a dish and order from local kitchens for delivery or pickup." />
      <Suspense fallback={<SigRestaurants />}>
        <SigRestaurantsFromParams />
      </Suspense>
      <FloatingCartBar />
    </>
  );
}

export async function SigMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) notFound();
  return <SigMenu restaurant={r} menu={getMenu(r)} related={relatedRestaurants(slug, 4)} />;
}
