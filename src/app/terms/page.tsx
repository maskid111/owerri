import type { Metadata } from "next";
import { Design } from "@/components/design";
import { LegalDraft } from "@/components/legal-draft";

export const metadata: Metadata = { title: "Terms of Service", description: "Native terms (draft)." };

export default function Page() {
  const body = "These terms will explain how you can use Native — browsing, accounts, ordering from restaurants, payments, cancellations and refunds.";
  return <Design a={<LegalDraft title="Terms of Service" body={body} variant="a" />} b={<LegalDraft title="Terms of Service" body={body} variant="b" />} />;
}
