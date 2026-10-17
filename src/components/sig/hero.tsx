"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { ImageName } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Photo } from "../ui";
import { SigArrow, sigBtn, SigEyebrow } from "./ui";

const frames: { image: ImageName; title: string; caption: string; href: string; alt: string }[] = [
  { image: "woman-headwrap", title: "Meet the makers", caption: "Culture & heritage", href: "/culture", alt: "A woman in a vibrant headwrap" },
  { image: "waterfall", title: "Waterfall day trip", caption: "Nature & places", href: "/tours/nature", alt: "A waterfall in a green gorge" },
  { image: "festival", title: "Owerri Cultural Festival", caption: "Events & hangouts", href: "/events", alt: "A festival procession in red and coral" },
  { image: "soups-spread", title: "Taste of the heartland", caption: "Local market", href: "/market", alt: "Bowls of traditional soups" },
];

/** Version B hero: stacked headline beside an arched photo frame with selectable thumbnails. */
export function SigHero({ stats }: { stats: { label: string; value: string }[] }) {
  const [i, setI] = useState(0);
  const frame = frames[i];

  return (
    <section className="relative isolate overflow-hidden bg-forest-deep pb-28 text-white lg:pb-36">
      <div className="absolute inset-0 -z-10 bg-native-pattern-lg opacity-20 mix-blend-luminosity" aria-hidden />
      <div className="absolute -top-40 right-[-10%] -z-10 size-[40rem] rounded-full bg-forest-light/30 blur-3xl" aria-hidden />
      <div className="container-x grid grid-cols-1 items-center gap-10 pt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-14">
        <div className="motion-safe:animate-[sigRise_0.8s_ease-out]">
          <SigEyebrow light>Explore. Experience. Belong.</SigEyebrow>
          <h1 className="mt-4 text-[3.6rem] leading-[0.9] text-white sm:text-7xl lg:text-[6.4rem]">
            <span className="block">Taste</span>
            <span className="block">Explore</span>
            <span className="block text-leaf">Experience</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/80">Discover the real sides of our culture — food, places and people, all in one place.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/explore" className={sigBtn("white")}>
              Explore now <SigArrow />
            </Link>
            <Link href="/restaurants" className={sigBtn("ghost")}>
              Order food
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-white/15 border-y border-white/15 py-4">
            {stats.map((s) => (
              <div key={s.label} className="px-3 first:pl-0">
                <dd className="text-3xl font-extrabold text-white">{s.value}</dd>
                <dt className="text-[0.62rem] font-bold tracking-[0.18em] text-white/60 uppercase">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-[30rem]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] border-[6px] border-white/10 shadow-lift">
            {frames.map((f, n) => (
              <div key={f.image} className={cn("absolute inset-0 transition-opacity duration-700", n === i ? "opacity-100" : "opacity-0")} aria-hidden={n !== i}>
                <Photo name={f.image} alt={f.alt} sizes="(min-width: 1024px) 480px, 90vw" priority={n === 0} />
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-deep/80 to-transparent" />
          </div>
          <Link
            href={frame.href}
            className="group absolute -bottom-6 left-1/2 flex w-[88%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-forest shadow-lift transition-transform hover:-translate-y-0.5 sm:-left-8 sm:w-auto sm:translate-x-0"
          >
            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl">
              <Photo name={frame.image} alt="" sizes="48px" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.6rem] font-bold tracking-[0.18em] text-forest-light uppercase">{frame.caption}</span>
              <span className="block truncate font-bold">{frame.title}</span>
            </span>
            <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <div className="absolute top-1/2 -right-2 hidden -translate-y-1/2 flex-col gap-2 sm:flex lg:-right-6" role="tablist" aria-label="Featured photo">
            {frames.map((f, n) => (
              <button
                key={f.image}
                role="tab"
                aria-selected={n === i}
                aria-label={f.title}
                onClick={() => setI(n)}
                className={cn("relative size-12 overflow-hidden rounded-full border-2 transition-all", n === i ? "scale-110 border-leaf" : "border-white/40 opacity-70 hover:opacity-100")}
              >
                <Photo name={f.image} alt="" sizes="48px" />
              </button>
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-2 sm:hidden">
            {frames.map((f, n) => (
              <button key={f.image} onClick={() => setI(n)} aria-label={f.title} className={cn("h-1.5 rounded-full transition-all", n === i ? "w-8 bg-leaf" : "w-3 bg-white/40")} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
