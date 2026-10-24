import { Bell, Bookmark, CircleHelp, Settings, ShoppingBag, type LucideIcon } from "lucide-react";
import type { ArtKind } from "@/components/service-art";

/** The six homepage shortcuts (both versions), in the order of the reference design. */
export const homeShortcuts: { art: ArtKind; label: string; href: string }[] = [
  { art: "restaurants", label: "Restaurants", href: "/restaurants" },
  { art: "dishes", label: "Dishes", href: "/dishes" },
  { art: "places", label: "Places", href: "/tours/nature" },
  { art: "culture", label: "Events", href: "/events" },
  { art: "markets", label: "Market", href: "/market" },
  { art: "mask", label: "Culture", href: "/culture" },
];

/** Grouped site menu used by the mobile drawer (Version A) and the menu panel (Version B). */
export type MenuEntry = { label: string; hint?: string; href: string; art?: ArtKind; icon?: LucideIcon };

export const menuGroups: { title: string; items: MenuEntry[] }[] = [
  {
    title: "Discover & Order",
    items: [
      { label: "Home", hint: "Your Native hub", href: "/", art: "home" },
      { label: "Restaurants", hint: "Menus & ordering", href: "/restaurants", art: "restaurants" },
      { label: "Explore Nigerian Food", hint: "Local delicacies & food guides", href: "/dishes", art: "dishes" },
    ],
  },
  {
    title: "Explore More",
    items: [
      { label: "Farmers Market", hint: "Fresh produce & market goods", href: "/market", art: "markets" },
      { label: "Tours & Experiences", hint: "Stays, getaways, nature & day trips", href: "/tours", art: "places" },
      { label: "Events & Hangouts", hint: "Festivals, live music & nights out", href: "/events", art: "culture" },
      { label: "Nearby", hint: "Places & experiences near you", href: "/nearby", art: "nearby" },
      { label: "Shops & Crafts", hint: "Handmade crafts from Nigerian makers", href: "/market#crafts-handmade", art: "shops" },
      { label: "Explore", hint: "Stories & guides", href: "/blog", art: "discover" },
    ],
  },
  {
    title: "Quick Access",
    items: [
      { label: "Saved", hint: "Your saved places", href: "/saved", icon: Bookmark },
      { label: "Orders", hint: "Cart & past orders", href: "/orders", icon: ShoppingBag },
      { label: "Notifications", hint: "Updates & offers", href: "/notifications", icon: Bell },
      { label: "Settings", hint: "Preferences & appearance", href: "/settings", icon: Settings },
      { label: "Help / Support", hint: "Answers & contact", href: "/help", icon: CircleHelp },
    ],
  },
];
