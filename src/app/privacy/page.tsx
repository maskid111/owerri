import type { Metadata } from "next";
import { Design } from "@/components/design";
import { LegalDraft } from "@/components/legal-draft";

export const metadata: Metadata = { title: "Privacy Policy", description: "Native privacy policy (draft)." };

export default function Page() {
  const body = "This policy will explain what personal information Native collects (such as your name, email, phone number and delivery address), how it is used and protected, and the choices you have.";
  return <Design a={<LegalDraft title="Privacy Policy" body={body} variant="a" />} b={<LegalDraft title="Privacy Policy" body={body} variant="b" />} />;
}
