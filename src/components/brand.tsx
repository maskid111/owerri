import { cn } from "@/lib/utils";

/** Brand constants shared by both design versions, metadata and the splash screen. */
export const BRAND = { name: "Native", tagline: "Native, beyond the plate" } as const;

type Size = "sm" | "md" | "lg" | "xl";

/** Official logo artwork: green letters (white variant for dark backgrounds); the gold leaf is never recoloured. */
export const LOGO = { green: "/brand/native-logo.svg", white: "/brand/native-logo-white.svg", ratio: 164 / 63 } as const;

const logoHeight: Record<Size, string> = {
  sm: "h-8",
  md: "h-9 sm:h-10",
  lg: "h-16 sm:h-20",
  xl: "h-24 sm:h-32",
};
const taglineSize: Record<Size, string> = {
  sm: "text-[0.6rem]",
  md: "text-[0.62rem] sm:text-[0.66rem]",
  lg: "text-xs sm:text-sm",
  xl: "text-sm sm:text-base",
};

/**
 * The Native logo — the ONLY place it is drawn, so every header, footer, drawer, splash screen and
 * admin preview uses the same artwork. `tone="light"` swaps the green letters for white on dark backgrounds.
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
  return (
    <span
      className={cn(
        "inline-flex flex-col leading-none",
        align === "center" ? "items-center text-center" : "items-start",
        tone === "light" ? "text-white" : "text-forest",
        className,
      )}
    >
      {tone === "light" ? (
        // eslint-disable-next-line @next/next/no-img-element -- static SVG artwork, no optimisation needed
        <img src={LOGO.white} alt={BRAND.name} width={164} height={63} className={cn("w-auto", logoHeight[size])} draggable={false} />
      ) : (
        <>
          {/* Green letters on light surfaces; white letters when the admin dark theme (Option 2) is active. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO.green} alt={BRAND.name} width={164} height={63} className={cn("w-auto dark:hidden", logoHeight[size])} draggable={false} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO.white} alt="" aria-hidden width={164} height={63} className={cn("hidden w-auto dark:block", logoHeight[size])} draggable={false} />
        </>
      )}
      {tagline && <span className={cn("mt-1 font-sans font-medium tracking-[0.12em] opacity-75", taglineSize[size])}>{BRAND.tagline}</span>}
    </span>
  );
}
