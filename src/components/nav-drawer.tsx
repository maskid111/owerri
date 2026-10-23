"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { AppMenuList } from "./app-menu";
import { Logo } from "./ui";

const OPEN_EVENT = "native:open-nav";
export const openNavDrawer = () => window.dispatchEvent(new Event(OPEN_EVENT));

/** Slide-in navigation drawer: the grouped site menu (see AppMenuList). */
export function NavDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[75]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close menu" className="absolute inset-0 bg-forest-deep/60" onClick={close} />
          <motion.nav
            aria-label="Site"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="pb-safe absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto rounded-r-[1.75rem] bg-canvas px-4 pt-5"
          >
            <div className="flex items-center justify-between px-1">
              <Logo />
              <button onClick={close} className="grid size-10 place-items-center rounded-full text-forest hover:bg-forest/5" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>

            <AppMenuList pathname={pathname} onNavigate={close} />
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
