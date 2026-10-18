"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { openSearch } from "./search-dialog";

/**
 * Homepage cultural-dance footage (supplied by Native), shared by both design versions.
 * Encoded from the 3840×2160 master as a seamless 8.8 s crossfade loop in three renditions,
 * so each screen gets a sharp file without downloading more than it needs:
 *  - portrait 1080×1920 centre-cut for tall phone screens
 *  - 1920×1080 for most laptops and desktops
 *  - 3840×2160 for large / high-density displays (skipped when the visitor asks to save data).
 * Reduced motion: the video stays on its poster frame.
 */
export const HERO_VIDEO = {
  portrait: { src: "/videos/native-dance-portrait.mp4", poster: "/videos/native-dance-poster-portrait.jpg" },
  hd: { src: "/videos/native-dance-1080.mp4", poster: "/videos/native-dance-poster.jpg" },
  uhd: { src: "/videos/native-dance-2160.mp4", poster: "/videos/native-dance-poster.jpg" },
  label: "Traditional dancers in white wrappers performing with carved staffs at a cultural celebration",
} as const;

type Rendition = "portrait" | "hd" | "uhd";
const PORTRAIT_QUERY = "(max-aspect-ratio: 4/5)";

function pickRendition(): Rendition {
  if (window.matchMedia(PORTRAIT_QUERY).matches) return "portrait";
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return window.innerWidth * window.devicePixelRatio > 2400 && !saveData ? "uhd" : "hd";
}

/** `children` are overlays painted above the footage. There are no visible player controls. */
export function HeroVideo({ className, children }: { className?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [rendition, setRendition] = useState<Rendition | null>(null);

  // Screen shape and density are unknown while prerendering, so the rendition is chosen on the client.
  useEffect(() => {
    // Never step down from 4K mid-session (avoids a needless reload when a window narrows slightly).
    const update = () => setRendition((cur) => (cur === "uhd" && pickRendition() === "hd" ? cur : pickRendition()));
    const id = window.setTimeout(update, 0); // not rAF: it never fires in background tabs
    const mq = window.matchMedia(PORTRAIT_QUERY);
    mq.addEventListener("change", update);
    return () => {
      window.clearTimeout(id);
      mq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !rendition) return;
    // Respect reduced motion: stay on the poster frame until the visitor presses play.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => undefined); // autoplay blocked: the poster frame remains
  }, [rendition]);

  const current = HERO_VIDEO[rendition ?? "hd"];

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-forest-deep", className)}>
      <video
        ref={ref}
        key={current.src}
        className="h-full w-full object-cover object-center"
        poster={current.poster}
        src={rendition ? current.src : undefined}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
        aria-label={HERO_VIDEO.label}
      />
      {children}
    </div>
  );
}

/** Real search field for the hero; submitting opens the site-wide search pre-filled with the query. */
export function HeroSearchField({
  id,
  className,
  inputClassName,
  placeholder = "Search food, places, events…",
  children,
}: {
  id: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        openSearch(q.trim());
      }}
      className={className}
    >
      <label className="sr-only" htmlFor={id}>
        Search Native
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        autoComplete="off"
        className={cn("min-w-0 flex-1 bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden", inputClassName)}
      />
      {children}
    </form>
  );
}
