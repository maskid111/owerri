"use client";

import { ArrowRight, Check } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const uid = useId();
  const inputId = `newsletter-${uid}`;
  const errorId = `${inputId}-error`;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) {
    return (
      <p role="status" className={cn("flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold", dark ? "bg-cream/10 text-cream" : "bg-mint text-forest")}>
        <Check className="size-5 text-sun" /> You’re on the list — see you on Friday.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          setError("Please enter a valid email address.");
          return;
        }
        setError("");
        setDone(true);
      }}
      className="w-full max-w-md"
    >
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-12 w-full rounded-full border pr-32 pl-5 text-sm outline-none transition-colors",
            dark ? "border-cream/20 bg-cream/5 text-cream placeholder:text-cream/40 focus:border-sun" : "border-line bg-paper text-ink placeholder:text-stone/60 focus:border-forest",
          )}
        />
        <button type="submit" className="absolute top-1 right-1 inline-flex h-10 items-center gap-1.5 rounded-full bg-sun px-4 text-sm font-semibold text-forest-deep hover:bg-sun-deep">
          Subscribe <ArrowRight className="size-4" />
        </button>
      </div>
      {error && (
        <p id={errorId} className={cn("mt-2 pl-5 text-xs", dark ? "text-sun" : "text-red-700")}>
          {error}
        </p>
      )}
    </form>
  );
}
