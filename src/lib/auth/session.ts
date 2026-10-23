"use client";

import { useCallback, useSyncExternalStore } from "react";
import { authService, markPrototypeVerified, type SignUpInput, type User } from "./service";

/**
 * Prototype session: the signed-in user's PROFILE (no password, no token) kept in localStorage when
 * "Remember me" is ticked, otherwise in sessionStorage. A real provider would use a secure HTTP-only
 * cookie instead; replace this module together with `authService`.
 * Cart, orders and saved items live in their own stores and are never touched by signing in or out.
 */

const KEY = "native:session";
type Snapshot = { status: "loading" } | { status: "signedOut" } | { status: "signedIn"; user: User };

const LOADING: Snapshot = { status: "loading" };
const SIGNED_OUT: Snapshot = { status: "signedOut" };
const listeners = new Set<() => void>();
let cache: Snapshot | null = null;

function parse(raw: string | null): User | null {
  try {
    const u = raw ? (JSON.parse(raw) as User) : null;
    return u && typeof u.email === "string" && typeof u.name === "string" ? u : null;
  } catch {
    return null;
  }
}

function read(): Snapshot {
  if (cache) return cache;
  let user: User | null = null;
  try {
    user = parse(window.localStorage.getItem(KEY)) ?? parse(window.sessionStorage.getItem(KEY));
  } catch {
    user = null;
  }
  cache = user ? { status: "signedIn", user } : SIGNED_OUT;
  return cache;
}

function write(user: User | null, remember = true) {
  try {
    window.localStorage.removeItem(KEY);
    window.sessionStorage.removeItem(KEY);
    if (user) (remember ? window.localStorage : window.sessionStorage).setItem(KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable: session lasts for this page only */
  }
  cache = user ? { status: "signedIn", user } : SIGNED_OUT;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** Initials for the avatar: "Ada Okafor" → "AO". */
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "N";

export function useAuth() {
  const snapshot = useSyncExternalStore(subscribe, read, () => LOADING);

  const signIn = useCallback(async (email: string, password: string, remember: boolean) => {
    const res = await authService.signIn(email, password);
    if (res.ok) write(res.data, remember);
    return res;
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const res = await authService.signUp(input);
    if (res.ok) write(res.data, true);
    return res;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    write(null);
  }, []);

  /** Prototype only: stands in for opening the link in a real verification email. */
  const simulateVerification = useCallback(() => {
    const s = read();
    if (s.status !== "signedIn") return;
    markPrototypeVerified(s.user.email);
    let remember = true;
    try {
      remember = window.localStorage.getItem(KEY) !== null;
    } catch {
      /* keep default */
    }
    write({ ...s.user, emailVerified: true }, remember);
  }, []);

  return {
    status: snapshot.status,
    user: snapshot.status === "signedIn" ? snapshot.user : null,
    isPrototype: authService.isPrototype,
    signIn,
    signUp,
    signOut,
    simulateVerification,
  };
}
