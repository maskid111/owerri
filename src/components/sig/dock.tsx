"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Version B anchors use data-anchor (ids belong to Version A); scroll to them on hash navigation. */
export function SigHashScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const go = () => {
      if (document.documentElement.dataset.design !== "b" || !location.hash) return;
      const el = document.querySelector(`[data-anchor="${CSS.escape(location.hash.slice(1))}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const t = window.setTimeout(go, 80);
    window.addEventListener("hashchange", go);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", go);
    };
  }, [pathname]);
  return null;
}
