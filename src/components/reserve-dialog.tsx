"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, CheckCircle2, Clock, Users, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

const times = ["12:30", "13:30", "18:00", "19:00", "19:30", "20:30", "21:00"];

export function ReserveButton({ name, className }: { name: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "done">("form");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const titleId = useId();

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

  const close = () => {
    setOpen(false);
    window.setTimeout(() => setStep("form"), 300);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-paper px-6 text-sm font-semibold text-forest transition-colors hover:border-forest/40", className)}
      >
        <CalendarDays className="size-4" /> Reserve a table
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close" className="absolute inset-0 bg-forest-deep/55" onClick={close} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-t-[2rem] bg-cream p-6 shadow-2xl sm:rounded-[2rem] sm:p-8"
            >
              <button onClick={close} aria-label="Close" className="absolute top-5 right-5 rounded-full p-2 hover:bg-forest/5">
                <X className="size-4" />
              </button>

              {step === "form" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("done");
                  }}
                >
                  <p className="text-xs font-bold tracking-[0.16em] text-forest-light uppercase">Reservation request</p>
                  <h2 id={titleId} className="mt-2 pr-8 text-3xl font-semibold text-forest">
                    {name}
                  </h2>

                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Users className="size-4" /> Guests
                      </p>
                      <div className="grid grid-cols-6 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((g) => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => setGuests(g)}
                            aria-pressed={guests === g}
                            className={cn("h-11 rounded-xl border text-sm font-semibold transition-colors", guests === g ? "border-forest bg-forest text-cream" : "border-line bg-paper hover:border-forest/40")}
                          >
                            {g === 6 ? "6+" : g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <CalendarDays className="size-4" /> Date
                      </span>
                      <input
                        required
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-12 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest"
                      />
                    </label>
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Clock className="size-4" /> Time
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {times.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setTime(t)}
                            aria-pressed={time === t}
                            className={cn("h-10 rounded-full border px-4 text-sm font-semibold transition-colors", time === t ? "border-sun bg-sun text-forest-deep" : "border-line bg-paper hover:border-forest/40")}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="mt-8 h-12 w-full rounded-full bg-sun text-sm font-semibold text-forest-deep transition-colors hover:bg-sun-deep">
                    Request booking
                  </button>
                  <p className="mt-3 text-center text-xs text-stone">Demo request — the restaurant would confirm by SMS. No payment needed.</p>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                  <CheckCircle2 className="mx-auto size-14 text-forest-light" strokeWidth={1.5} />
                  <h2 id={titleId} className="mt-4 text-3xl font-semibold text-forest">
                    Request sent
                  </h2>
                  <p className="mt-3 text-stone">
                    Table for {guests === 6 ? "6+" : guests} at {name} on {date || "your chosen date"}, {time}. We’ll let you know once it’s confirmed.
                  </p>
                  <button onClick={close} className="mt-8 h-12 w-full rounded-full bg-forest text-sm font-semibold text-cream hover:bg-forest-light">
                    Done
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
