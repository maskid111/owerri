import type { Metadata } from "next";
import { AuthShell, SigAuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/forms";
import { Design } from "@/components/design";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Native to track your orders and keep your favourites.",
  robots: { index: false },
};

export default function Page() {
  return (
    <Design
      a={
        <AuthShell photo="swallow-spread" photoAlt="A table of soups, swallow and small chops" caption="Track your orders, keep your favourites and pick up where you left off.">
          <SignInForm variant="a" />
        </AuthShell>
      }
      b={
        <SigAuthShell>
          <SignInForm variant="b" />
        </SigAuthShell>
      }
    />
  );
}
