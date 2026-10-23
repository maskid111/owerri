import Link from "next/link";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { ServiceArt } from "../service-art";

/** Version A service tiles: soft-coloured illustrated cards, 4 per row on phones and all 8 in a row on desktop. */
export function ServiceTiles() {
  return (
    <ul className="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
      {services.map((s) => (
        <li key={s.href}>
          <Link
            href={s.href}
            className={cn("group flex h-full flex-col items-center rounded-2xl px-1 pt-3 pb-2.5 text-center transition-transform duration-300 hover:-translate-y-0.5", s.tone)}
          >
            <ServiceArt kind={s.art} className="size-12 transition-transform duration-300 group-hover:scale-105 sm:size-14" />
            <span className="mt-1.5 text-[0.72rem] leading-tight font-semibold text-[#123a28] sm:text-sm">{s.short}</span>
            <span className="mt-0.5 hidden text-[0.7rem] leading-tight text-[#123a28]/60 sm:block">{s.hint}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
