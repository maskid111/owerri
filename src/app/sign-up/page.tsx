import type { Metadata } from "next";
import { AuthShell, SigAuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/forms";
import { Design } from "@/components/design";

export const metadata: Metadata = {
  title: "Create account",
  description: "Join Native to discover places, save favourites and manage your food orders.",
  robots: { index: false },
};

export default function Page() {
  return (
    <Design
      a={
        <AuthShell photo="market-women" photoAlt="Women selling fresh produce at a local market" caption="Discover restaurants, markets and culture — and keep everything you love in one place.">
          <SignUpForm variant="a" />
        </AuthShell>
      }
      b={
        <SigAuthShell>
          <SignUpForm variant="b" />
        </SigAuthShell>
      }
    />
  );
}
