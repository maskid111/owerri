"use client";

import { Check, FileText, LayoutDashboard, Palette, ShieldAlert, Store, Users } from "lucide-react";
import { designVersions, setDesignVersion, useDesignVersion, type DesignVersion } from "@/lib/design";
import { setSiteTheme, themes, useSiteTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const sections = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Website Design", icon: Palette, active: true },
  { label: "Listings", icon: Store },
  { label: "Content", icon: FileText },
  { label: "Team", icon: Users },
];

/**
 * Frontend-only admin prototype. Selecting a version swaps the whole design system for this browser
 * (stored in localStorage) — it does not publish the choice to other visitors.
 */
export function AppearanceSettings({ chrome = true }: { chrome?: boolean }) {
  const design = useDesignVersion();
  const theme = useSiteTheme();

  return (
    <div className="container-x py-6 lg:py-10">
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-sand px-4 py-3 text-sm text-ink">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-forest" />
        <p>
          <span className="font-semibold">Admin prototype.</span> No login or backend yet. Your selection is saved in this browser (localStorage) and applies to every page you
          view here — it is <span className="font-semibold">not</span> published to other visitors.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_1fr]">
        <aside className="min-w-0">
          <p className="px-3 text-xs font-bold tracking-[0.14em] text-stone uppercase">Admin</p>
          <ul className="mt-2 flex gap-1 overflow-x-auto lg:flex-col">
            {sections.map(({ label, icon: Icon, active }) => (
              <li key={label} className="shrink-0">
                <span
                  aria-current={active ? "page" : undefined}
                  className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold", active ? "bg-forest text-on-forest" : "text-stone")}
                >
                  <Icon className="size-[18px]" />
                  {label}
                  {!active && <span className="ml-auto hidden text-[10px] font-medium uppercase lg:inline">Soon</span>}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <section aria-labelledby="design-title" className="min-w-0 rounded-[1.5rem] border border-line/70 bg-paper p-5 shadow-card sm:p-8">
          {chrome ? (
            <h1 id="design-title" className="text-3xl font-semibold text-forest sm:text-4xl">
              Website Design Selector
            </h1>
          ) : (
            <h2 id="design-title" className="sr-only">
              Website Design Selector
            </h2>
          )}
          <p className={cn("max-w-2xl text-stone", chrome && "mt-2")}>
            Choose which complete design system renders the site. Both versions share the same pages, data, search, saved items, cart and ordering — but each has its own
            layouts, navigation, hero, cards and footer.
          </p>

          <div className="mt-6 grid gap-5 xl:grid-cols-2" role="radiogroup" aria-label="Website design">
            {designVersions.map((v) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={design === v.id}
                onClick={() => setDesignVersion(v.id)}
                className={cn(
                  "group rounded-[1.4rem] border-2 p-3 text-left transition-all",
                  design === v.id ? "border-accent shadow-lift" : "border-line hover:border-forest/40",
                )}
              >
                <Preview version={v.id} />
                <div className="mt-4 flex items-start justify-between gap-3 px-1 pb-1">
                  <div>
                    <p className="text-[0.68rem] font-bold tracking-[0.18em] text-forest-light uppercase">{v.tag}</p>
                    <p className="mt-0.5 text-lg font-semibold text-ink">{v.name}</p>
                    <p className="mt-1 text-sm text-stone">{v.description}</p>
                  </div>
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border-2", design === v.id ? "border-accent bg-accent text-on-accent" : "border-line")}>
                    {design === v.id && <Check className="size-4" strokeWidth={3} />}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className={cn("mt-8 rounded-2xl border border-line p-4 sm:p-5", design !== "a" && "opacity-60")}>
            <p className="font-semibold text-ink">Version A palette</p>
            <p className="text-sm text-stone">
              The Original UI keeps its two colour palettes.{design !== "a" && " Applies when Version A is selected."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Version A palette">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={theme === t.id}
                  onClick={() => setSiteTheme(t.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    theme === t.id ? "border-forest bg-forest text-on-forest" : "border-line text-ink hover:border-forest/40",
                  )}
                >
                  <span className={cn("size-3.5 rounded-full border", t.id === "forest" ? "border-[#265343] bg-[#0b2a1f]" : "border-[#e6e2d6] bg-[#fbfaf6]")} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm text-stone" role="status">
            Active: <span className="font-semibold text-ink">{designVersions.find((v) => v.id === design)?.tag} — {designVersions.find((v) => v.id === design)?.name}</span>
            {design === "a" && <> · {themes.find((t) => t.id === theme)?.name}</>} · saved to this browser and kept after refresh.
          </p>
        </section>
      </div>
    </div>
  );
}

/** Hard-coded colours on purpose: each preview must look like its version regardless of the active one. */
function Preview({ version }: { version: DesignVersion }) {
  if (version === "a") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#e6e2d6] bg-[#fbfaf6]" aria-hidden>
        <div className="relative h-36 bg-[url('/images/woman-headwrap.jpg')] bg-cover bg-[70%_center]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a2c1e]/90 to-transparent" />
          <div className="absolute top-2.5 right-3 left-3 flex items-center justify-between">
            <span className="font-[Fraunces,serif] text-[11px] font-semibold text-[#f7f5ee]">Native <i>Kitchen</i></span>
            <span className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="h-1 w-5 rounded bg-[#f7f5ee]/60" />
              ))}
            </span>
          </div>
          <p className="absolute top-12 left-3 font-[Fraunces,serif] text-[19px] leading-[1] font-semibold text-[#f7f5ee]">
            Discover
            <br />
            local gems.
          </p>
          <span className="absolute bottom-3 left-3 h-4 w-16 rounded-full bg-[#f7f5ee]" />
        </div>
        <div className="-mt-3 grid grid-cols-6 gap-1 px-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="flex flex-col items-center gap-1 rounded-md bg-white py-1.5 shadow-sm">
              <span className="size-3 rounded-full bg-[#0f3d2a]" />
              <span className="h-0.5 w-4 rounded bg-[#59645d]/40" />
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-2">
          {["lodge", "lake-sunset", "waterfall"].map((img) => (
            <span key={img} className="relative h-10 overflow-hidden rounded-md bg-cover bg-center" style={{ backgroundImage: `url(/images/${img}.jpg)` }}>
              <span className="absolute inset-x-1 bottom-1 h-1 rounded bg-white/80" />
            </span>
          ))}
        </div>
        <div className="h-4 bg-native-pattern" />
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-[#dbe4da] bg-[#f3f6f2]" aria-hidden>
      <div className="relative bg-[#072a1d] px-3 pt-2.5 pb-7">
        <div className="absolute inset-0 bg-native-pattern opacity-20" />
        <p className="relative text-center text-[10px] tracking-[0.16em] text-white uppercase">
          <b>Native</b> Kitchen
        </p>
        <div className="relative mx-auto mt-1.5 h-3 w-3/4 rounded-full bg-white" />
        <div className="relative mt-2.5 flex items-end justify-between gap-2">
          <p className="text-[17px] leading-[0.9] font-extrabold text-white">
            Taste
            <br />
            Explore
            <br />
            <span className="text-[#8fdba8]">Experience</span>
          </p>
          <span className="h-[68px] w-14 shrink-0 rounded-t-full bg-[url('/images/woman-headwrap.jpg')] bg-cover bg-center ring-2 ring-white/20" />
        </div>
      </div>
      <div className="relative -mt-4 mx-2 grid grid-cols-3 gap-1 rounded-lg bg-white p-1.5 shadow-sm">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="flex flex-col items-center gap-1 py-1">
            <span className="size-3.5 rounded-full bg-[#0b3b2a] ring-2 ring-[#e0eee3]" />
            <span className="h-0.5 w-5 rounded bg-[#0b3b2a]/40" />
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5 p-2">
        {["douglas-road-night-walk", "waterfall", "festival"].map((img, i) => (
          <span key={img} className="overflow-hidden rounded-md">
            <span className="block h-8 bg-cover bg-center" style={{ backgroundImage: `url(/images/${["suya-grill", "waterfall", "festival"][i]}.jpg)` }} />
            <span className="block h-2.5 bg-[#0b3b2a]" />
          </span>
        ))}
      </div>
      <div className="flex justify-between border-t border-[#dbe4da] bg-white px-2 py-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <span key={i} className={cn("size-2 rounded-full", i === 0 ? "bg-[#0b3b2a]" : "bg-[#0b3b2a]/25")} />
        ))}
      </div>
    </div>
  );
}
