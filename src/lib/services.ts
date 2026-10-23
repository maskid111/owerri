import { Bell, Bookmark, CircleHelp, Settings, ShoppingBag, type LucideIcon } from "lucide-react";
import type { ArtKind } from "@/components/service-art";

/** The services Native offers, in priority order (food first). Homepage tiles in both versions read from here. */
export type Service = { art: ArtKind; label: string; short: string; hint: string; href: string; tone: string };

export const services: Service[] = [
  { art: "restaurants", label: "Restaurants", short: "Restaurants", hint: "Order meals", href: "/restaurants", tone: "bg-[#fbe4d8]" },
  { art: "dishes", label: "Dishes", short: "Dishes", hint: "Local flavours", href: "/dishes", tone: "bg-[#fdecd2]" },
  { art: "markets", label: "Local Markets", short: "Markets", hint: "Fresh & local", href: "/market", tone: "bg-[#e2f0e2]" },
  { art: "culture", label: "Culture & Events", short: "Culture & Events", hint: "Heritage & festivals", href: "/events", tone: "bg-[#e3edf4]" },
  { art: "stays", label: "Stays & Hospitality", short: "Stays", hint: "Hotels & lodges", href: "/tours/stays", tone: "bg-[#eef1dc]" },
  { art: "shops", label: "Shops & Crafts", short: "Shops & Crafts", hint: "Handmade goods", href: "/market#crafts-handmade", tone: "bg-[#f7e3e6]" },
  { art: "nearby", label: "Nearby & Experiences", short: "Nearby", hint: "Close to you", href: "/nearby", tone: "bg-[#e6e9f6]" },
  { art: "places", label: "Places", short: "Places", hint: "Lakes & nature", href: "/tours/nature", tone: "bg-[#dff0ec]" },
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
