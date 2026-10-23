import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RestaurantPage } from "@/components/restaurant-page";
import { areaName, getMenu, getRestaurant, relatedRestaurants, restaurants } from "@/lib/data";
import { Design } from "@/components/design";
import { SigMenuPage } from "@/components/sig/pages";

export function generateStaticParams() {
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/restaurants/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) return { title: "Not found" };
  return { title: r.name, description: `${r.type} in ${r.area ? `${areaName(r.area)}, ` : ""}Owerri. ${r.description}` };
}

async function APage({ params }: { params: PageProps<"/restaurants/[slug]">["params"] }) {
  const { slug } = await params;
  const r = getRestaurant(slug);
  if (!r) notFound();
  return <RestaurantPage restaurant={r} menu={getMenu(r)} related={relatedRestaurants(slug)} />;
}

/** The restaurant page is the ordering page: profile, menu and add-to-cart in one screen. */
export default function Page({ params }: PageProps<"/restaurants/[slug]">) {
  return <Design a={<APage params={params} />} b={<SigMenuPage params={params} />} />;
}
