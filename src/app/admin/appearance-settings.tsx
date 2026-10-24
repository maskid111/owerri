"use client";

import { Check, FileText, LayoutDashboard, Palette, ShieldAlert, Store, Users } from "lucide-react";
import { designVersions, setDesignVersion, useDesignVersion, type DesignVersion } from "@/lib/design";
import { setSiteTheme, themeLabel, themes, useSiteTheme, type SiteTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { LOGO } from "@/components/brand";

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

          <div className="mt-10 border-t border-line pt-8">
            <h2 className="text-2xl font-semibold text-forest">Website Background Theme</h2>
            <p className="mt-1 max-w-2xl text-sm text-stone">
              Changes the colour and surface system of the whole website — every page, menu, card, form and dialog — in whichever design version is selected above. Visitors
              can’t change this; there is no public toggle.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Website background theme">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={theme === t.id}
                  onClick={() => setSiteTheme(t.id)}
                  className={cn("rounded-[1.25rem] border-2 p-3 text-left transition-all", theme === t.id ? "border-accent shadow-lift" : "border-line hover:border-forest/40")}
                >
                  <ThemePreview theme={t.id} />
                  <div className="mt-3 flex items-start justify-between gap-3 px-1 pb-1">
                    <div>
                      <p className="text-[0.68rem] font-bold tracking-[0.18em] text-forest-light uppercase">{t.option}</p>
                      <p className="mt-0.5 font-semibold text-ink">{t.name}</p>
                      <p className="mt-1 text-sm text-stone">{t.description}</p>
                    </div>
                    <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border-2", theme === t.id ? "border-accent bg-accent text-on-accent" : "border-line")}>
                      {theme === t.id && <Check className="size-4" strokeWidth={3} />}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm text-stone" role="status">
            Active: <span className="font-semibold text-ink">{designVersions.find((v) => v.id === design)?.tag} — {designVersions.find((v) => v.id === design)?.name}</span> ·{" "}
            <span className="font-semibold text-ink">{themeLabel(theme)}</span>. Saved to this browser and kept after refresh — not yet a central setting shared with every
            visitor.
          </p>
        </section>
      </div>
    </div>
  );
}

/** Hard-coded colours on purpose: each preview must look like its version regardless of the active one. */
function Preview({ version }: { version: DesignVersion }) {
  const dance = "bg-[url('/videos/native-hero-poster.jpg')] bg-cover bg-center";
  if (version === "a") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#e6e2d6] bg-[#fbfaf6]" aria-hidden>
        <div className={cn("relative h-40", dance)}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35" />
          <div className="absolute top-2.5 right-3 left-3 flex items-center justify-between">
            <span className="flex flex-col leading-none text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO.white} alt="" className="h-6 w-auto" />
            </span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 rounded-full bg-white/70" />
              ))}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="h-5 w-14 rounded-full bg-white" />
            <span className="h-5 w-24 rounded-full border border-white/70 bg-white/15" />
          </div>
        </div>
        <div className="px-3 pt-3">
          <span className="block h-1.5 w-10 rounded bg-[#0f3d2a]" />
          <span className="mt-1 block h-[2px] w-4 rounded bg-spark" />
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-3 pt-2">
          {["lodge", "lake-sunset", "waterfall"].map((img) => (
            <span key={img} className="relative h-10 overflow-hidden rounded-md bg-cover bg-center" style={{ backgroundImage: `url(/images/${img}.jpg)` }} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-[#dbe4da] bg-[#f3f6f2]" aria-hidden>
      <div className={cn("relative h-40", dance)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40" />
        <span className="absolute inset-x-0 top-2.5 flex flex-col items-center leading-none text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO.white} alt="" className="h-6 w-auto" />
        </span>
        <div className="absolute inset-x-6 bottom-3 flex h-6 items-center justify-end gap-1 rounded-full bg-white p-1">
          <span className="h-4 w-12 rounded-full bg-[#0b3b2a]" />
        </div>
      </div>
      <div className="grid grid-cols-6 gap-1 px-3 pt-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="mx-auto size-4 rounded-full bg-[#0b3b2a] ring-2 ring-[#e0eee3]" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5 p-3">
        {["suya-grill", "waterfall", "festival"].map((img) => (
          <span key={img} className="overflow-hidden rounded-md">
            <span className="block h-7 bg-cover bg-center" style={{ backgroundImage: `url(/images/${img}.jpg)` }} />
            <span className="block h-2.5 bg-[#0b3b2a]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Fixed-colour miniature of the homepage in each background theme (independent of the active one). */
function ThemePreview({ theme }: { theme: SiteTheme }) {
  const dark = theme === "forest";
  const c = dark
    ? { page: "#0b1d15", card: "#12291f", line: "#274638", text: "#f1ead9", muted: "#a9b8ac" }
    : { page: "#fbfaf6", card: "#ffffff", line: "#e6e2d6", text: "#0f3d2a", muted: "#59645d" };
  return (
    <div className="overflow-hidden rounded-xl border" style={{ background: c.page, borderColor: c.line }} aria-hidden>
      <div className="relative h-20 bg-cover bg-center" style={{ backgroundImage: "url(/images/egusi.jpg)" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2c1e] via-[#0a2c1e]/70 to-transparent" />
        <span className="absolute top-3 left-3 block h-2 w-16 rounded bg-white/90" />
        <span className="absolute top-7 left-3 block h-1.5 w-10 rounded bg-white/60" />
        <span className="absolute bottom-3 left-3 block h-3 w-12 rounded-full bg-spark" />
      </div>
      <div className="mx-3 -mt-2 h-4 rounded-full border" style={{ background: c.card, borderColor: c.line }} />
      <div className="grid grid-cols-6 gap-1 px-3 pt-2.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="aspect-square rounded-md border" style={{ background: c.card, borderColor: c.line }} />
        ))}
      </div>
      <div className="px-3 pt-2.5">
        <span className="block h-1.5 w-16 rounded" style={{ background: c.text }} />
      </div>
      <div className="grid grid-cols-3 gap-1.5 p-3 pt-2">
        {["lodge", "grilled-platter", "waterfall"].map((img) => (
          <span key={img} className="h-9 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(/images/${img}.jpg)` }} />
        ))}
      </div>
      <p className="px-3 pb-2.5 text-[9px] font-semibold" style={{ color: c.muted }}>
        {dark ? "Dark forest surfaces" : "White & warm cream"}
      </p>
    </div>
  );
}
