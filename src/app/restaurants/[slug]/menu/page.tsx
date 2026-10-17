import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuView } from "@/components/menu-view";
import { areaName, getMenu, getRestaurant, restaurants } from "@/lib/data";
import { Design } from "@/components/design";
import { SigMenuPage } from "@/components/sig/pages";

export function generateStaticParams() {
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/restaurants/[slug]/menu">): Promise<Metadata> {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) return { title: "Not found" };
  return { title: `${r.name} menu`, description: `Order from ${r.name} in ${areaName(r.area)}, Owerri — ${r.type}.` };
}

async function MenuPage({ params }: { params: PageProps<"/restaurants/[slug]/menu">["params"] }) {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) notFound();
  return <MenuView restaurant={r} menu={getMenu(r)} />;
}

export default function Page({ params }: PageProps<"/restaurants/[slug]/menu">) {
  return <Design a={<MenuPage params={params} />} b={<SigMenuPage params={params} />} />;
}
