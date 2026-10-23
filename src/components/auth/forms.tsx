"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, MailCheck, MailQuestion, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/session";
import { DEMO_ACCOUNT, DEMO_RESET_TOKEN, authService, type AuthErrorCode } from "@/lib/auth/service";
import {
  formatNigerianPhone,
  nationalNumber,
  safeNext,
  toE164Display,
  validateConfirm,
  validateEmail,
  validateName,
  validateNewPassword,
  validatePhone,
  withNext,
  type FieldErrors,
} from "@/lib/auth/validation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  AuthHeading,
  AuthNotice,
  authErrors,
  Checkbox,
  formInvalid,
  PasswordField,
  PasswordStrengthMeter,
  PrototypeTag,
  SecondaryLink,
  StatusIcon,
  SubmitButton,
  TextField,
  useQueryParam,
  type Variant,
} from "./auth-ui";

const linkCls = "font-semibold text-forest underline-offset-4 hover:underline";

/** Moves focus to the first invalid field after a failed submit. */
function focusFirstInvalid(form: HTMLFormElement | null) {
  window.setTimeout(() => form?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(), 0);
}

function ErrorNotice({ code }: { code: AuthErrorCode | "invalid" | null }) {
  if (!code) return null;
  const m = code === "invalid" ? formInvalid : authErrors[code];
  return (
    <AuthNotice tone="error" title={m.title}>
      {m.body}
    </AuthNotice>
  );
}

/* ------------------------------------------------------------------ */
/* Sign in                                                             */
/* ------------------------------------------------------------------ */

export function SignInForm({ variant }: { variant: Variant }) {
  const router = useRouter();
  const { status, user, signIn } = useAuth();
  const next = safeNext(useQueryParam("next"));
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<FieldErrors<"email" | "password">>({});
  const [formError, setFormError] = useState<AuthErrorCode | "invalid" | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (status === "signedIn" && user && !done && !loading) return <AlreadySignedIn name={user.name} next={next} variant={variant} />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = { email: validateEmail(email), password: password ? undefined : "Enter your password." };
    setErrors(errs);
    if (errs.email || errs.password) {
      setFormError("invalid");
      focusFirstInvalid(formRef.current);
      return;
    }
    setFormError(null);
    setLoading(true);
    const res = await signIn(email, password, remember);
    setLoading(false);
    if (!res.ok) {
      setFormError(res.error);
      if (res.error === "invalid_credentials") setPassword("");
      return;
    }
    setDone(true);
    toast({ tone: "success", title: `Welcome back, ${res.data.name.split(" ")[0]}.`, body: "You’re signed in." });
    router.replace(next);
  };

  return (
    <div className="space-y-7">
      <AuthHeading title="Welcome back." variant={variant}>
        Sign in to track your orders, keep your favourites and pick up where you left off.
      </AuthHeading>

      {done ? (
        <AuthNotice tone="success" title="You’re signed in">
          Taking you back…
        </AuthNotice>
      ) : (
        <form ref={formRef} noValidate onSubmit={submit} className="space-y-4">
          <ErrorNotice code={formError} />
          <TextField
            variant={variant}
            label="Email address"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
            }}
            error={errors.email}
          />
          <PasswordField
            variant={variant}
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (errors.password) setErrors((x) => ({ ...x, password: undefined }));
            }}
            error={errors.password}
            aside={
              <Link href={withNext("/forgot-password", next)} className="text-xs font-semibold text-forest underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            }
          />
          <Checkbox variant={variant} checked={remember} onChange={setRemember}>
            Keep me signed in on this device
          </Checkbox>
          <SubmitButton variant={variant} loading={loading} loadingText="Signing in…">
            Sign in
          </SubmitButton>
        </form>
      )}

      <p className={cn("text-sm text-stone", variant === "b" && "text-center")}>
        New to Native?{" "}
        <Link href={withNext("/sign-up", next)} className={linkCls}>
          Create an account
        </Link>
      </p>

      <DemoAccountHint
        onUse={() => {
          setEmail(DEMO_ACCOUNT.email);
          setPassword(DEMO_ACCOUNT.password);
          setErrors({});
          setFormError(null);
        }}
      />
    </div>
  );
}

function DemoAccountHint({ onUse }: { onUse: () => void }) {
  if (!authService.isPrototype) return null;
  return (
    <div className="rounded-2xl border border-dashed border-line px-4 py-3 text-xs leading-relaxed text-stone">
      <p className="font-semibold text-ink">
        Testing the prototype? <PrototypeTag />
      </p>
      <p className="mt-1">
        Use the demo account <span className="font-mono text-ink">{DEMO_ACCOUNT.email}</span> / <span className="font-mono text-ink">{DEMO_ACCOUNT.password}</span>. Accounts you create here are remembered on
        this device only, and passwords are never stored.
      </p>
      <button type="button" onClick={onUse} className="mt-2 font-semibold text-forest underline underline-offset-4">
        Fill in the demo account
      </button>
    </div>
  );
}

