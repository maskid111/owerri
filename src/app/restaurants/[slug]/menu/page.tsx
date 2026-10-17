import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuView } from "@/components/menu-view";
import { areaName, getMenu, getRestaurant, restaurants } from "@/lib/data";

export function generateStaticParams() {
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/restaurants/[slug]/menu">): Promise<Metadata> {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) return { title: "Not found" };
  return { title: `${r.name} menu`, description: `Order from ${r.name} in ${areaName(r.area)}, Owerri — ${r.type}.` };
}

export default async function MenuPage({ params }: PageProps<"/restaurants/[slug]/menu">) {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) notFound();
  return <MenuView restaurant={r} menu={getMenu(r)} />;
}
