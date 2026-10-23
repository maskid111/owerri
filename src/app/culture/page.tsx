import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Moon, Sun, Sunrise } from "lucide-react";
import { ExploreCard } from "@/components/explore-card";
import { StoryCard } from "@/components/story-card";
import { Arrow, ButtonLink, Photo, SectionHeader } from "@/components/ui";
import { exploreItems, stories } from "@/lib/data";
import type { ImageName } from "@/lib/images";
import { Design } from "@/components/design";
import { SigCulture } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Culture & Stories",
  description: "Festivals, masquerades, music, art and stories — plus our guide to a perfect cultural weekend.",
};

const weekend: { day: string; image: ImageName; items: { icon: typeof Sun; time: string; title: string; text: string; href: string }[] }[] = [
  {
    day: "Friday",
    image: "abacha",
    items: [
      { icon: Sun, time: "Afternoon", title: "Abacha in the garden", text: "Ease in with African salad and a cold drink on Wetheral Road.", href: "/restaurants/amakas-abacha-garden" },
      { icon: Moon, time: "Night", title: "Douglas Road crawl", text: "Suya, pepper soup, then a shared bowl of nkwobi.", href: "/restaurants/douglas-road-nkwobi-house" },
    ],
  },
  {
    day: "Saturday",
    image: "green-terrace",
    items: [
      { icon: Sunrise, time: "Morning", title: "Coffee on the terrace", text: "Brunch and a slow coffee among the plants in Ikenegbu.", href: "/restaurants/the-green-terrace" },
      { icon: Moon, time: "Evening", title: "Rooftop fire-cooking", text: "Grills and palm-wine sours above the city lights.", href: "/restaurants/ember-room" },
    ],
  },
  {
    day: "Sunday",
    image: "lake-boats",
    items: [
      { icon: Sun, time: "Midday", title: "Lake day", text: "Drive out for wood-grilled fish and a boat ride on Oguta Lake.", href: "/restaurants/lakeside-fish-house" },
      { icon: Moon, time: "Evening", title: "Ofe Owerri, properly", text: "End the weekend with the city’s signature soup.", href: "/restaurants/uto-kitchen" },
    ],
  },
];

function CulturePage() {
  const whatsOn = exploreItems.filter((x) => x.kind === "event" && (x.categories.includes("Culture") || x.categories.includes("Music")));
  const culturalPlaces = exploreItems.filter((x) => x.kind === "place" && x.categories.includes("Culture"));

  return (
    <>
      {/* Photo hero */}
      <section className="lg:container-x lg:pt-6">
        <div className="relative isolate flex min-h-[17rem] items-end overflow-hidden rounded-b-[1.75rem] sm:min-h-[22rem] lg:min-h-[26rem] lg:rounded-[1.75rem]">
          <Photo name="festival" alt="Dancers in red and coral at a cultural festival procession" sizes="(min-width: 1024px) 1200px, 100vw" priority className="-z-10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/40 to-forest-deep/10" />
          <div className="p-5 text-cream sm:p-8 lg:p-12">
            <p className="text-xs font-bold tracking-[0.16em] text-leaf uppercase">Culture & Stories</p>
            <h1 className="mt-2 max-w-2xl text-[2.1rem] leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">The city beyond the plate.</h1>
            <p className="mt-3 max-w-xl text-cream/85">Festivals, masquerades, highlife nights, art and the stories behind them.</p>
          </div>
        </div>
      </section>

      {/* What's on */}
      <section className="container-x pt-9 lg:pt-16">
        <SectionHeader title="What’s on" subtitle="Cultural events and live music" href="/explore?cat=Culture" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whatsOn.map((e) => (
            <ExploreCard key={e.slug} item={e} />
          ))}
        </div>
      </section>

      {/* Mbari feature */}
      <section className="container-x pt-10 lg:pt-20">
        <div className="relative isolate grid overflow-hidden rounded-[1.5rem] bg-native-pattern text-cream lg:grid-cols-2 lg:rounded-[2rem]">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/20 to-forest-deep/70" aria-hidden />
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]">
            <Photo name="masquerade" alt="Igbo masquerades in carved masks and beaded costumes" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <p className="text-xs font-bold tracking-[0.16em] text-leaf uppercase">Heritage</p>
            <h2 className="mt-2 text-3xl leading-tight font-semibold sm:text-4xl">Mbari: art made as an offering to the earth.</h2>
            <p className="mt-4 leading-relaxed text-cream/80">
              Owerri’s Mbari houses — sacred structures filled with sculpted clay figures — remain one of the most celebrated art traditions in Igboland. Their spirit lives on in the
              city’s galleries, masquerades and workshops.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/stories/mbari-houses-for-the-earth" variant="cream">
                Read the story <Arrow />
              </ButtonLink>
              <ButtonLink href="/events?cat=Culture" variant="light">
                Cultural places
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural places */}
      <section className="container-x pt-10 lg:pt-16">
        <SectionHeader title="Places to experience" subtitle="Galleries, heritage and drumming" href="/explore?cat=Culture" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {culturalPlaces.map((p) => (
            <ExploreCard key={p.slug} item={p} />
          ))}
        </div>
      </section>

      {/* Weekend */}
      <section id="weekend" className="container-x scroll-mt-24 pt-10 lg:pt-20">
        <SectionHeader title="A perfect weekend in Owerri" subtitle="Three days, six stops. Save the places you like." />
        <div className="mt-4 grid gap-5 lg:grid-cols-3">
          {weekend.map((d) => (
            <div key={d.day} className="overflow-hidden rounded-[1.25rem] border border-line/70 bg-paper shadow-card">
              <div className="relative aspect-[16/8]">
                <Photo name={d.image} alt="" sizes="(min-width: 1024px) 380px, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 to-transparent" />
                <p className="absolute bottom-3 left-4 font-display text-3xl font-semibold text-cream">{d.day}</p>
              </div>
              <ol className="space-y-5 p-5">
                {d.items.map((it) => (
                  <li key={it.title} className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-tint text-forest">
                      <it.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.12em] text-stone uppercase">{it.time}</p>
                      <Link href={it.href} className="group inline-flex items-center gap-1 font-display text-lg font-semibold text-forest">
                        {it.title}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <p className="text-sm text-stone">{it.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="container-x py-10 lg:py-20">
        <SectionHeader title="Stories from the Heartland" subtitle="Food, heritage and city life" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return <Design a={<CulturePage />} b={<SigCulture />} />;
}
