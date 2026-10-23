import type { Metadata } from "next";
import { AuthShell, SigAuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailView } from "@/components/auth/forms";
import { Design } from "@/components/design";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Verify the email address for your Native account.",
  robots: { index: false },
};

export default function Page() {
  return (
    <Design
      a={
        <AuthShell photo="pepper-soup-pot" photoAlt="A pot of pepper soup" caption="One quick step to keep your account secure.">
          <VerifyEmailView variant="a" />
        </AuthShell>
      }
      b={
        <SigAuthShell>
          <VerifyEmailView variant="b" />
        </SigAuthShell>
      }
    />
  );
}
