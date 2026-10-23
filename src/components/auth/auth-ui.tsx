"use client";

import Link from "next/link";
import { Check, CircleAlert, CircleCheck, Eye, EyeOff, Info, Loader2, TriangleAlert } from "lucide-react";
import { useId, useState, useSyncExternalStore, type InputHTMLAttributes, type ReactNode } from "react";
import type { AuthErrorCode } from "@/lib/auth/service";
import { passwordRules, passwordStrength } from "@/lib/auth/validation";
import { cn } from "@/lib/utils";

/** Version A (original UI) or Version B (Signature) presentation. Behaviour is identical. */
export type Variant = "a" | "b";

/* ------------------------------------------------------------------ */
/* Messages — one place for every auth state, reused by all screens    */
/* ------------------------------------------------------------------ */

export const authErrors: Record<AuthErrorCode, { title: string; body: string }> = {
  invalid_credentials: { title: "Those details don’t match", body: "Check your email and password and try again." },
  email_in_use: { title: "That email is already registered", body: "Sign in instead, or use a different email address." },
  network: { title: "We couldn’t reach Native", body: "Check your connection and try again in a moment." },
  invalid_reset_link: { title: "This link has expired or isn’t valid", body: "Reset links work once and for a short time. Request a new one." },
  unknown: { title: "Something went wrong", body: "Please try again." },
};

export const formInvalid = { title: "Check the highlighted fields", body: "A few details need fixing before you continue." };

/** Reads one query-string value on the client without a Suspense boundary (null while prerendering). */
export function useQueryParam(name: string) {
  return useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}

/* ------------------------------------------------------------------ */
/* Notice                                                              */
/* ------------------------------------------------------------------ */

const noticeIcons = { error: CircleAlert, success: CircleCheck, info: Info, warning: TriangleAlert };

export function AuthNotice({
  tone,
  title,
  children,
  className,
}: {
  tone: "error" | "success" | "info" | "warning";
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  const Icon = noticeIcons[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-2xl px-4 py-3 text-sm",
        tone === "error" && "bg-[#fdecea] text-[#7a1f14] dark:bg-[#3a1813] dark:text-[#ffcfc6]",
        tone === "success" && "bg-mint text-forest",
        tone === "info" && "bg-sand text-ink/85",
        tone === "warning" && "bg-[#fdf1dc] text-[#6b4504] dark:bg-[#33270c] dark:text-[#f6d48e]",
        className,
      )}
    >
      <Icon className="mt-0.5 size-[18px] shrink-0" aria-hidden />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-0.5 leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  );
}

/** Small honest label on prototype-only actions. */
export function PrototypeTag() {
  return <span className="ml-1.5 rounded-full bg-spark/20 px-1.5 py-0.5 align-middle text-[0.65rem] font-bold tracking-wide text-[#7a4f00] uppercase dark:text-spark">Prototype</span>;
}

/* ------------------------------------------------------------------ */
/* Fields                                                              */
/* ------------------------------------------------------------------ */

const inputBase = (v: Variant, invalid: boolean) =>
  cn(
    "h-12 w-full bg-paper text-[0.95rem] text-ink outline-none transition-colors placeholder:text-stone/70 disabled:opacity-60",
    v === "a" ? "rounded-xl border px-4 focus:ring-2 focus:ring-forest/15" : "rounded-full border-2 bg-sand px-5",
    invalid ? "border-[#c0392b] focus:border-[#c0392b] dark:border-[#ff8a78]" : v === "a" ? "border-line focus:border-forest" : "border-transparent focus:border-forest",
  );

