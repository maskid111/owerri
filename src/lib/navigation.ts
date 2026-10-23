import { BedDouble, Bell, Bookmark, CalendarDays, CircleHelp, House, MapPin, Mountain, Newspaper, Settings, Store, Trees, UtensilsCrossed, type LucideIcon } from "lucide-react";

/** `short` is the compact label used where space is tight (desktop header, mobile docks). */
export type NavItem = { label: string; short?: string; href: string; icon: LucideIcon; description?: string; children?: NavItem[] };

/** Site navigation, in the required order. Header, drawer, footer and sitemap-style lists all read from here. */
export const navigation: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Restaurants", short: "Food", href: "/restaurants", icon: UtensilsCrossed, description: "Order meals from local restaurants" },
  { label: "Local Market", short: "Market", href: "/market", icon: Store, description: "Traditional food, produce, spices and crafts" },
  {
    label: "Tours",
    href: "/tours",
    icon: Mountain,
    description: "Stays, getaways and nature",
    children: [
      { label: "Stays & Getaways", href: "/tours/stays", icon: BedDouble, description: "Hotels, lodges and short trips" },
      { label: "Nature & Places", href: "/tours/nature", icon: Trees, description: "Lakes, rivers, trails and hidden gems" },
    ],
  },
  { label: "Nearby", href: "/nearby", icon: MapPin, description: "Places and experiences close to you" },
  { label: "Events & Hangouts", short: "Events", href: "/events", icon: CalendarDays, description: "Festivals, live music and nights out" },
  { label: "Discover", href: "/blog", icon: Newspaper, description: "Stories about food, heritage and city life" },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help / Support", href: "/help", icon: CircleHelp },
];

/** Items 1–7 are the discovery sections; the rest are personal and support pages. */
export const mainNav = navigation.slice(0, 7);
export const accountNav = navigation.slice(7);

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Restaurant detail and menu screens are immersive on mobile (own floating controls, no app bar). */
export const isImmersive = (pathname: string) => /^\/restaurants\/[^/]+(\/menu)?$/.test(pathname);
