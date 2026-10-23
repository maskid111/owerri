import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import type { ImageName } from "@/lib/images";
import { BRAND, Wordmark } from "../brand";
import { Photo } from "../ui";

/**
 * Version A auth layout: the form on the left with the Native logo and tagline; on desktop a food or
 * culture photograph on the right. Phones get the form only.
 */
export function AuthShell({ children, photo, photoAlt, caption }: { children: ReactNode; photo: ImageName; photoAlt: string; caption: string }) {
  return (
    <div className="container-x grid grid-cols-1 gap-10 pt-6 pb-14 lg:grid-cols-[1fr_1.05fr] lg:items-stretch lg:gap-14 lg:pt-10 lg:pb-20">
      <div className="mx-auto w-full max-w-md lg:py-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Native home">
            <Wordmark size="md" />
          </Link>
          <BrowseLink />
        </div>
        <div className="mt-10">{children}</div>
      </div>
      <figure className="relative isolate hidden min-h-[36rem] overflow-hidden rounded-[2rem] lg:flex lg:items-end">
        <Photo name={photo} alt={photoAlt} sizes="(min-width: 1024px) 50vw, 0px" priority className="-z-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/85 via-forest-deep/20 to-transparent" aria-hidden />
        <figcaption className="p-10 text-white">
          <span className="block h-[3px] w-8 rounded-full bg-spark" aria-hidden />
          <p className="mt-4 font-display text-3xl leading-tight">{BRAND.tagline}.</p>
          <p className="mt-2 max-w-sm text-white/80">{caption}</p>
        </figcaption>
      </figure>
    </div>
  );
}

/** Version B auth layout: a centred rounded card on a soft mint band, logo centred above the form. */
export function SigAuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="container-x pt-6 pb-14 lg:pt-10 lg:pb-20">
      <div className="rounded-[2rem] bg-mint/70 px-3 py-6 sm:px-6 sm:py-10 lg:rounded-[2.75rem] lg:py-14">
        <div className="mx-auto w-full max-w-md rounded-[1.75rem] bg-paper px-5 py-8 shadow-lift sm:px-9 sm:py-10">
          <div className="flex justify-center">
            <Link href="/" aria-label="Native home">
              <Wordmark size="md" align="center" />
            </Link>
          </div>
          <div className="mt-8">{children}</div>
        </div>
        <div className="mt-6 flex justify-center">
          <BrowseLink />
        </div>
      </div>
    </div>
  );
}

function BrowseLink() {
  return (
    <Link href="/" className="group inline-flex items-center gap-1.5 text-sm font-medium text-stone transition-colors hover:text-forest">
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden /> Back to browsing
    </Link>
  );
}
