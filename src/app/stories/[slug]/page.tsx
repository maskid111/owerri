import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StoryCard } from "@/components/story-card";
import { Photo, SectionHeader } from "@/components/ui";
import { getStory, stories } from "@/lib/data";
import { Design } from "@/components/design";
import { SigStory } from "@/components/sig/pages";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getStory(slug);
  if (!s) return { title: "Not found" };
  return { title: s.title, description: s.dek };
}

async function StoryPage({ params }: { params: PageProps<"/stories/[slug]">["params"] }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const more = stories.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <article>
      <header className="lg:container-x lg:pt-6">
        <div className="relative isolate flex min-h-[20rem] items-end overflow-hidden rounded-b-[1.75rem] sm:min-h-[26rem] lg:min-h-[30rem] lg:rounded-[1.75rem]">
          <Photo name={story.image} alt={story.title} sizes="(min-width: 1024px) 1200px, 100vw" priority className="-z-10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/35 to-forest-deep/10" />
          <Link href="/culture" aria-label="Back to culture and stories" className="absolute top-4 left-4 grid size-10 place-items-center rounded-full bg-paper text-forest shadow-card">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="max-w-3xl p-5 text-cream sm:p-8 lg:p-12">
            <span className="rounded-md bg-accent px-2 py-1 text-[11px] font-bold text-on-accent">{story.category}</span>
            <h1 className="mt-3 text-[2.1rem] leading-[1.05] font-semibold sm:text-5xl">{story.title}</h1>
            <p className="mt-3 text-lg text-cream/85">{story.dek}</p>
            <p className="mt-3 text-sm text-cream/70">
              {story.author} · {story.date} · {story.readTime}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
        {story.body.map((b, i) => (
          <div key={i} className="mb-7">
            {b.heading && <h2 className="mb-2 text-2xl font-semibold text-forest sm:text-3xl">{b.heading}</h2>}
            <p className={i === 0 ? "font-display text-xl leading-relaxed text-forest sm:text-2xl" : "text-lg leading-relaxed text-ink/85"}>{b.text}</p>
          </div>
        ))}
      </div>

      <section className="container-x pb-12 lg:pb-20">
        <SectionHeader title="Keep reading" href="/culture" />
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </section>
    </article>
  );
}

export default function Page({ params }: PageProps<"/stories/[slug]">) {
  return <Design a={<StoryPage params={params} />} b={<SigStory params={params} />} />;
}
