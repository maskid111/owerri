/**
 * Authentication service boundary.
 *
 * Screens and components only talk to `authService` (through `useAuth`), never to storage. Today it is a
 * PROTOTYPE that runs entirely in the browser; to go live, replace `mockAuthService` with an implementation
 * of the same `AuthService` interface backed by a real provider (secure, HTTP-only sessions; server-side
 * password hashing; real email delivery). Nothing here is secure — client-side state is not authentication.
 *
 * What the prototype does:
 * - The demo account (DEMO_ACCOUNT below) signs in with its published demo password.
 * - Accounts created on the sign-up page are remembered on this device as a profile only (name, email,
 *   phone). Passwords are never stored anywhere, so those accounts sign in with any password that meets
 *   the minimum length — clearly labelled on the sign-in screen.
 * - `offline@native.test` simulates a network / service failure for testing error states.
 * - No email is ever sent: password-reset and verification requests only return prototype results.
 */

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string; // ISO
  isDemo?: boolean;
};

export type AuthErrorCode = "invalid_credentials" | "email_in_use" | "network" | "invalid_reset_link" | "unknown";

export type AuthResult<T = User> = { ok: true; data: T } | { ok: false; error: AuthErrorCode };

export type SignUpInput = { name: string; email: string; phone?: string; password: string };

export interface AuthService {
  /** Whether this service is the in-browser prototype (screens show prototype notices when true). */
  readonly isPrototype: boolean;
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(input: SignUpInput): Promise<AuthResult>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<AuthResult<null>>;
  resendVerification(email: string): Promise<AuthResult<null>>;
  /** Checks a password-reset link token. */
  checkResetToken(token: string | null): Promise<AuthResult<null>>;
  resetPassword(token: string, password: string): Promise<AuthResult<null>>;
}

/** Published demo credentials for testing the prototype. Not a real account. */
export const DEMO_ACCOUNT = {
  email: "demo@native.test",
  password: "NativeDemo1!",
  user: {
    id: "demo",
    name: "Ada Okafor",
    email: "demo@native.test",
    phone: "+234 803 000 0000",
    emailVerified: true,
    createdAt: "2026-10-01T09:00:00.000Z",
    isDemo: true,
  } satisfies User,
};

/** Use this email anywhere to see the network / service failure state. */
export const FAILURE_EMAIL = "offline@native.test";

/** Prototype reset-link token that opens the "choose a new password" form; any other token is treated as expired. */
export const DEMO_RESET_TOKEN = "demo-reset";

const ACCOUNTS_KEY = "native:demo-accounts"; // profiles only — never passwords
const delay = (ms = 850) => new Promise((r) => setTimeout(r, ms));
const norm = (email: string) => email.trim().toLowerCase();

function readAccounts(): User[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? (list.filter((u) => u && typeof u.email === "string" && typeof u.name === "string") as User[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(list: User[]) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable: the account lasts for this page only */
  }
}

export const mockAuthService: AuthService = {
  isPrototype: true,

  async signIn(email, password) {
    await delay();
    const e = norm(email);
    if (e === FAILURE_EMAIL) return { ok: false, error: "network" };
    if (e === DEMO_ACCOUNT.email) return password === DEMO_ACCOUNT.password ? { ok: true, data: DEMO_ACCOUNT.user } : { ok: false, error: "invalid_credentials" };
    const account = readAccounts().find((u) => u.email === e);
    return account && password.length >= 8 ? { ok: true, data: account } : { ok: false, error: "invalid_credentials" };
  },

  async signUp({ name, email, phone }) {
    await delay(1000);
    const e = norm(email);
    if (e === FAILURE_EMAIL) return { ok: false, error: "network" };
    const accounts = readAccounts();
    if (e === DEMO_ACCOUNT.email || accounts.some((u) => u.email === e)) return { ok: false, error: "email_in_use" };
    const user: User = { id: `local-${Date.now().toString(36)}`, name: name.trim(), email: e, phone, emailVerified: false, createdAt: new Date().toISOString() };
    writeAccounts([...accounts, user]);
    return { ok: true, data: user };
  },

  async signOut() {
    await delay(300);
  },

  async requestPasswordReset(email) {
    await delay();
    return norm(email) === FAILURE_EMAIL ? { ok: false, error: "network" } : { ok: true, data: null };
  },

  async resendVerification(email) {
    await delay();
    return norm(email) === FAILURE_EMAIL ? { ok: false, error: "network" } : { ok: true, data: null };
  },

  async checkResetToken(token) {
    await delay(500);
    return token === DEMO_RESET_TOKEN ? { ok: true, data: null } : { ok: false, error: "invalid_reset_link" };
  },

  async resetPassword(token) {
    await delay();
    return token === DEMO_RESET_TOKEN ? { ok: true, data: null } : { ok: false, error: "invalid_reset_link" };
  },
};

/** The service the app uses. Swap this export for a real implementation later. */
export const authService: AuthService = mockAuthService;

/** Marks a prototype account as verified (stand-in for clicking a real verification link). */
export function markPrototypeVerified(email: string) {
  const e = norm(email);
  writeAccounts(readAccounts().map((u) => (u.email === e ? { ...u, emailVerified: true } : u)));
}
