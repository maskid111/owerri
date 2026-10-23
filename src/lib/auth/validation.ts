/**
 * Form validation for the authentication screens. Pure functions, no UI or storage — reusable on a
 * server action or API route when a real authentication provider is connected.
 */

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Enter your email address.";
  if (!EMAIL.test(v)) return "Enter a valid email address, like name@example.com.";
}

export function validateName(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Enter your full name.";
  if (v.length < 2) return "Your name looks too short.";
  if (v.length > 80) return "Keep your name under 80 characters.";
}

/* ------------------------------------------------------------------ */
/* Nigerian phone numbers                                              */
/* ------------------------------------------------------------------ */

/** National significant number (10 digits, e.g. 8031234567) from 0803…, +234803…, 234803… or 803…; null if invalid. */
export function nationalNumber(value: string): string | null {
  let d = value.replace(/\D/g, "");
  if (d.startsWith("234")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  return /^[789][01]\d{8}$/.test(d) ? d : null;
}

/** Formats as the user types: "0803 123 4567", or "+234 803 123 4567" when they start with +234. */
export function formatNigerianPhone(value: string): string {
  const intl = value.trim().startsWith("+");
  let d = value.replace(/\D/g, "");
  if (intl) {
    d = d.slice(0, 13);
    const rest = d.slice(3);
    return ["+" + d.slice(0, 3), rest.slice(0, 3), rest.slice(3, 6), rest.slice(6)].filter(Boolean).join(" ");
  }
  d = d.slice(0, 11);
  return [d.slice(0, 4), d.slice(4, 7), d.slice(7)].filter(Boolean).join(" ");
}

/** "+234 803 123 4567" for storage and display. */
export const toE164Display = (national: string) => `+234 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;

/** Phone is optional; when given it must be a valid Nigerian mobile number. */
export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return;
  if (!nationalNumber(value)) return "Enter a Nigerian mobile number, like 0803 123 4567.";
}

/* ------------------------------------------------------------------ */
/* Passwords                                                           */
/* ------------------------------------------------------------------ */

export const passwordRules = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "letter", label: "Upper and lower case letters", test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: "number", label: "A number", test: (p: string) => /\d/.test(p) },
  { id: "symbol", label: "A symbol, like ! or #", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export type PasswordStrength = { score: 0 | 1 | 2 | 3 | 4; label: "Too short" | "Weak" | "Fair" | "Good" | "Strong"; passed: Set<string> };

export function passwordStrength(p: string): PasswordStrength {
  const passed = new Set(passwordRules.filter((r) => r.test(p)).map((r) => r.id));
  if (!passed.has("length")) return { score: p ? 1 : 0, label: "Too short", passed };
  const score = Math.min(4, passed.size + (p.length >= 12 ? 1 : 0) - 1) as PasswordStrength["score"];
  const label = (["Too short", "Weak", "Fair", "Good", "Strong"] as const)[Math.max(1, score)];
  return { score: Math.max(1, score) as PasswordStrength["score"], label, passed };
}

/** New passwords need 8+ characters and at least "Fair" strength (two more rules beyond length). */
export function validateNewPassword(p: string): string | undefined {
  if (!p) return "Create a password.";
  if (p.length < 8) return "Use at least 8 characters.";
  if (passwordStrength(p).score < 2) return "Add upper and lower case letters, a number or a symbol.";
}

export function validateConfirm(p: string, confirm: string): string | undefined {
  if (!confirm) return "Confirm your password.";
  if (p !== confirm) return "Passwords don’t match.";
}

/* ------------------------------------------------------------------ */
/* Return-to-page handling                                             */
/* ------------------------------------------------------------------ */

const AUTH_ROUTES = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/verify-email"];

/** Only same-site paths are allowed as a return destination (never another origin or an auth screen). */
export function safeNext(next: string | null | undefined, fallback = "/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return AUTH_ROUTES.some((r) => next === r || next.startsWith(`${r}?`) || next.startsWith(`${r}/`)) ? fallback : next;
}

/** Appends `?next=` to an auth route when there is somewhere sensible to return to. */
export function withNext(route: string, next?: string | null) {
  const target = safeNext(next, "");
  return target && target !== "/" ? `${route}?next=${encodeURIComponent(target)}` : route;
}