function AlreadySignedIn({ name, next, variant }: { name: string; next: string; variant: Variant }) {
  return (
    <div className={cn("space-y-6", variant === "b" && "text-center")}>
      <div className={cn(variant === "b" && "flex justify-center")}>
        <StatusIcon tone="success">
          <ShieldCheck className="size-6" />
        </StatusIcon>
      </div>
      <AuthHeading title="You’re signed in." variant={variant}>
        You’re signed in as {name}.
      </AuthHeading>
      <div className="space-y-3">
        <SecondaryLink href={next} variant={variant}>
          Continue
        </SecondaryLink>
        <p className="text-sm text-stone">
          Not you? Sign out from{" "}
          <Link href="/account" className={linkCls}>
            your profile
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sign up                                                             */
/* ------------------------------------------------------------------ */

type SignUpField = "name" | "email" | "phone" | "password" | "confirm" | "terms";

export function SignUpForm({ variant }: { variant: Variant }) {
  const router = useRouter();
  const { status, user, signUp } = useAuth();
  const next = safeNext(useQueryParam("next"));
  const formRef = useRef<HTMLFormElement>(null);
  const [v, setV] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<SignUpField>>({});
  const [formError, setFormError] = useState<AuthErrorCode | "invalid" | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  if (status === "signedIn" && user && !created && !loading) return <AlreadySignedIn name={user.name} next={next} variant={variant} />;

  const set = (k: keyof typeof v) => (value: string) => {
    setV((x) => ({ ...x, [k]: k === "phone" ? formatNigerianPhone(value) : value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FieldErrors<SignUpField> = {
      name: validateName(v.name),
      email: validateEmail(v.email),
      phone: validatePhone(v.phone),
      password: validateNewPassword(v.password),
      confirm: validateConfirm(v.password, v.confirm),
      terms: terms ? undefined : "Please agree to the terms to continue.",
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) {
      setFormError("invalid");
      focusFirstInvalid(formRef.current);
      return;
    }
    setFormError(null);
    setLoading(true);
    const national = nationalNumber(v.phone);
    const res = await signUp({ name: v.name, email: v.email, phone: national ? toE164Display(national) : undefined, password: v.password });
    setLoading(false);
    if (!res.ok) {
      setFormError(res.error);
      if (res.error === "email_in_use") setErrors((x) => ({ ...x, email: "This email is already registered." }));
      return;
    }
    setCreated(res.data.email);
    toast({ tone: "success", title: "Account created", body: "One more step: verify your email." });
    router.push(withNext("/verify-email", next));
  };

  if (created)
    return (
      <AuthNotice tone="success" title="Account created">
        Taking you to email verification…
      </AuthNotice>
    );

  return (
    <div className="space-y-7">
      <AuthHeading title="Join Native." variant={variant}>
        Discover places, save your favourites and manage your food orders in one place.
      </AuthHeading>

      <form ref={formRef} noValidate onSubmit={submit} className="space-y-4">
        <ErrorNotice code={formError === "email_in_use" ? null : formError} />
        {formError === "email_in_use" && (
          <AuthNotice tone="error" title={authErrors.email_in_use.title}>
            <Link href={withNext("/sign-in", next)} className="font-semibold underline underline-offset-4">
              Sign in instead
            </Link>{" "}
            or use a different email address.
          </AuthNotice>
        )}
        <TextField variant={variant} label="Full name" autoComplete="name" placeholder="e.g. Ada Okafor" value={v.name} onChange={set("name")} error={errors.name} />
        <TextField variant={variant} label="Email address" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={v.email} onChange={set("email")} error={errors.email} />
        <TextField
          variant={variant}
          label="Phone number"
          optional
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0803 123 4567"
          value={v.phone}
          onChange={set("phone")}
          error={errors.phone}
          hint="Nigerian mobile number, for delivery updates."
        />
        <div>
          <PasswordField variant={variant} label="Password" autoComplete="new-password" value={v.password} onChange={set("password")} error={errors.password} />
          <PasswordStrengthMeter password={v.password} />
        </div>
        <PasswordField variant={variant} label="Confirm password" autoComplete="new-password" value={v.confirm} onChange={set("confirm")} error={errors.confirm} />
        <Checkbox
          variant={variant}
          checked={terms}
          onChange={(c) => {
            setTerms(c);
            if (c) setErrors((x) => ({ ...x, terms: undefined }));
          }}
          error={errors.terms}
        >
          I agree to Native’s{" "}
          <Link href="/terms" className={linkCls}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className={linkCls}>
            Privacy Policy
          </Link>
          .
        </Checkbox>
        <SubmitButton variant={variant} loading={loading} loadingText="Creating your account…">
          Create account
        </SubmitButton>
      </form>

      <p className={cn("text-sm text-stone", variant === "b" && "text-center")}>
        Already have an account?{" "}
        <Link href={withNext("/sign-in", next)} className={linkCls}>
          Sign in
        </Link>
      </p>
      {authService.isPrototype && (
        <p className={cn("text-xs text-stone", variant === "b" && "text-center")}>
          Prototype: your profile is kept on this device only and your password is never stored. No email is sent.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Forgot password                                                     */
/* ------------------------------------------------------------------ */

export function ForgotPasswordForm({ variant }: { variant: Variant }) {
  const next = useQueryParam("next");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<AuthErrorCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    setFormError(null);
    setLoading(true);
    const res = await authService.requestPasswordReset(email);
    setLoading(false);
    if (!res.ok) return setFormError(res.error);
    setSentTo(email.trim());
  };

  if (sentTo)
    return (
      <div className={cn("space-y-6", variant === "b" && "text-center")}>
        <div className={cn(variant === "b" && "flex justify-center")}>
          <StatusIcon tone="info">
            <MailQuestion className="size-6" />
          </StatusIcon>
        </div>
        <AuthHeading title="Check your email." variant={variant}>
          If an account exists for <span className="font-semibold text-ink">{sentTo}</span>, the next step is to open the reset link we email to it.
        </AuthHeading>
        {authService.isPrototype && (
          <AuthNotice tone="warning" title="Prototype: no email was sent">
            Email isn’t connected yet. To try the next screen, open the{" "}
            <Link href={`/reset-password?token=${DEMO_RESET_TOKEN}`} className="font-semibold underline underline-offset-4">
              demo reset link
            </Link>
            .
          </AuthNotice>
        )}
        <div className="space-y-3">
          <SecondaryLink href={withNext("/sign-in", next)} variant={variant}>
            Back to sign in
          </SecondaryLink>
          <button type="button" onClick={() => setSentTo(null)} className="w-full text-sm font-semibold text-forest underline-offset-4 hover:underline">
            Use a different email
          </button>
        </div>
      </div>
    );

  return (
    <div className="space-y-7">
      <AuthHeading title="Forgot your password?" variant={variant}>
        Enter the email you use for Native and we’ll send you a link to choose a new password.
      </AuthHeading>
      <form noValidate onSubmit={submit} className="space-y-4">
        {formError && (
          <AuthNotice tone="error" title={authErrors[formError].title}>
            {authErrors[formError].body}
          </AuthNotice>
        )}
        <TextField
          variant={variant}
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(x) => {
            setEmail(x);
            if (error) setError(undefined);
          }}
          error={error}
        />
        <SubmitButton variant={variant} loading={loading} loadingText="Sending…">
          Send reset link
        </SubmitButton>
      </form>
      <p className={cn("text-sm text-stone", variant === "b" && "text-center")}>
        Remembered it?{" "}
        <Link href={withNext("/sign-in", next)} className={linkCls}>
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reset password (link from the email)                                */
/* ------------------------------------------------------------------ */

export function ResetPasswordForm({ variant }: { variant: Variant }) {
  const token = useQueryParam("token");
  const [check, setCheck] = useState<"checking" | "valid" | "invalid">("checking");
  const [v, setV] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors<"password" | "confirm">>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let live = true;
    authService.checkResetToken(token).then((res) => live && setCheck(res.ok ? "valid" : "invalid"));
    return () => {
      live = false;
    };
  }, [token]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = { password: validateNewPassword(v.password), confirm: validateConfirm(v.password, v.confirm) };
    setErrors(errs);
    if (errs.password || errs.confirm) return;
    setLoading(true);
    const res = await authService.resetPassword(token ?? "", v.password);
    setLoading(false);
    if (!res.ok) return setCheck("invalid");
    setDone(true);
  };

  const centred = variant === "b" && "text-center";

  if (check === "checking")
    return (
      <AuthNotice tone="info" title="Checking your reset link…">
        This only takes a moment.
      </AuthNotice>
    );

  if (check === "invalid")
    return (
      <div className={cn("space-y-6", centred)}>
        <AuthHeading title="Reset link expired." variant={variant} />
        <AuthNotice tone="error" title={authErrors.invalid_reset_link.title}>
          {authErrors.invalid_reset_link.body}
        </AuthNotice>
        <div className="space-y-3">
          <SecondaryLink href="/forgot-password" variant={variant}>
            Request a new link
          </SecondaryLink>
          <Link href="/sign-in" className="block text-center text-sm font-semibold text-forest underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );

  if (done)
    return (
      <div className={cn("space-y-6", centred)}>
        <div className={cn(variant === "b" && "flex justify-center")}>
          <StatusIcon tone="success">
            <KeyRound className="size-6" />
          </StatusIcon>
        </div>
        <AuthHeading title="Password updated." variant={variant}>
          You can now sign in with your new password.
        </AuthHeading>
        {authService.isPrototype && (
          <AuthNotice tone="warning" title="Prototype: nothing was changed">
            No real account was updated — this screen shows what happens after a successful reset.
          </AuthNotice>
        )}
        <SecondaryLink href="/sign-in" variant={variant}>
          Sign in
        </SecondaryLink>
      </div>
    );

  return (
    <div className="space-y-7">
      <AuthHeading title="Choose a new password." variant={variant}>
        Make it something you haven’t used before.
      </AuthHeading>
      <form noValidate onSubmit={submit} className="space-y-4">
        <div>
          <PasswordField
            variant={variant}
            label="New password"
            autoComplete="new-password"
            value={v.password}
            onChange={(x) => {
              setV((s) => ({ ...s, password: x }));
              setErrors((s) => ({ ...s, password: undefined }));
            }}
            error={errors.password}
          />
          <PasswordStrengthMeter password={v.password} />
        </div>
        <PasswordField
          variant={variant}
          label="Confirm new password"
          autoComplete="new-password"
          value={v.confirm}
          onChange={(x) => {
            setV((s) => ({ ...s, confirm: x }));
            setErrors((s) => ({ ...s, confirm: undefined }));
          }}
          error={errors.confirm}
        />
        <SubmitButton variant={variant} loading={loading} loadingText="Saving…">
          Save new password
        </SubmitButton>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Verify email                                                        */
/* ------------------------------------------------------------------ */

export function VerifyEmailView({ variant }: { variant: Variant }) {
  const { status, user, simulateVerification } = useAuth();
  const next = safeNext(useQueryParam("next"));
  const [resend, setResend] = useState<"idle" | "loading" | "done" | AuthErrorCode>("idle");
  const centred = variant === "b" && "text-center";

  if (status === "loading") return <AuthNotice tone="info" title="Loading your account…" />;

  if (!user)
    return (
      <div className={cn("space-y-6", centred)}>
        <AuthHeading title="Verify your email." variant={variant}>
          Sign in to see your verification status.
        </AuthHeading>
        <SecondaryLink href={withNext("/sign-in", "/verify-email")} variant={variant}>
          Sign in
        </SecondaryLink>
      </div>
    );

  if (user.emailVerified)
    return (
      <div className={cn("space-y-6", centred)}>
        <div className={cn(variant === "b" && "flex justify-center")}>
          <StatusIcon tone="success">
            <MailCheck className="size-6" />
          </StatusIcon>
        </div>
        <AuthHeading title="Email verified." variant={variant}>
          <span className="font-semibold text-ink">{user.email}</span> is confirmed. You’re all set.
        </AuthHeading>
        <SecondaryLink href={next} variant={variant}>
          Continue
        </SecondaryLink>
      </div>
    );

  const doResend = async () => {
    setResend("loading");
    const res = await authService.resendVerification(user.email);
    setResend(res.ok ? "done" : res.error);
  };

  return (
    <div className={cn("space-y-6", centred)}>
      <div className={cn(variant === "b" && "flex justify-center")}>
        <StatusIcon tone="info">
          <MailQuestion className="size-6" />
        </StatusIcon>
      </div>
      <AuthHeading title="Verify your email." variant={variant}>
        A real Native account needs a verified email to keep it secure. The verification link goes to{" "}
        <span className="font-semibold break-all text-ink">{user.email}</span>.
      </AuthHeading>

      {resend === "done" && (
        <AuthNotice tone="warning" title="Prototype: no email was sent">
          Email delivery isn’t connected yet. A real account would receive a new verification link.
        </AuthNotice>
      )}
      {resend !== "idle" && resend !== "loading" && resend !== "done" && (
        <AuthNotice tone="error" title={authErrors[resend].title}>
          {authErrors[resend].body}
        </AuthNotice>
      )}

      <div className="space-y-3 text-left">
        <button
          type="button"
          onClick={doResend}
          disabled={resend === "loading"}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-forest text-[0.95rem] font-semibold text-on-forest transition-colors hover:bg-forest-light disabled:opacity-60"
        >
          {resend === "loading" ? "Sending…" : "Resend verification email"}
        </button>
        {authService.isPrototype && (
          <button
            type="button"
            onClick={() => {
              simulateVerification();
              toast({ tone: "success", title: "Email marked as verified", body: "Prototype only — no link was opened." });
            }}
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-dashed border-line text-sm font-semibold text-forest hover:border-forest/40"
          >
            Simulate verification <PrototypeTag />
          </button>
        )}
      </div>
      <p className="text-sm text-stone">
        <Link href={next} className={linkCls}>
          Continue browsing
        </Link>{" "}
        ·{" "}
        <Link href="/sign-in" className={linkCls}>
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
