import { NearbyCard } from "@/components/explore-card";
import { PopularDishes } from "@/components/food";
import { Hero } from "@/components/home/hero";
import { CultureBanner, FeaturedSpotlight, homeScroller, HomeHeading, HomeShortcuts, PlacesToExploreCard } from "@/components/home/sections";
import { getFeaturedRestaurant, nearbyItems, popularDishes } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Design } from "@/components/design";
import { SigHome } from "@/components/sig/home";

/**
 * Version A homepage, following the reference: food hero, search, six shortcuts, then the featured
 * restaurant spotlight (Annie’s Native Kitchen) beside a place to explore, Popular Dishes, Nearby and a
 * culture banner.
 */
function HomePage() {
  return (
    <>
      <Hero />

      <section aria-label="Services" className="container-x pt-4 sm:pt-6">
        <HomeShortcuts variant="a" />
      </section>

      <section className="container-x pt-6 sm:pt-9">
        <HomeHeading title="Featured Restaurants" href="/restaurants" />
        <div className={cn(homeScroller, "mt-3 md:grid-cols-[1.9fr_1fr]")}>
          <FeaturedSpotlight restaurant={getFeaturedRestaurant()} variant="a" />
          <PlacesToExploreCard slug="oguta-lake-boat-rides" variant="a" />
        </div>
      </section>

      <section className="container-x pt-6 sm:pt-9">
        <HomeHeading title="Popular Dishes" href="/restaurants" />
        <div className="mt-3">
          <PopularDishes dishes={popularDishes(8)} variant="a" />
        </div>
      </section>

      <section className="container-x pt-6 sm:pt-9">
        <HomeHeading title="Nearby" subtitle="Great food, places and experiences close by." href="/nearby" />
        <div className={cn(homeScroller, "mt-3 md:grid-cols-4")}>
          {nearbyItems().map((x, i) => (
            <NearbyCard key={x.slug} item={x} className={cn(i >= 4 && "md:hidden")} />
          ))}
        </div>
      </section>

      <section className="container-x py-7 sm:py-10">
        <CultureBanner variant="a" />
      </section>
    </>
  );
}

export default function Page() {
  return <Design a={<HomePage />} b={<SigHome />} />;
}
