import type { ReactNode } from "react";

/**
 * Renders both design versions; CSS keyed on <html data-design> shows exactly one (see globals.css).
 * Both are prerendered statically, so switching never flashes the other version and works on refresh.
 */
export function Design({ a, b }: { a: ReactNode; b: ReactNode }) {
  return (
    <>
      <div className="design-a">{a}</div>
      <div className="design-b">{b}</div>
    </>
  );
}
