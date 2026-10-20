import { cn } from "@/lib/utils";

const dot = "absolute rounded-full bg-white";

/**
 * Decorative line pattern for the hero's Explore button: a wavy line, a few dots and a deep-green corner
 * swoosh. Thin, low-contrast strokes keep the label easy to read.
 * Each piece is anchored to the button's edges (swoosh to the right, wave along the bottom, dots by
 * percentage), so the pattern stays whole on a wide full-width phone button and a narrow pill alike.
 * Place inside a `relative isolate overflow-hidden` button and give the label `relative`.
 */
export function ExplorePattern({ className }: { className?: string }) {
  return (
    <span className={cn("pointer-events-none absolute inset-0 -z-10", className)} aria-hidden>
      {/* Wavy line along the bottom, stretched to the button's width */}
      <svg viewBox="0 0 120 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M-4 49C10 43 20 55 36 49S64 42 80 49S108 55 124 47"
          fill="none"
          stroke="#fff"
          strokeOpacity=".14"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Deep-green swoosh with a fine outline and a small zigzag, pinned to the right edge */}
      <svg viewBox="104 0 56 56" preserveAspectRatio="xMaxYMid meet" className="absolute inset-y-0 right-0 h-full w-auto">
        <path d="M116 -4C128 8 120 22 133 31C143 38 147 49 143 60H164V-4Z" fill="#0b2a1e" opacity=".55" />
        <path d="M108 -4C121 9 112 24 126 34C135 41 139 51 136 60" fill="none" stroke="#fff" strokeOpacity=".16" />
        <path d="M131 13l3.5-3.5 3.5 3.5 3.5-3.5 3.5 3.5" fill="none" stroke="#fff" strokeOpacity=".35" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="150" cy="44" r="1.1" fill="#fff" fillOpacity=".5" />
      </svg>

      {/* A scatter of dots */}
      <span className={cn(dot, "top-[17%] left-[6%] size-[2px] opacity-55")} />
      <span className={cn(dot, "top-[13%] left-[58%] size-[2px] opacity-45")} />
      <span className={cn(dot, "bottom-[8%] left-[45%] size-[2px] opacity-40")} />
    </span>
  );
}
