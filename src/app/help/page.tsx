import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PatternBanner } from "@/components/native";
import { PageHeader } from "@/components/ui";
import { faqs } from "@/lib/help";
import { ContactForm } from "./contact-form";
import { Design } from "@/components/design";
import { SigHelp } from "@/components/sig/pages";

export const metadata: Metadata = { title: "Help / Support", description: "Answers to common questions about Native, orders, tickets and saved places." };



function HelpPage() {
  return (
    <>
      <PageHeader title="Help / Support" description="Quick answers, and a way to reach the Native team." />
      <div className="container-x grid gap-8 py-6 lg:grid-cols-[1.3fr_1fr] lg:py-10">
        <section>
          <h2 className="text-2xl font-semibold text-forest">Frequently asked</h2>
          <div className="mt-4 divide-y divide-line rounded-[1.25rem] border border-line/70 bg-paper shadow-card">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-forest [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm text-stone">
            Still stuck? See your <Link href="/orders" className="font-semibold text-forest underline underline-offset-4">orders</Link> or{" "}
            <Link href="/settings" className="font-semibold text-forest underline underline-offset-4">settings</Link>.
          </p>
        </section>
        <section className="space-y-5">
          <ContactForm />
          <PatternBanner eyebrow="Native" title="Native, beyond the plate." className="rounded-[1.25rem]">
            Food, culture, places and experiences — all in one place.
          </PatternBanner>
        </section>
      </div>
    </>
  );
}

export default function Page() {
  return <Design a={<HelpPage />} b={<SigHelp />} />;
}
