import Link from "next/link";
import { cn } from "@/lib/utils";

/** Placeholder for legal pages linked from sign-up. The final wording must come from Native’s legal review. */
export function LegalDraft({ title, body, variant }: { title: string; body: string; variant: "a" | "b" }) {
  return (
    <div className="container-x max-w-3xl py-12 lg:py-20">
      <p className="text-sm font-semibold text-stone">Draft · not yet published</p>
      <h1 className={cn("mt-2 text-forest", variant === "a" ? "font-display text-4xl font-semibold sm:text-5xl" : "text-4xl sm:text-5xl")}>{title}</h1>
      <span className="mt-4 block h-[3px] w-10 rounded-full bg-spark" aria-hidden />
      <p className="mt-6 text-lg leading-relaxed text-ink/85">{body}</p>
      <p className="mt-4 leading-relaxed text-stone">
        The final {title.toLowerCase()} will be published here before Native accepts real accounts or orders. This website is currently a prototype.
      </p>
      <Link href="/sign-up" className="mt-8 inline-block font-semibold text-forest underline underline-offset-4">
        Back to create account
      </Link>
    </div>
  );
}
