"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { openSearch } from "./search-dialog";

/**
 * Homepage footage (supplied by Native), shared by both design versions.
 * Encoded from the 2160×4096 portrait master as a seamless 13.8 s crossfade loop in two renditions:
 *  - portrait 1080×1920 for tall phone screens
 *  - landscape 1920×1080 for tablets, laptops and desktops — a crop that follows the camera's push-in
 *    so the faces stay in frame.
 * Reduced motion: the video stays on its poster frame.
 */
export const HERO_VIDEO = {
  portrait: { src: "/videos/native-hero-portrait.mp4", poster: "/videos/native-hero-poster-portrait.jpg" },
  landscape: { src: "/videos/native-hero-1080.mp4", poster: "/videos/native-hero-poster.jpg" },
  label: "Three women in white and black dresses with gold necklaces, holding woven baskets of fruit",
} as const;

type Rendition = "portrait" | "landscape";
const PORTRAIT_QUERY = "(max-aspect-ratio: 4/5)";

const pickRendition = (): Rendition => (window.matchMedia(PORTRAIT_QUERY).matches ? "portrait" : "landscape");

/** `children` are overlays painted above the footage. There are no visible player controls. */
export function HeroVideo({ className, children }: { className?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [rendition, setRendition] = useState<Rendition | null>(null);

  // Screen shape and density are unknown while prerendering, so the rendition is chosen on the client.
  useEffect(() => {
    const update = () => setRendition(pickRendition());
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

  const current = HERO_VIDEO[rendition ?? "landscape"];

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
  leading,
  children,
}: {
  id: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  /** Rendered before the input (e.g. a search icon). */
  leading?: React.ReactNode;
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
      {leading}
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
