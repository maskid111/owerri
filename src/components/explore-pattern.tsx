import { cn } from "@/lib/utils";

/**
 * Decorative line pattern for the hero's Explore button: a wavy line, a few dots and a deep-green corner
 * swoosh. Thin, low-contrast strokes keep the label easy to read.
 * Place inside a `relative isolate overflow-hidden` button and give the label `relative`.
 */
export function ExplorePattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 56"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none absolute inset-0 -z-10 h-full w-full", className)}
      aria-hidden
    >
      {/* Deep-green swoosh in the corner, with a fine outline echoing its edge */}
      <path d="M116 -4C128 8 120 22 133 31C143 38 147 49 143 60H164V-4Z" fill="#0b2a1e" opacity=".55" />
      <path d="M108 -4C121 9 112 24 126 34C135 41 139 51 136 60" fill="none" stroke="#fff" strokeOpacity=".16" />

      {/* Wavy line along the bottom */}
      <path d="M-4 49C10 43 20 55 36 49S64 42 80 49S108 55 122 47" fill="none" stroke="#fff" strokeOpacity=".14" strokeLinecap="round" />

      {/* Small zigzag on the swoosh and a scatter of dots */}
      <path d="M131 13l3.5-3.5 3.5 3.5 3.5-3.5 3.5 3.5" fill="none" stroke="#fff" strokeOpacity=".35" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="10" r="1.1" fill="#fff" fillOpacity=".55" />
      <circle cx="94" cy="8" r=".9" fill="#fff" fillOpacity=".45" />
      <circle cx="72" cy="51" r=".9" fill="#fff" fillOpacity=".4" />
      <circle cx="150" cy="44" r="1.1" fill="#fff" fillOpacity=".5" />
    </svg>
  );
}
