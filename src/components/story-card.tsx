import Link from "next/link";
import type { Story } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Photo } from "./ui";

export function StoryCard({ story, className }: { story: Story; className?: string }) {
  return (
    <Link href={`/stories/${story.slug}`} className={cn("group block overflow-hidden rounded-[1.25rem] border border-line/70 bg-paper shadow-card transition-shadow hover:shadow-lift", className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Photo name={story.image} alt={story.title} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute top-3 left-3 rounded-md bg-forest px-2 py-1 text-[11px] font-bold text-on-forest">{story.category}</span>
      </div>
      <div className="p-4">
        <h3 className="text-xl leading-snug font-semibold text-forest">{story.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-stone">{story.dek}</p>
        <p className="mt-3 text-xs font-semibold text-ink/60">{story.readTime}</p>
      </div>
    </Link>
  );
}
