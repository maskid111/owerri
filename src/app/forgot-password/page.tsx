import type { Metadata } from "next";
import { AuthShell, SigAuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forms";
import { Design } from "@/components/design";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset the password for your Native account.",
  robots: { index: false },
};

export default function Page() {
  return (
    <Design
      a={
        <AuthShell photo="spices" photoAlt="Bowls of ground spices" caption="It happens to everyone. Let’s get you back to the table.">
          <ForgotPasswordForm variant="a" />
        </AuthShell>
      }
      b={
        <SigAuthShell>
          <ForgotPasswordForm variant="b" />
        </SigAuthShell>
      }
    />
  );
}
