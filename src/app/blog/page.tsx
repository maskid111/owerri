import type { Metadata } from "next";
import Link from "next/link";
import { PatternBanner, PhotoHero } from "@/components/native";
import { StoryCard } from "@/components/story-card";
import { Arrow, ButtonLink, Photo, SectionHeader } from "@/components/ui";
import { stories } from "@/lib/data";
import { Design } from "@/components/design";
import { SigBlog } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories about food, heritage, places and city life from Owerri, Imo State.",
};

function BlogPage() {
  const [lead, ...rest] = stories;
  return (
    <>
      <PhotoHero
        eyebrow="The Native Blog"
        title="Stories beyond the plate."
        description="Food, heritage and the people who keep Owerri’s traditions alive."
        image="masquerade"
        imageAlt="Igbo masquerades in carved masks and beaded costumes"
        pattern
      />

      <section className="container-x pt-8 lg:pt-14">
        <Link href={`/stories/${lead.slug}`} className="group grid overflow-hidden rounded-[1.5rem] border border-line/70 bg-paper shadow-card md:grid-cols-2">
          <span className="relative block aspect-[16/10] md:aspect-auto md:min-h-[22rem]">
            <Photo name={lead.image} alt={lead.title} sizes="(min-width: 768px) 50vw, 100vw" priority className="transition-transform duration-700 group-hover:scale-[1.03]" />
          </span>
          <span className="flex flex-col justify-center p-6 sm:p-10">
            <span className="text-xs font-bold tracking-[0.16em] text-forest-light uppercase">Featured · {lead.category}</span>
            <span className="mt-2 font-display text-3xl leading-tight font-semibold text-forest sm:text-4xl">{lead.title}</span>
            <span className="mt-3 text-stone">{lead.dek}</span>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
              Read the story <Arrow />
            </span>
          </span>
        </Link>
      </section>

      <section className="container-x pt-10 lg:pt-16">
        <SectionHeader title="Latest stories" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </section>

      <section className="container-x py-10 lg:py-16">
        <PatternBanner
          eyebrow="Our story"
          title="Native, beyond the plate."
          actions={
            <ButtonLink href="/culture" variant="cream">
              Culture & heritage <Arrow />
            </ButtonLink>
          }
        >
          Native started with food — Ofe Owerri, abacha, pepper soup — and grew into a guide to everything around the table: the markets, the makers, the festivals and the
          places that make Imo State home.
        </PatternBanner>
      </section>
    </>
  );
}

export default function Page() {
  return <Design a={<BlogPage />} b={<SigBlog />} />;
}
