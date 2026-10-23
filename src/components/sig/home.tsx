import { getFeaturedRestaurant, nearbyItems, popularDishes } from "@/lib/data";
import { NearbyCard } from "../explore-card";
import { PopularDishes } from "../food";
import { CultureBanner, FeaturedSpotlight, homeScroller, HomeHeading, HomeShortcuts, PlacesToExploreCard } from "../home/sections";
import { SigHero } from "./hero";

/**
 * Version B homepage — the reference structure (hero + search, six shortcuts, featured restaurant spotlight
 * with a place to explore, Popular Dishes, Nearby, culture banner) in Version B’s style: rounded hero card,
 * round shortcut bubbles, softer radii and bold sans headings.
 */
export function SigHome() {
  return (
    <>
      <SigHero />

      <section aria-label="Services" className="container-x pt-5 sm:pt-7">
        <HomeShortcuts variant="b" />
      </section>

      <section className="container-x pt-7 sm:pt-10">
        <HomeHeading title="Featured Restaurants" href="/restaurants" variant="b" />
        <div className={`${homeScroller} mt-3 md:grid-cols-[1.9fr_1fr]`}>
          <FeaturedSpotlight restaurant={getFeaturedRestaurant()} variant="b" />
          <PlacesToExploreCard slug="oguta-lake-boat-rides" variant="b" />
        </div>
      </section>

      <section className="container-x pt-7 sm:pt-10">
        <HomeHeading title="Popular Dishes" href="/restaurants" variant="b" />
        <div className="mt-3">
          <PopularDishes dishes={popularDishes(8)} variant="b" />
        </div>
      </section>

      <section className="container-x pt-7 sm:pt-10">
        <HomeHeading title="Nearby" subtitle="Great food, places and experiences close by." href="/nearby" variant="b" />
        <div className={`${homeScroller} mt-3 md:grid-cols-4`}>
          {nearbyItems().map((x, i) => (
            <NearbyCard key={x.slug} item={x} variant="b" className={i >= 4 ? "md:hidden" : undefined} />
          ))}
        </div>
      </section>

      <section className="container-x py-7 sm:py-10">
        <CultureBanner variant="b" />
      </section>
    </>
  );
}
