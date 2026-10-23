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
    title: "Explore",
    items: [
      { label: "Home", hint: "Your Native hub", href: "/", art: "home" },
      { label: "Restaurants", hint: "Menus & ordering", href: "/restaurants", art: "restaurants" },
      { label: "Local Markets", hint: "Fresh produce & local goods", href: "/market", art: "markets" },
      { label: "Culture & Events", hint: "Heritage, festivals & nights out", href: "/events", art: "culture" },
      { label: "Stays & Hospitality", hint: "Hotels, lodges & getaways", href: "/tours/stays", art: "stays" },
      { label: "Shops & Crafts", hint: "Handmade Igbo crafts", href: "/market#crafts-handmade", art: "shops" },
      { label: "Tours & Places", hint: "Lakes, rivers & day trips", href: "/tours", art: "places" },
      { label: "Nearby", hint: "Places & experiences near you", href: "/nearby", art: "nearby" },
      { label: "Discover", hint: "Stories & guides", href: "/blog", art: "discover" },
    ],
  },
  {
    title: "Your space",
    items: [
      { label: "Saved", hint: "Your saved places", href: "/saved", icon: Bookmark },
      { label: "Orders", hint: "Cart & past orders", href: "/orders", icon: ShoppingBag },
      { label: "Notifications", hint: "Updates & offers", href: "/notifications", icon: Bell },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Settings", hint: "Preferences & appearance", href: "/settings", icon: Settings },
      { label: "Help / Support", hint: "Answers & contact", href: "/help", icon: CircleHelp },
    ],
  },
];
