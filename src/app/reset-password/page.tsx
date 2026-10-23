import type { Metadata } from "next";
import { AuthShell, SigAuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/forms";
import { Design } from "@/components/design";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Choose a new password for your Native account.",
  robots: { index: false },
};

export default function Page() {
  return (
    <Design
      a={
        <AuthShell photo="spices-2" photoAlt="Spices and grains in woven bowls" caption="A fresh start — then straight back to the food.">
          <ResetPasswordForm variant="a" />
        </AuthShell>
      }
      b={
        <SigAuthShell>
          <ResetPasswordForm variant="b" />
        </SigAuthShell>
      }
    />
  );
}
