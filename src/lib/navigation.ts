import { BedDouble, Bell, Bookmark, CalendarDays, CircleHelp, House, MapPin, Mountain, Newspaper, Settings, Store, Trees, type LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon; description?: string; children?: NavItem[] };

/** Site navigation, in the required order. Header, drawer, footer and sitemap-style lists all read from here. */
export const navigation: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Local Market", href: "/market", icon: Store, description: "Traditional food, produce, spices and crafts" },
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
  { label: "Events & Hangouts", href: "/events", icon: CalendarDays, description: "Festivals, live music and nights out" },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help / Support", href: "/help", icon: CircleHelp },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Restaurant detail and menu screens are immersive on mobile (own floating controls, no app bar). */
export const isImmersive = (pathname: string) => /^\/restaurants\/[^/]+(\/menu)?$/.test(pathname);
