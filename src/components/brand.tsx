import { cn } from "@/lib/utils";

/** Brand constants shared by both design versions, metadata and the splash screen. */
export const BRAND = { name: "Native", tagline: "Native, beyond the plate" } as const;

type Size = "sm" | "md" | "lg" | "xl";

const wordSize: Record<Size, string> = {
  sm: "text-[1.45rem]",
  md: "text-[1.7rem] sm:text-[1.9rem]",
  lg: "text-5xl sm:text-6xl",
  xl: "text-[3.75rem] sm:text-[5.5rem]",
};
const taglineSize: Record<Size, string> = {
  sm: "text-[0.6rem]",
  md: "text-[0.62rem] sm:text-[0.66rem]",
  lg: "text-xs sm:text-sm",
  xl: "text-sm sm:text-base",
};

/**
 * The Native wordmark — the ONLY place the logo is drawn.
 * Plain text for now; when the official logo arrives, replace the markup below (e.g. with an <Image>)
 * and every header, footer, drawer, splash screen and admin preview updates with it.
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
      <span className={cn("font-brand font-medium tracking-[-0.02em]", wordSize[size])}>{BRAND.name}</span>
      {tagline && <span className={cn("mt-1.5 font-sans font-medium tracking-[0.12em] opacity-75", taglineSize[size])}>{BRAND.tagline}</span>}
    </span>
  );
}
