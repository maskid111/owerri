import type { ReactNode } from "react";

/**
 * Renders both design versions; CSS keyed on <html data-design> shows exactly one (see globals.css).
 * Both are prerendered statically, so switching never flashes the other version and works on refresh.
 *
 * The wrappers are `display: contents` / `display: none`, which have no box, so Next.js can't measure the
 * new page and skips its scroll-to-top after navigation. The zero-height marker gives it a box to measure.
 */
export function Design({ a, b }: { a: ReactNode; b: ReactNode }) {
  return (
    <>
      <span className="block h-0 scroll-mt-24" aria-hidden />
      <div className="design-a">{a}</div>
      <div className="design-b">{b}</div>
    </>
  );
}
