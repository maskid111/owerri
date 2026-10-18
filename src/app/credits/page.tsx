import type { Metadata } from "next";
import { PageHeader, Photo } from "@/components/ui";
import { videoCredits, wikimediaCredits } from "@/lib/images";
import { Design } from "@/components/design";
import { SigCredits } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Sources and licences for the photography used on Native.",
};

function CreditsPage() {
  return (
    <>
      <PageHeader
        title="Photo credits"
        description="Photography on this site illustrates dishes, venues and moods. Photos are not of the specific sample businesses or events listed."
      />
      <section className="container-x max-w-3xl space-y-6 py-6 lg:mx-0 lg:py-10">
        <div className="rounded-[1.25rem] border border-line/70 bg-paper p-5 shadow-card">
          <h2 className="text-xl font-semibold text-forest">Homepage video</h2>
          {videoCredits.map((v) => (
            <p key={v.file} className="mt-2 text-sm text-ink/85">
              <span className="font-semibold text-forest">{v.title}</span> — {v.author}.
            </p>
          ))}
        </div>
        <div className="rounded-[1.25rem] border border-line/70 bg-paper p-5 shadow-card">
          <h2 className="text-xl font-semibold text-forest">Unsplash</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">
            Most photographs are from <a className="font-semibold underline underline-offset-4" href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a> and are used
            under the <a className="font-semibold underline underline-offset-4" href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash License</a>. Thank you to the photographers who share their work there.
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-line/70 bg-paper p-5 shadow-card">
          <h2 className="text-xl font-semibold text-forest">Wikimedia Commons</h2>
          <p className="mt-2 text-sm text-ink/85">The following images were resized and recompressed for the web. Each is licensed under CC BY-SA 4.0.</p>
          <ul className="mt-4 divide-y divide-line">
            {wikimediaCredits.map((c) => (
              <li key={c.image} className="flex items-center gap-3 py-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                  <Photo name={c.image} alt={c.title} sizes="56px" />
                </span>
                <span className="min-w-0 text-sm">
                  <a href={c.url} target="_blank" rel="noreferrer" className="block truncate font-semibold text-forest underline underline-offset-4">
                    {c.title}
                  </a>
                  <span className="text-stone">
                    by {c.author} ·{" "}
                    <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline underline-offset-4">
                      {c.license}
                    </a>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return <Design a={<CreditsPage />} b={<SigCredits />} />;
}