function FieldShell({
  id,
  label,
  optional,
  hint,
  error,
  variant,
  aside,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  variant: Variant;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={cn("font-semibold", variant === "a" ? "text-sm text-ink" : "pl-2 text-xs text-stone")}>
          {label}
          {optional && <span className="ml-1 font-normal text-stone">(optional)</span>}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 pl-1 text-xs font-medium text-[#b42318] dark:text-[#ff9f91]">
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden /> {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 pl-1 text-xs text-stone">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  variant: Variant;
  aside?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "id">;

export function TextField({ label, value, onChange, error, hint, optional, variant, aside, ...input }: FieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error} variant={variant} aside={aside}>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        required={!optional}
        className={inputBase(variant, Boolean(error))}
        {...input}
      />
    </FieldShell>
  );
}

export function PasswordField({ label, value, onChange, error, hint, variant, aside, ...input }: FieldProps) {
  const id = useId();
  const [shown, setShown] = useState(false);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} variant={variant} aside={aside}>
      <div className="relative">
        <input
          id={id}
          type={shown ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          required
          className={cn(inputBase(variant, Boolean(error)), "pr-12")}
          {...input}
        />
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? "Hide password" : "Show password"}
          aria-pressed={shown}
          aria-controls={id}
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-stone transition-colors hover:bg-forest/5 hover:text-forest focus-visible:outline-2 focus-visible:outline-forest"
        >
          {shown ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
        </button>
      </div>
    </FieldShell>
  );
}

/** Strength bar plus the rule checklist, shown under a new password. */
export function PasswordStrengthMeter({ password }: { password: string }) {
  const s = passwordStrength(password);
  const colour = ["bg-line", "bg-[#c0392b]", "bg-spark", "bg-forest-light", "bg-forest"][s.score];
  return (
    <div className="mt-2.5 pl-1" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden>
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={cn("h-1.5 rounded-full transition-colors", i <= s.score && password ? colour : "bg-line")} />
          ))}
        </div>
        <span className="w-16 text-right text-xs font-semibold text-stone">{password ? s.label : ""}</span>
      </div>
      <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs sm:grid-cols-2">
        {passwordRules.map((r) => {
          const ok = s.passed.has(r.id);
          return (
            <li key={r.id} className={cn("flex items-center gap-1.5", ok ? "text-forest" : "text-stone")}>
              <Check className={cn("size-3.5", ok ? "opacity-100" : "opacity-30")} aria-hidden />
              {r.label}
              <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Checkbox({ checked, onChange, children, error, variant }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string; variant: Variant }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-ink/85">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("mt-0.5 size-[18px] shrink-0 cursor-pointer accent-[#1d6a44]", variant === "b" && "rounded-full")}
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 pl-1 text-xs font-medium text-[#b42318] dark:text-[#ff9f91]">
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ loading, children, loadingText, variant, disabled }: { loading: boolean; children: ReactNode; loadingText: string; variant: Variant; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      aria-busy={loading}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-[0.95rem] font-semibold text-on-forest transition-colors hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60",
        variant === "b" && "h-13",
      )}
    >
      {loading && <Loader2 className="size-[18px] animate-spin" aria-hidden />}
      {loading ? loadingText : children}
    </button>
  );
}

export function SecondaryLink({ href, children, variant }: { href: string; children: ReactNode; variant: Variant }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center rounded-full text-[0.95rem] font-semibold text-forest transition-colors",
        variant === "a" ? "border border-line bg-paper hover:border-forest/40" : "border-2 border-forest hover:bg-forest hover:text-on-forest",
      )}
    >
      {children}
    </Link>
  );
}

/** Screen heading block used by every auth screen. */
export function AuthHeading({ title, children, variant }: { title: string; children?: ReactNode; variant: Variant }) {
  return (
    <div className={variant === "b" ? "text-center" : undefined}>
      <h1 className={cn("text-forest", variant === "a" ? "font-display text-[2.1rem] leading-tight font-semibold sm:text-[2.5rem]" : "text-3xl sm:text-4xl")}>{title}</h1>
      {children && <p className={cn("mt-2 text-stone", variant === "b" && "mx-auto max-w-sm")}>{children}</p>}
    </div>
  );
}

/** Round status icon for confirmation screens. */
export function StatusIcon({ tone, children }: { tone: "success" | "info" | "warning"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "grid size-14 place-items-center rounded-full",
        tone === "success" && "bg-mint text-forest",
        tone === "info" && "bg-sand text-forest",
        tone === "warning" && "bg-[#fdf1dc] text-[#8a5a00] dark:bg-[#33270c] dark:text-[#f6d48e]",
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}
