"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { dismissToast, useToasts } from "@/lib/toast";
import { cn } from "@/lib/utils";

const icons = { success: CircleCheck, info: Info, error: CircleAlert };

/** Renders toasts above the mobile bottom bar (one instance in the root layout). */
export function Toaster() {
  const toasts = useToasts();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-3 lg:bottom-6">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = icons[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              role={t.tone === "error" ? "alert" : "status"}
              className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl bg-forest-deep px-4 py-3 text-white shadow-lift ring-1 ring-white/10"
            >
              <Icon className={cn("mt-0.5 size-5 shrink-0", t.tone === "error" ? "text-[#ff9a8a]" : t.tone === "success" ? "text-leaf" : "text-spark")} aria-hidden />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{t.title}</p>
                {t.body && <p className="mt-0.5 text-white/75">{t.body}</p>}
                {t.action && (
                  <Link href={t.action.href} onClick={() => dismissToast(t.id)} className="mt-1.5 inline-block font-semibold text-spark underline underline-offset-4">
                    {t.action.label}
                  </Link>
                )}
              </div>
              <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="-mr-1 grid size-7 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
