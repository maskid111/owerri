import { cn } from "@/lib/utils";

/** Brand constants shared by both design versions, metadata and the splash screen. */
export const BRAND = { name: "Native", tagline: "Native, beyond the plate" } as const;

type Size = "sm" | "md" | "lg" | "xl";

/**
 * Official logo artwork (dark green on transparent, white variants for dark backgrounds):
 * the full lockup with “BEYOND THE PLATE”, and the wordmark alone for tight spaces.
 */
export const LOGO = {
  green: "/brand/native-logo-green.png",
  white: "/brand/native-logo-white.png",
  wordGreen: "/brand/native-wordmark-green.png",
  wordWhite: "/brand/native-wordmark-white.png",
} as const;

const art = {
  full: { green: LOGO.green, white: LOGO.white, width: 950, height: 376 },
  word: { green: LOGO.wordGreen, white: LOGO.wordWhite, width: 840, height: 266 },
};

const fullHeight: Record<Size, string> = {
  sm: "h-10",
  md: "h-11 sm:h-12",
  lg: "h-20 sm:h-24",
  xl: "h-28 sm:h-36",
};
const wordHeight: Record<Size, string> = {
  sm: "h-7",
  md: "h-8 sm:h-9",
  lg: "h-14 sm:h-16",
  xl: "h-20 sm:h-28",
};

/**
 * The Native logo — the ONLY place it is drawn, so every header, footer, drawer, splash screen and
 * auth page uses the same artwork. `tagline` picks the full lockup (with “BEYOND THE PLATE”) or the
 * wordmark alone; `tone="light"` uses the white artwork on dark backgrounds.
 */
export function Wordmark({
  tone = "dark",
  size = "md",
  align = "start",
  tagline = true,
  className,
}: {
  tone?: "dark" | "light";
  size?: Size;
  align?: "start" | "center";
  tagline?: boolean;
  className?: string;
}) {
  const a = tagline ? art.full : art.word;
  const height = (tagline ? fullHeight : wordHeight)[size];
  return (
    <span className={cn("inline-flex flex-col leading-none", align === "center" ? "items-center" : "items-start", className)}>
      {tone === "light" ? (
        // eslint-disable-next-line @next/next/no-img-element -- static logo artwork, no optimisation needed
        <img src={a.white} alt={BRAND.name} width={a.width} height={a.height} className={cn("w-auto", height)} draggable={false} />
      ) : (
        <>
          {/* Green artwork on light surfaces; white artwork when the admin dark theme (Option 2) is active. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.green} alt={BRAND.name} width={a.width} height={a.height} className={cn("w-auto dark:hidden", height)} draggable={false} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.white} alt="" aria-hidden width={a.width} height={a.height} className={cn("hidden w-auto dark:block", height)} draggable={false} />
        </>
      )}
    </span>
  );
}
