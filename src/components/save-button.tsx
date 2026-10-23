"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth/session";
import { useSaved } from "@/lib/saved-store";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/**
 * Favourite toggle.
 * - `circle`: white floating button (detail cover photos)
 * - `photo`: bare white outline heart drawn on top of a photo (listing cards)
 * - `plain`: forest outline heart on cream (explore cards)
 */
export function SaveButton({
  slug,
  name,
  variant = "plain",
  withLabel = false,
  className,
}: {
  slug: string;
  name: string;
  variant?: "circle" | "photo" | "plain";
  withLabel?: boolean;
  className?: string;
}) {
  const { isSaved, toggle } = useSaved();
  const { status } = useAuth();
  const active = isSaved(slug);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        if (!active && status === "signedOut") promptSignIn();
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from saved` : `Save ${name}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full transition-colors",
        variant === "circle" && "size-10 bg-paper text-forest shadow-card hover:bg-sand",
        variant === "photo" && "size-9 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]",
        variant === "plain" && (withLabel ? "h-11 border border-line bg-paper px-5 text-sm font-semibold text-forest hover:border-forest/40" : "size-9 text-forest hover:bg-forest/5"),
        className,
      )}
    >
      <Heart className={cn("size-5", active && "fill-current")} strokeWidth={2} />
      {withLabel && <span>{active ? "Saved" : "Save"}</span>}
    </motion.button>
  );
}

/** Visitors can save freely; once per visit, gently suggest an account so favourites follow them. */
function promptSignIn() {
  try {
    if (window.sessionStorage.getItem("native:save-prompted")) return;
    window.sessionStorage.setItem("native:save-prompted", "1");
  } catch {
    /* storage unavailable: show the prompt anyway */
  }
  const here = window.location.pathname + window.location.search;
  toast({
    tone: "info",
    title: "Saved on this device",
    body: "Sign in to keep your favourites with your account.",
    action: { label: "Sign in", href: `/sign-in?next=${encodeURIComponent(here)}` },
  });
}
