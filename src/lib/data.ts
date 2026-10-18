/**
 * Sample content for the Native platform (Owerri, Imo State).
 * Venues, events, menus, phone numbers and people below are illustrative placeholders, not verified listings.
 * Real landmarks (e.g. Oguta Lake, Dan Anyiam Stadium, Mbari) are referenced only as locations.
 * Replace with a CMS or API when the backend is ready — every page reads from this file.
 */

import type { ImageName } from "./images";
import { hoursLabel } from "./utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type FoodCategory =
  | "Local"
  | "Continental"
  | "Fast Food"
  | "Grill & Suya"
  | "Cafés"
  | "Bars & Lounges"
  | "Seafood"
  | "Street Food";

export type MenuSection = "Signature Dishes" | "Local Dishes" | "Continental" | "Drinks" | "Desserts";

export type Service = "Delivery available" | "Pickup & delivery" | "Dine-in only";

type CatalogueItem = {
  id: string;
  name: string;
  note: string;
  /** Base price in naira for a mid-priced (₦₦) kitchen. */
  price: number;
  image: ImageName;
  section: Exclude<MenuSection, "Signature Dishes">;
};

export type MenuItem = Omit<CatalogueItem, "section"> & { section: MenuSection };

export type Review = { author: string; rating: number; date: string; text: string };

export type Restaurant = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Short cuisine label used on listing cards, e.g. "Nigerian". */
  cuisine: string;
  /** Venue type line used on detail pages, e.g. "Café • Restaurant • Bar". */
  type: string;
  categories: FoodCategory[];
  area: string; // neighbourhood slug
  address: string;
  price: 1 | 2 | 3 | 4;
  rating: number;
  reviewCount: number;
  /** Approximate distance from Owerri city centre. */
  distanceKm: number;
  open: string; // "HH:MM"
  close: string;
  days: string;
  phone: string;
  service: Service;
  tags: string[];
  image: ImageName; // food photo used on listing cards
  cover: ImageName; // venue / mood photo used on detail pages
  gallery: ImageName[];
  featured?: boolean;
  menu: string[]; // catalogue ids
  signature: string[]; // catalogue ids shown under "Signature Dishes"
  reviews: Review[];
};

export type Dish = {
  slug: string;
  name: string;
  igbo?: string;
  kind: string;
  description: string;
  ingredients: string[];
  bestWith: string;
  heat: 0 | 1 | 2 | 3;
  image: ImageName;
};

export type Neighbourhood = {
  slug: string;
  name: string;
  vibe: string;
  description: string;
  knownFor: string[];
  bestTime: string;
  image: ImageName;
};

export type ExploreCategory = "Food & Drink" | "Market" | "Culture" | "Music" | "Family" | "Stays" | "Nature" | "Recreation" | "Hangouts";

export type EventItem = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  time: string;
  venue: string;
  area: string;
  categories: ExploreCategory[];
  description: string;
  price: string;
  /** When set, the event sells tickets through the (mock) ticket flow. */
  ticketPrice?: number;
  image: ImageName;
};

export type Place = {
  slug: string;
  name: string;
  kind: "Stay" | "Getaway" | "Nature" | "Recreation" | "Hangout" | "Culture" | "Market";
  /** For market stalls: which Local Market aisle they belong to. */
  marketGroup?: MarketGroup;
  categories: ExploreCategory[];
  area: string;
  address: string;
  description: string;
  hours: string;
  price: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  image: ImageName;
};

export type Story = {
  slug: string;
  title: string;
  dek: string;
  category: "Food" | "Culture" | "City Guide" | "Lifestyle";
  author: string;
  readTime: string;
  date: string;
  image: ImageName;
  body: { heading?: string; text: string }[];
};

/* ------------------------------------------------------------------ */
/* Filters & categories                                                */
/* ------------------------------------------------------------------ */

export const foodCategories: FoodCategory[] = [
  "Local",
  "Continental",
  "Fast Food",
  "Grill & Suya",
  "Cafés",
  "Bars & Lounges",
  "Seafood",
  "Street Food",
];

export const menuSections: { name: MenuSection; blurb: string }[] = [
  { name: "Signature Dishes", blurb: "Our most loved and recommended." },
  { name: "Local Dishes", blurb: "Authentic flavours from the heart of Owerri." },
  { name: "Continental", blurb: "A taste of the world." },
  { name: "Drinks", blurb: "Cool sips for every mood." },
  { name: "Desserts", blurb: "Something sweet to finish." },
];

export const exploreCategories: ExploreCategory[] = ["Food & Drink", "Market", "Culture", "Music", "Family", "Stays", "Nature", "Recreation", "Hangouts"];

export type MarketGroup = "Fresh Produce" | "Spices & Ingredients" | "Crafts & Handmade";

/** Local Market aisles (Traditional Food links to the restaurant listing and ordering flow). */
export const marketSections: { name: "Traditional Food" | MarketGroup; blurb: string; image: ImageName; href: string }[] = [
  { name: "Traditional Food", blurb: "Order soups, grills and street food from local kitchens.", image: "egusi", href: "/restaurants?category=Local" },
  { name: "Fresh Produce", blurb: "Yams, plantain, leafy greens and fruit from nearby farms.", image: "produce", href: "/market#fresh-produce" },
  { name: "Spices & Ingredients", blurb: "Ehu, uziza, ogiri, crayfish and peppers for home cooking.", image: "spices", href: "/market#spices-ingredients" },
  { name: "Crafts & Handmade", blurb: "Pottery, woven baskets and fabric from local makers.", image: "pottery", href: "/market#crafts-handmade" },
];

/* ------------------------------------------------------------------ */
/* Menu catalogue (shared across restaurants)                          */
/* ------------------------------------------------------------------ */

const catalogue: CatalogueItem[] = [
  // Local dishes
  { id: "ofe-owerri", name: "Ofe Owerri", note: "Traditional Igbo delicacy with assorted meats, dried fish and fresh vegetables.", price: 4500, image: "ofe-owerri", section: "Local Dishes" },
  { id: "egusi-pounded-yam", name: "Egusi Soup & Pounded Yam", note: "Rich, flavourful egusi soup with choice meat and smooth pounded yam.", price: 4800, image: "egusi", section: "Local Dishes" },
  { id: "jollof-chicken", name: "Jollof Rice & Chicken", note: "Classic Nigerian jollof rice with grilled chicken and fresh salad.", price: 4200, image: "chicken-jollof", section: "Local Dishes" },
  { id: "abacha-ugba", name: "Abacha & Ugba", note: "Traditional African salad with ukpaka and palm oil.", price: 3500, image: "abacha", section: "Local Dishes" },
  { id: "ofe-akwu", name: "Ofe Akwu", note: "Palm-fruit soup made with bitter leaf and assorted meats.", price: 4200, image: "assorted-soup", section: "Local Dishes" },
  { id: "ofe-nsala", name: "Ofe Nsala & Fufu", note: "Peppery white soup with fresh catfish and uziza.", price: 5200, image: "ofe-nsala", section: "Local Dishes" },
  { id: "nkwobi", name: "Nkwobi", note: "Spiced cow foot in ehu and palm-oil sauce, topped with utazi and onions.", price: 6000, image: "nkwobi", section: "Local Dishes" },
  { id: "isi-ewu", name: "Isi Ewu", note: "Goat head in a spiced palm-oil sauce, served in a wooden bowl.", price: 8500, image: "isi-ewu", section: "Local Dishes" },
  { id: "goat-pepper-soup", name: "Goat Meat Pepper Soup", note: "Aromatic broth with uziza, scent leaf and calabash nutmeg.", price: 4000, image: "pepper-soup-pot", section: "Local Dishes" },
  { id: "catfish-pepper-soup", name: "Catfish Pepper Soup", note: "Point-and-kill catfish in a fiery, fragrant broth.", price: 5500, image: "catfish-pepper-soup", section: "Local Dishes" },
  { id: "chicken-pepper-soup", name: "Chicken Pepper Soup", note: "Light, warming broth with local spices and fresh herbs.", price: 4200, image: "chicken-pepper-soup", section: "Local Dishes" },
  { id: "fish-pepper-soup", name: "Fish Pepper Soup", note: "Fresh fish, uziza and scent leaf in a clear peppery broth.", price: 5000, image: "fish-pepper-soup", section: "Local Dishes" },
  { id: "party-jollof-fish", name: "Party Jollof & Grilled Fish", note: "Smoky bottom-pot jollof with a whole grilled croaker.", price: 6500, image: "jollof-fish", section: "Local Dishes" },
  { id: "jollof-skewers", name: "Jollof & Chicken Skewers", note: "Firewood-style jollof topped with peppered chicken skewers.", price: 5000, image: "jollof-skewers", section: "Local Dishes" },
  { id: "jollof-plated", name: "Jollof & Grilled Fillet", note: "Moulded jollof rice, grilled fish fillet and pepper sauce.", price: 5400, image: "jollof-plated", section: "Local Dishes" },
  { id: "jollof-rice", name: "Smoky Jollof Rice", note: "Party-style jollof with fried plantain on the side.", price: 3000, image: "jollof-close", section: "Local Dishes" },
  { id: "fried-rice-chicken", name: "Fried Rice & Chicken", note: "Nigerian fried rice with mixed vegetables and fried chicken.", price: 4300, image: "fried-rice-chicken", section: "Local Dishes" },
  { id: "rice-stew", name: "Rice & Assorted Stew", note: "White rice with tomato-pepper stew and assorted meat.", price: 3800, image: "rice-stew", section: "Local Dishes" },
  { id: "goat-stew", name: "Goat Meat & Yam Stew", note: "Slow-cooked goat meat and yam in a rich pepper stew.", price: 4500, image: "goat-stew", section: "Local Dishes" },
  { id: "soup-platter", name: "Soup & Swallow Platter", note: "Three soups, boiled plantain, egg and your choice of swallow.", price: 7500, image: "swallow-spread", section: "Local Dishes" },
  { id: "soup-tasting", name: "Owerri Soup Tasting", note: "Five small bowls of the city's classic soups to share.", price: 8000, image: "soups-spread", section: "Local Dishes" },
  { id: "grilled-croaker", name: "Grilled Croaker & Dodo", note: "Whole croaker, fried plantain, onions and lime.", price: 6800, image: "fish-plantain", section: "Local Dishes" },
  { id: "whole-tilapia", name: "Whole Grilled Tilapia", note: "Wood-fired tilapia with pepper sauce and sides to share.", price: 7500, image: "fish-feast", section: "Local Dishes" },
  { id: "bole-fish", name: "Bole & Fish", note: "Roasted plantain with pepper sauce and grilled fish.", price: 2500, image: "bole-street", section: "Local Dishes" },
  { id: "dodo", name: "Fried Plantain (Dodo)", note: "Sweet, golden plantain cubes.", price: 1500, image: "dodo", section: "Local Dishes" },
  { id: "peppered-goat", name: "Peppered Goat Meat", note: "Tender goat meat tossed in scotch-bonnet pepper sauce.", price: 3500, image: "goat-meat", section: "Local Dishes" },
  { id: "beef-suya", name: "Beef Suya", note: "Thin-sliced beef dusted with yaji, onions and tomatoes.", price: 2500, image: "suya", section: "Local Dishes" },
  { id: "suya-platter", name: "Suya Platter", note: "Beef, chicken and gizzard suya for the table.", price: 6000, image: "suya-stall", section: "Local Dishes" },
  { id: "mixed-skewers", name: "Chicken & Beef Skewers", note: "Charcoal-grilled skewers with yaji and pepper sauce.", price: 4000, image: "skewers", section: "Local Dishes" },
  // Continental
  { id: "grilled-chicken-platter", name: "Grilled Chicken Platter", note: "Juicy grilled chicken with fried plantain, salad and spicy pepper sauce.", price: 5800, image: "grilled-platter", section: "Continental" },
  { id: "creamy-chicken-pasta", name: "Creamy Chicken Pasta", note: "Penne pasta in a rich cream sauce with grilled chicken and herbs.", price: 4500, image: "pasta", section: "Continental" },
  { id: "beef-burger", name: "Beef Burger", note: "Juicy beef patty, fresh veggies, cheese and special sauce.", price: 4000, image: "burger", section: "Continental" },
  { id: "grilled-chicken-potatoes", name: "Grilled Chicken & Potatoes", note: "Herb-grilled chicken breast with roast potatoes.", price: 5200, image: "grilled-chicken", section: "Continental" },
  // Drinks
  { id: "zobo", name: "Zobo (Hibiscus Drink)", note: "Refreshing and naturally sweet.", price: 1000, image: "zobo", section: "Drinks" },
  { id: "zobo-spritz", name: "Chilled Zobo Spritz", note: "Hibiscus, ginger and citrus over ice.", price: 2500, image: "hibiscus", section: "Drinks" },
  { id: "pineapple-juice", name: "Fresh Pineapple Juice", note: "100% natural, no additives.", price: 1200, image: "pineapple-juice", section: "Drinks" },
  { id: "latte", name: "Café Latte", note: "Nigerian highland coffee with steamed milk.", price: 2200, image: "latte", section: "Drinks" },
  { id: "palm-wine-sour", name: "Palm Wine Sour", note: "Palm wine, lime and bitters.", price: 6000, image: "cocktail", section: "Drinks" },
  // Desserts
  { id: "chocolate-cake", name: "Chocolate Fudge Cake", note: "Layered chocolate sponge with fudge icing.", price: 3000, image: "cake", section: "Desserts" },
  { id: "pancakes", name: "Pancakes & Honey", note: "Fluffy buttermilk pancakes with honey and butter.", price: 3500, image: "pancakes", section: "Desserts" },
];

const priceFactor: Record<Restaurant["price"], number> = { 1: 0.8, 2: 1, 3: 1.25, 4: 1.5 };

/** Full menu for a restaurant, with signature items grouped first and prices scaled to the venue's price level. */
export function getMenu(r: Restaurant): MenuItem[] {
  const byId = new Map(catalogue.map((c) => [c.id, c]));
  const scale = (p: number) => Math.round((p * priceFactor[r.price]) / 100) * 100;
  const items: MenuItem[] = [];
  for (const id of r.signature) {
    const c = byId.get(id);
    if (c) items.push({ ...c, price: scale(c.price), section: "Signature Dishes" });
  }
  for (const id of r.menu) {
    const c = byId.get(id);
    if (c && !r.signature.includes(id)) items.push({ ...c, price: scale(c.price) });
  }
  return items;
}

/* ------------------------------------------------------------------ */
/* Restaurants                                                         */
/* ------------------------------------------------------------------ */

export const restaurants: Restaurant[] = [
  {
    slug: "the-green-terrace",
    name: "The Green Terrace",
    tagline: "Good food. Great vibes.",
    description:
      "A modern café and restaurant with a relaxed atmosphere, great coffee, local and continental dishes, and a beautiful outdoor space.",
    cuisine: "Nigerian",
    type: "Café • Restaurant • Bar",
    categories: ["Local", "Continental", "Cafés"],
    area: "ikenegbu",
    address: "Ikenegbu Layout, Owerri, Imo State",
    price: 2,
    rating: 4.7,
    reviewCount: 213,
    distanceKm: 1.1,
    open: "07:00",
    close: "23:00",
    days: "Daily",
    phone: "+2347000000101",
    service: "Pickup & delivery",
    tags: ["Outdoor seating", "Coffee", "Work-friendly"],
    image: "ofe-owerri",
    cover: "green-terrace",
    gallery: ["green-terrace", "garden-lights", "greenhouse-cafe", "booth-plants"],
    featured: true,
    signature: ["ofe-owerri", "grilled-chicken-platter", "jollof-chicken", "egusi-pounded-yam"],
    menu: ["abacha-ugba", "ofe-akwu", "goat-pepper-soup", "creamy-chicken-pasta", "beef-burger", "zobo", "pineapple-juice", "latte", "chocolate-cake", "pancakes"],
    reviews: [
      { author: "Chiamaka E.", rating: 5, date: "Oct 2026", text: "The terrace at sunset is gorgeous, and the Ofe Owerri tastes like home." },
      { author: "Daniel O.", rating: 4, date: "Sep 2026", text: "Great coffee and reliable Wi-Fi. Weekend brunch gets busy — book ahead." },
    ],
  },
  {
    slug: "ijeomas-kitchen",
    name: "Ijeoma’s Kitchen",
    tagline: "Home-style Igbo cooking with generous portions",
    description:
      "A warm, family-run kitchen known for peppered meats, rich soups and jollof that sells out by evening. Order ahead for delivery anywhere in central Owerri.",
    cuisine: "Nigerian",
    type: "Restaurant • Takeaway",
    categories: ["Local"],
    area: "wetheral-road",
    address: "Wetheral Road, Owerri, Imo State",
    price: 2,
    rating: 4.8,
    reviewCount: 124,
    distanceKm: 0.8,
    open: "09:00",
    close: "21:00",
    days: "Mon – Sat",
    phone: "+2347000000102",
    service: "Delivery available",
    tags: ["Family-run", "Takeaway", "Local favourite"],
    image: "goat-meat",
    cover: "dining-evening",
    gallery: ["dining-evening", "goat-meat", "egusi", "jollof-skewers"],
    featured: true,
    signature: ["peppered-goat", "egusi-pounded-yam", "jollof-skewers"],
    menu: ["ofe-owerri", "ofe-nsala", "rice-stew", "goat-stew", "dodo", "chicken-pepper-soup", "zobo", "pineapple-juice"],
    reviews: [
      { author: "Ngozi A.", rating: 5, date: "Oct 2026", text: "The peppered goat meat is unreal. Delivery arrived hot." },
      { author: "Kelechi U.", rating: 5, date: "Aug 2026", text: "Feels like eating at an aunty’s house — in the best way." },
    ],
  },
  {
    slug: "the-urban-grill",
    name: "The Urban Grill",
    tagline: "Charcoal grills, cold drinks and late nights",
    description:
      "An open-air courtyard grill with skewers, suya and whole fish coming off the coals all evening. Pick up on your way home or settle in for the night.",
    cuisine: "Local",
    type: "Grill • Bar",
    categories: ["Grill & Suya", "Local", "Bars & Lounges"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    price: 2,
    rating: 4.6,
    reviewCount: 98,
    distanceKm: 1.2,
    open: "15:00",
    close: "00:30",
    days: "Daily",
    phone: "+2347000000103",
    service: "Pickup & delivery",
    tags: ["Late night", "Outdoor", "Groups"],
    image: "skewers",
    cover: "courtyard",
    gallery: ["courtyard", "skewers", "suya-grill", "fish-plantain"],
    signature: ["mixed-skewers", "suya-platter", "grilled-croaker"],
    menu: ["beef-suya", "peppered-goat", "jollof-rice", "dodo", "beef-burger", "zobo", "palm-wine-sour"],
    reviews: [{ author: "Emeka N.", rating: 5, date: "Oct 2026", text: "The suya platter is perfect for sharing. Great music on Fridays." }],
  },
  {
    slug: "oak-and-bean-cafe",
    name: "Oak & Bean Café",
    tagline: "Slow mornings, good coffee and all-day brunch",
    description:
      "A calm, wood-panelled café with excellent coffee, pastries and a continental brunch menu. A favourite for remote workers and long catch-ups.",
    cuisine: "Continental",
    type: "Café • Brunch",
    categories: ["Cafés", "Continental"],
    area: "ikenegbu",
    address: "Ikenegbu, Owerri, Imo State",
    price: 2,
    rating: 4.5,
    reviewCount: 76,
    distanceKm: 1.5,
    open: "07:30",
    close: "19:00",
    days: "Daily",
    phone: "+2347000000104",
    service: "Delivery available",
    tags: ["Wi-Fi", "Brunch", "Quiet"],
    image: "pancakes",
    cover: "cafe-interior",
    gallery: ["cafe-interior", "latte", "pancakes", "cafe-counter"],
    signature: ["pancakes", "latte", "creamy-chicken-pasta"],
    menu: ["grilled-chicken-potatoes", "beef-burger", "chocolate-cake", "pineapple-juice", "zobo-spritz"],
    reviews: [{ author: "Amara I.", rating: 5, date: "Oct 2026", text: "My favourite place to work from. Lovely pancakes." }],
  },
  {
    slug: "uto-kitchen",
    name: "Ụtọ Kitchen",
    tagline: "Heritage Igbo cooking, plated with care",
    description:
      "A calm, candle-lit dining room where family recipes meet a modern tasting format. The kitchen builds its menu around a slow-cooked Ofe Owerri and a rotating set of small plates from across Imo State.",
    cuisine: "Contemporary Igbo",
    type: "Fine dining • Restaurant",
    categories: ["Local"],
    area: "ikenegbu",
    address: "Ikenegbu Layout, Owerri, Imo State",
    price: 3,
    rating: 4.9,
    reviewCount: 412,
    distanceKm: 1.3,
    open: "12:00",
    close: "22:30",
    days: "Tue – Sun",
    phone: "+2347000000105",
    service: "Dine-in only",
    tags: ["Date night", "Tasting menu", "Reservations"],
    image: "ofe-nsala",
    cover: "booth-plants",
    gallery: ["booth-plants", "ofe-nsala", "ofe-owerri", "soups-spread"],
    featured: true,
    signature: ["ofe-owerri", "ofe-nsala", "soup-tasting"],
    menu: ["nkwobi", "jollof-plated", "catfish-pepper-soup", "zobo-spritz", "palm-wine-sour", "chocolate-cake"],
    reviews: [
      { author: "Chidinma O.", rating: 5, date: "Sep 2026", text: "The Ofe Owerri tasted like my grandmother’s — but the plating made it feel like an occasion." },
      { author: "Tunde A.", rating: 5, date: "Aug 2026", text: "Book ahead on weekends. Service was warm and unhurried." },
    ],
  },
  {
    slug: "palmwine-and-pepper",
    name: "Palmwine & Pepper",
    tagline: "Pepper soup, cold drinks and good company",
    description:
      "An open-air garden bar strung with lights, built for long evenings. The pepper soup is properly fiery, and the weekend highlife band keeps the tables full.",
    cuisine: "Nigerian",
    type: "Garden bar • Lounge",
    categories: ["Bars & Lounges", "Local"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    price: 2,
    rating: 4.7,
    reviewCount: 638,
    distanceKm: 2.4,
    open: "16:00",
    close: "01:00",
    days: "Daily",
    phone: "+2347000000106",
    service: "Dine-in only",
    tags: ["Live music", "Outdoor", "Groups"],
    image: "pepper-soup-pot",
    cover: "garden-night",
    gallery: ["garden-night", "pepper-soup-pot", "highlife-band", "isi-ewu"],
    featured: true,
    signature: ["goat-pepper-soup", "isi-ewu", "nkwobi"],
    menu: ["catfish-pepper-soup", "peppered-goat", "bole-fish", "palm-wine-sour", "zobo"],
    reviews: [
      { author: "Emeka N.", rating: 5, date: "Oct 2026", text: "Friday night highlife plus pepper soup is the best reset after a long week." },
      { author: "Ada U.", rating: 4, date: "Sep 2026", text: "Gets busy after 8pm — come early for a garden table." },
    ],
  },
  {
    slug: "nkwo-canteen",
    name: "Nkwọ Canteen",
    tagline: "The honest buka everyone eventually recommends",
    description:
      "Steel pots, a short queue and the city’s most reliable lunch. Choose your swallow, choose your soup — egusi, oha, ofe nsala — and squeeze onto a shared bench with office workers and traders.",
    cuisine: "Nigerian",
    type: "Buka • Lunch",
    categories: ["Local", "Fast Food"],
    area: "owerri-municipal",
    address: "Owerri Municipal, Owerri, Imo State",
    price: 1,
    rating: 4.6,
    reviewCount: 1204,
    distanceKm: 0.5,
    open: "08:00",
    close: "18:00",
    days: "Mon – Sat",
    phone: "+2347000000107",
    service: "Pickup & delivery",
    tags: ["Lunch", "Budget", "Quick"],
    image: "swallow-spread",
    cover: "soups-spread",
    gallery: ["soups-spread", "swallow-spread", "rice-stew", "egusi"],
    signature: ["soup-platter", "ofe-nsala"],
    menu: ["egusi-pounded-yam", "rice-stew", "jollof-rice", "dodo", "zobo"],
    reviews: [{ author: "Ifeanyi E.", rating: 5, date: "Oct 2026", text: "Ofe nsala sells out by 2pm. That should tell you everything." }],
  },
  {
    slug: "amakas-abacha-garden",
    name: "Amaka’s Abacha Garden",
    tagline: "Abacha and ugba, made to order",
    description:
      "A shaded roadside garden known for its African salad: tangy, oily, crunchy and built in front of you. Add fried fish or ponmo, grab a cold drink, and stay for the afternoon breeze.",
    cuisine: "Street food",
    type: "Garden • Street food",
    categories: ["Street Food", "Local"],
    area: "wetheral-road",
    address: "Wetheral Road, Owerri, Imo State",
    price: 1,
    rating: 4.8,
    reviewCount: 527,
    distanceKm: 0.9,
    open: "11:00",
    close: "20:00",
    days: "Daily",
    phone: "+2347000000108",
    service: "Pickup & delivery",
    tags: ["Outdoor", "Budget", "Local favourite"],
    image: "abacha",
    cover: "garden-lights",
    gallery: ["garden-lights", "abacha", "bole-street", "zobo"],
    featured: true,
    signature: ["abacha-ugba", "bole-fish"],
    menu: ["dodo", "peppered-goat", "zobo", "pineapple-juice"],
    reviews: [{ author: "Nkechi P.", rating: 5, date: "Sep 2026", text: "The ugba is perfectly fermented. I drive across town for this." }],
  },
  {
    slug: "lakeside-fish-house",
    name: "Lakeside Fish House",
    tagline: "Grilled lake fish, an hour from the city",
    description:
      "A weekend destination on the water: whole fish grilled over wood, pepper sauce on the side and a slow view of the lake. Pair lunch with a canoe ride and make a day of it.",
    cuisine: "Seafood",
    type: "Waterfront • Restaurant",
    categories: ["Seafood", "Local"],
    area: "oguta-lake",
    address: "Oguta Lake shore, Imo State",
    price: 2,
    rating: 4.7,
    reviewCount: 289,
    distanceKm: 38,
    open: "10:00",
    close: "19:00",
    days: "Fri – Sun",
    phone: "+2347000000109",
    service: "Dine-in only",
    tags: ["Day trip", "Waterfront", "Families"],
    image: "fish-feast",
    cover: "lake-jetty",
    gallery: ["lake-jetty", "fish-feast", "lake-boats", "fish-pepper-soup"],
    signature: ["whole-tilapia", "catfish-pepper-soup"],
    menu: ["grilled-croaker", "fish-pepper-soup", "party-jollof-fish", "dodo", "pineapple-juice", "zobo"],
    reviews: [{ author: "Obinna K.", rating: 5, date: "Aug 2026", text: "Worth the drive. Get there by noon for the freshest fish." }],
  },
  {
    slug: "mbari-cafe",
    name: "Mbari Café",
    tagline: "Coffee, pastries and an art-filled afternoon",
    description:
      "Bright, airy and lined with work by local artists. Come for Nigerian highland coffee and brunch — then linger at a window seat with a book.",
    cuisine: "Café",
    type: "Café • Gallery",
    categories: ["Cafés", "Continental"],
    area: "ikenegbu",
    address: "Ikenegbu, Owerri, Imo State",
    price: 2,
    rating: 4.6,
    reviewCount: 344,
    distanceKm: 1.4,
    open: "07:30",
    close: "19:00",
    days: "Daily",
    phone: "+2347000000110",
    service: "Pickup & delivery",
    tags: ["Wi-Fi", "Work-friendly", "Brunch"],
    image: "latte",
    cover: "cafe-bright",
    gallery: ["cafe-bright", "latte", "pancakes", "gallery"],
    signature: ["latte", "pancakes"],
    menu: ["creamy-chicken-pasta", "chocolate-cake", "zobo-spritz", "pineapple-juice"],
    reviews: [{ author: "Amara I.", rating: 5, date: "Oct 2026", text: "Light-filled and calm. The latte is the best in town." }],
  },
  {
    slug: "ember-room",
    name: "Ember Room",
    tagline: "Rooftop fire-cooking and city lights",
    description:
      "A rooftop lounge with an open-fire kitchen and a view over the city. Expect suya-spiced grills, inventive palm-wine cocktails and DJs from Thursday to Saturday.",
    cuisine: "Grill & cocktails",
    type: "Rooftop • Lounge",
    categories: ["Bars & Lounges", "Continental", "Grill & Suya"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    price: 4,
    rating: 4.5,
    reviewCount: 402,
    distanceKm: 2.6,
    open: "17:00",
    close: "02:00",
    days: "Wed – Sun",
    phone: "+2347000000111",
    service: "Dine-in only",
    tags: ["Rooftop", "Cocktails", "Celebrations"],
    image: "cocktail",
    cover: "rooftop-lounge",
    gallery: ["rooftop-lounge", "cocktail", "bar-interior", "grilled-platter"],
    signature: ["palm-wine-sour", "grilled-chicken-platter", "suya-platter"],
    menu: ["mixed-skewers", "beef-burger", "zobo-spritz", "chocolate-cake"],
    reviews: [{ author: "Kelechi M.", rating: 4, date: "Sep 2026", text: "Gorgeous view, strong cocktails. Pricey, but perfect for a birthday." }],
  },
  {
    slug: "douglas-road-nkwobi-house",
    name: "Nkwobi House",
    tagline: "Bowls of nkwobi, served sizzling",
    description:
      "Douglas Road’s late-evening institution. Nkwobi and isi ewu arrive in carved wooden bowls, glistening with spiced palm oil and topped with sliced utazi and onions.",
    cuisine: "Nigerian",
    type: "Bar • Local kitchen",
    categories: ["Local", "Bars & Lounges"],
    area: "douglas-road",
    address: "Douglas Road, Owerri, Imo State",
    price: 2,
    rating: 4.8,
    reviewCount: 873,
    distanceKm: 0.7,
    open: "14:00",
    close: "23:30",
    days: "Daily",
    phone: "+2347000000112",
    service: "Pickup & delivery",
    tags: ["Late night", "Groups", "Local favourite"],
    image: "nkwobi",
    cover: "bar-interior",
    gallery: ["bar-interior", "nkwobi", "isi-ewu", "pepper-soup-pot"],
    featured: true,
    signature: ["nkwobi", "isi-ewu"],
    menu: ["goat-pepper-soup", "peppered-goat", "abacha-ugba", "palm-wine-sour", "zobo"],
    reviews: [{ author: "Uche D.", rating: 5, date: "Oct 2026", text: "The nkwobi has the right bitterness from the utazi. Classic." }],
  },
  {
    slug: "yaji-junction",
    name: "Yaji Junction",
    tagline: "Suya after dark, cut to order",
    description:
      "A glowing grill on a busy junction. Beef, chicken and gizzard suya are sliced thin, dusted with yaji and wrapped with fresh onions and tomatoes.",
    cuisine: "Suya",
    type: "Grill • Takeaway",
    categories: ["Grill & Suya", "Street Food", "Fast Food"],
    area: "world-bank",
    address: "World Bank Estate, Owerri, Imo State",
    price: 1,
    rating: 4.7,
    reviewCount: 956,
    distanceKm: 3.1,
    open: "18:00",
    close: "01:00",
    days: "Daily",
    phone: "+2347000000113",
    service: "Pickup & delivery",
    tags: ["Late night", "Takeaway", "Budget"],
    image: "suya",
    cover: "suya-stall",
    gallery: ["suya-stall", "suya", "suya-grill", "skewers"],
    signature: ["beef-suya", "suya-platter"],
    menu: ["mixed-skewers", "peppered-goat", "dodo", "zobo"],
    reviews: [{ author: "Bisi F.", rating: 5, date: "Sep 2026", text: "Perfect after a night out. Ask for extra yaji." }],
  },
  {
    slug: "heartland-bites",
    name: "Heartland Bites",
    tagline: "Quick plates, burgers and rice bowls",
    description:
      "A bright counter-service spot for fast lunches and late cravings: burgers, fried rice, jollof bowls and fresh juice, ready in minutes.",
    cuisine: "Fast food",
    type: "Fast food • Takeaway",
    categories: ["Fast Food", "Continental"],
    area: "owerri-municipal",
    address: "Owerri Municipal, Owerri, Imo State",
    price: 1,
    rating: 4.3,
    reviewCount: 211,
    distanceKm: 0.6,
    open: "10:00",
    close: "22:00",
    days: "Daily",
    phone: "+2347000000114",
    service: "Delivery available",
    tags: ["Quick", "Students", "Takeaway"],
    image: "burger",
    cover: "cafe-counter",
    gallery: ["cafe-counter", "burger", "fried-rice-chicken", "pineapple-juice"],
    signature: ["beef-burger", "fried-rice-chicken"],
    menu: ["jollof-chicken", "grilled-chicken-potatoes", "dodo", "pineapple-juice", "zobo", "chocolate-cake"],
    reviews: [{ author: "Tobe C.", rating: 4, date: "Oct 2026", text: "Fast, filling and fairly priced. The burger is better than it needs to be." }],
  },
  {
    slug: "green-okra",
    name: "Green Okra",
    tagline: "Vegetable-led Nigerian cooking near campus",
    description:
      "A young, colourful kitchen by the university where vegetables lead: leafy soups, smoky jollof and generous bowls at student-friendly prices.",
    cuisine: "Nigerian",
    type: "Restaurant • Healthy",
    categories: ["Local", "Fast Food"],
    area: "nekede",
    address: "Nekede, Owerri West, Imo State",
    price: 1,
    rating: 4.5,
    reviewCount: 198,
    distanceKm: 4.2,
    open: "10:00",
    close: "21:00",
    days: "Mon – Sat",
    phone: "+2347000000115",
    service: "Delivery available",
    tags: ["Vegetarian options", "Students", "Healthy"],
    image: "jollof-close",
    cover: "greenhouse-cafe",
    gallery: ["greenhouse-cafe", "jollof-close", "ofe-owerri", "zobo"],
    signature: ["jollof-rice", "ofe-owerri"],
    menu: ["abacha-ugba", "dodo", "fried-rice-chicken", "zobo", "pineapple-juice"],
    reviews: [{ author: "Ruth C.", rating: 4, date: "Oct 2026", text: "Finally a place where the vegetable dishes aren’t an afterthought." }],
  },
];

/* ------------------------------------------------------------------ */
/* Dishes, neighbourhoods                                              */
/* ------------------------------------------------------------------ */

export const dishes: Dish[] = [
  {
    slug: "ofe-owerri",
    name: "Ofe Owerri",
    kind: "Soup",
    description:
      "The city’s signature soup — rich, layered and generous with protein. Leafy ukazi and ugu, cocoyam for body and an abundance of meats and fish make it a dish for celebrations and honoured guests.",
    ingredients: ["Ukazi (okazi)", "Ugu", "Cocoyam", "Stockfish", "Assorted meat", "Palm oil"],
    bestWith: "Pounded yam or fufu",
    heat: 2,
    image: "ofe-owerri",
  },
  {
    slug: "nkwobi",
    name: "Nkwobi",
    kind: "Small chops",
    description:
      "Cow foot cooked until tender, then folded through a thick, spiced palm-oil paste and finished with sliced utazi leaves and onions. A bar-side classic best shared.",
    ingredients: ["Cow foot", "Palm oil", "Ehu (calabash nutmeg)", "Utazi", "Onions", "Potash"],
    bestWith: "A cold drink and good company",
    heat: 2,
    image: "nkwobi",
  },
  {
    slug: "abacha",
    name: "Abacha",
    igbo: "African salad",
    kind: "Street food",
    description:
      "Shredded dried cassava softened and tossed with ugba, palm oil, garden egg leaves and onions. Tangy, nutty and crunchy — every stall has its own signature.",
    ingredients: ["Dried cassava", "Ugba (oil bean)", "Palm oil", "Garden egg leaves", "Fried fish"],
    bestWith: "Fried fish or ponmo",
    heat: 1,
    image: "abacha",
  },
  {
    slug: "egusi",
    name: "Egusi Soup",
    igbo: "Ofe egwusi",
    kind: "Soup",
    description:
      "Ground melon seeds simmered into a thick, nutty soup with leafy greens, palm oil and assorted meats. Comforting, filling and found on almost every menu in the city.",
    ingredients: ["Ground egusi", "Ugu or bitter leaf", "Palm oil", "Assorted meat", "Stockfish"],
    bestWith: "Pounded yam or eba",
    heat: 1,
    image: "egusi",
  },
  {
    slug: "isi-ewu",
    name: "Isi Ewu",
    kind: "Delicacy",
    description:
      "Goat head prepared in a spiced palm-oil sauce, served whole in a wooden bowl. Ordering it is an event — and a sure sign the evening is just getting started.",
    ingredients: ["Goat head", "Palm oil", "Ehu", "Utazi", "Onions", "Pepper"],
    bestWith: "A shared table",
    heat: 3,
    image: "isi-ewu",
  },
  {
    slug: "ofe-nsala",
    name: "Ofe Nsala",
    igbo: "White soup",
    kind: "Soup",
    description:
      "A light, peppery soup made without palm oil and thickened with pounded yam. Fresh catfish is the classic choice, with uziza adding a warm, peppery lift.",
    ingredients: ["Catfish", "Yam", "Uziza", "Utazi", "Ogiri", "Pepper"],
    bestWith: "Pounded yam",
    heat: 2,
    image: "ofe-nsala",
  },
  {
    slug: "pepper-soup",
    name: "Goat Pepper Soup",
    kind: "Soup",
    description:
      "A clear, aromatic broth that warms from the inside out. Scent leaf, uziza and a blend of local spices give it its unmistakable perfume.",
    ingredients: ["Goat meat", "Scent leaf", "Uziza", "Calabash nutmeg", "Pepper soup spice"],
    bestWith: "A rainy evening",
    heat: 3,
    image: "pepper-soup-pot",
  },
  {
    slug: "suya",
    name: "Suya",
    kind: "Grill",
    description:
      "Thin strips of beef threaded onto skewers, coated in yaji — a spiced groundnut rub — and grilled over open flame. Served late at night with raw onions and tomatoes.",
    ingredients: ["Beef", "Yaji spice", "Groundnut", "Onions", "Tomatoes"],
    bestWith: "A late night out",
    heat: 2,
    image: "suya",
  },
];

export const neighbourhoods: Neighbourhood[] = [
  {
    slug: "ikenegbu",
    name: "Ikenegbu",
    vibe: "Leafy & refined",
    description: "Quiet tree-lined streets, upscale dining rooms and calm cafés — the address for slow lunches and special dinners.",
    knownFor: ["Fine dining", "Cafés", "Art spaces"],
    bestTime: "Lunch to late dinner",
    image: "cafe-bright",
  },
  {
    slug: "new-owerri",
    name: "New Owerri",
    vibe: "Modern & lively",
    description: "Wide roads, newer builds and the city’s busiest nightlife. Rooftops, lounges and garden bars fill up from Thursday.",
    knownFor: ["Lounges", "Rooftops", "Live music"],
    bestTime: "Evenings",
    image: "rooftop-lights",
  },
  {
    slug: "douglas-road",
    name: "Douglas Road",
    vibe: "Busy & characterful",
    description: "One of the city’s best-known streets, packed with traders by day and nkwobi spots by night.",
    knownFor: ["Nkwobi", "Late eats", "Shopping"],
    bestTime: "After 6pm",
    image: "suya-grill",
  },
  {
    slug: "wetheral-road",
    name: "Wetheral Road",
    vibe: "Central & casual",
    description: "A central artery lined with roadside kitchens, abacha gardens and quick-lunch favourites.",
    knownFor: ["Street food", "Abacha", "Quick bites"],
    bestTime: "Afternoons",
    image: "bole-street",
  },
  {
    slug: "world-bank",
    name: "World Bank",
    vibe: "Residential & social",
    description: "A sprawling estate where suya grills light up junctions every evening and neighbourhood bars run late.",
    knownFor: ["Suya", "Neighbourhood bars"],
    bestTime: "Night",
    image: "suya-stall",
  },
  {
    slug: "owerri-municipal",
    name: "Owerri Municipal",
    vibe: "Historic & bustling",
    description: "The old heart of the city, home to busy markets and the bukas that have fed traders for generations.",
    knownFor: ["Markets", "Bukas", "History"],
    bestTime: "Mornings",
    image: "market",
  },
  {
    slug: "nekede",
    name: "Nekede",
    vibe: "Young & affordable",
    description: "Campus energy, generous portions and student-friendly prices just outside the city centre.",
    knownFor: ["Student spots", "Value eats"],
    bestTime: "Any time",
    image: "palm-road",
  },
  {
    slug: "oguta-lake",
    name: "Oguta Lake",
    vibe: "Day-trip escape",
    description: "A day trip from the city to one of the region’s largest lakes, with grilled fish, boat rides and slow afternoons.",
    knownFor: ["Lake fish", "Boat rides", "Weekends"],
    bestTime: "Weekend daytime",
    image: "lake-boats",
  },
];

/* ------------------------------------------------------------------ */
/* Events & places (Explore)                                           */
/* ------------------------------------------------------------------ */

export const events: EventItem[] = [
  {
    slug: "owerri-local-food-fair",
    title: "Local Food Fair",
    date: "2026-11-01",
    time: "12:00 PM – 6:00 PM",
    venue: "New Owerri",
    area: "new-owerri",
    categories: ["Food & Drink", "Family"],
    description: "Home cooks and kitchens from across Imo State serve soups, grills, abacha and small chops. Bring an appetite and a friend.",
    price: "Free entry",
    image: "soups-spread",
  },
  {
    slug: "douglas-road-night-walk",
    title: "Douglas Road Night Food Walk",
    date: "2026-11-07",
    time: "6:30 PM – 10:00 PM",
    venue: "Douglas Road",
    area: "douglas-road",
    categories: ["Food & Drink"],
    description: "A guided tasting walk through five late-night spots — nkwobi, isi ewu, suya and pepper soup.",
    price: "₦15,000",
    ticketPrice: 15000,
    image: "suya-grill",
  },
  {
    slug: "highlife-in-the-garden",
    title: "Highlife in the Garden",
    date: "2026-11-14",
    time: "7:00 PM – 11:00 PM",
    venue: "Palmwine & Pepper",
    area: "new-owerri",
    categories: ["Music", "Hangouts"],
    description: "A live highlife band, cold drinks and pepper soup under the garden lights.",
    price: "Free entry",
    image: "highlife-band",
  },
  {
    slug: "uli-drawing-workshop",
    title: "Uli Drawing Workshop",
    date: "2026-11-21",
    time: "11:00 AM – 2:00 PM",
    venue: "Mbari Café",
    area: "ikenegbu",
    categories: ["Culture"],
    description: "Learn the flowing lines and symbols of uli, the traditional Igbo body and wall art. Materials included.",
    price: "₦8,000",
    ticketPrice: 8000,
    image: "gallery",
  },
  {
    slug: "family-fun-day",
    title: "Family Fun Day",
    date: "2026-11-22",
    time: "11:00 AM – 6:00 PM",
    venue: "Family Fun Park",
    area: "new-owerri",
    categories: ["Family", "Recreation"],
    description: "Rides, face painting, games and food stalls for the whole family. Under-3s go free.",
    price: "₦4,000",
    ticketPrice: 4000,
    image: "ferris",
  },
  {
    slug: "owerri-cultural-festival",
    title: "Owerri Cultural Festival",
    date: "2026-11-28",
    time: "10:00 AM – 8:00 PM",
    venue: "Dan Anyiam Stadium",
    area: "owerri-municipal",
    categories: ["Culture", "Music", "Family"],
    description: "A day of traditional dance troupes, masquerades, drumming, crafts and food from across Imo State.",
    price: "₦5,000",
    ticketPrice: 5000,
    image: "festival",
  },
  {
    slug: "harvest-market",
    title: "Heartland Harvest Market",
    date: "2026-12-05",
    time: "9:00 AM – 3:00 PM",
    venue: "Ikenegbu",
    area: "ikenegbu",
    categories: ["Food & Drink", "Family"],
    description: "Farmers, home cooks and makers: fresh ugba, local spices, crafts and cooking demos.",
    price: "Free entry",
    image: "market-pepper",
  },
  {
    slug: "masquerade-day",
    title: "Masquerade Heritage Day",
    date: "2026-12-12",
    time: "2:00 PM – 6:00 PM",
    venue: "Owerri Municipal",
    area: "owerri-municipal",
    categories: ["Culture"],
    description: "Masquerade performances, storytelling and drumming celebrating Igbo heritage. Grandstand seats are ticketed.",
    price: "₦3,000",
    ticketPrice: 3000,
    image: "masquerade",
  },
  {
    slug: "owerri-december",
    title: "Owerri December Homecoming",
    date: "2026-12-19",
    time: "All day",
    venue: "Across the city",
    area: "owerri-municipal",
    categories: ["Music", "Hangouts", "Culture"],
    description: "The city fills up for the holidays — a curated calendar of concerts, parties, pop-ups and family feasts.",
    price: "Varies",
    image: "concert",
  },
];

export const places: Place[] = [
  {
    slug: "heartland-garden-resort",
    name: "Heartland Garden Resort",
    kind: "Stay",
    categories: ["Stays", "Family"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    description: "A palm-shaded resort with a pool, garden bar and weekend brunch. Popular for family weekends and December visits.",
    hours: "Check-in from 2:00 PM",
    price: "From ₦65,000 / night",
    distanceKm: 3.4,
    rating: 4.6,
    reviewCount: 182,
    image: "resort-pool",
  },
  {
    slug: "ikenegbu-court-hotel",
    name: "Ikenegbu Court Hotel",
    kind: "Stay",
    categories: ["Stays"],
    area: "ikenegbu",
    address: "Ikenegbu Layout, Owerri, Imo State",
    description: "Quiet, modern rooms a short walk from the city’s best cafés and restaurants.",
    hours: "Check-in from 1:00 PM",
    price: "From ₦45,000 / night",
    distanceKm: 1.2,
    rating: 4.5,
    reviewCount: 96,
    image: "hotel-room",
  },
  {
    slug: "the-palms-suites",
    name: "The Palms Suites",
    kind: "Stay",
    categories: ["Stays"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    description: "Warm, wood-panelled suites with garden views and a calm lounge for working or unwinding.",
    hours: "Check-in from 2:00 PM",
    price: "From ₦80,000 / night",
    distanceKm: 2.8,
    rating: 4.7,
    reviewCount: 64,
    image: "hotel-suite",
  },
  {
    slug: "palm-court-hotel",
    name: "Palm Court Hotel & Pool",
    kind: "Stay",
    categories: ["Stays", "Recreation"],
    area: "world-bank",
    address: "World Bank Estate, Owerri, Imo State",
    description: "A relaxed hotel with a large pool open to day visitors at weekends.",
    hours: "Pool 9:00 AM – 7:00 PM",
    price: "From ₦55,000 / night",
    distanceKm: 3.0,
    rating: 4.4,
    reviewCount: 121,
    image: "hotel-pool",
  },
  {
    slug: "oguta-lake-boat-rides",
    name: "Oguta Lake Boat Rides",
    kind: "Nature",
    categories: ["Nature", "Recreation", "Family"],
    area: "oguta-lake",
    address: "Oguta Lake, Imo State",
    description: "Take a boat out on one of the region’s largest lakes, then stay for grilled fish on the shore.",
    hours: "Daily, 9:00 AM – 5:00 PM",
    price: "From ₦5,000 per person",
    distanceKm: 38,
    rating: 4.7,
    reviewCount: 233,
    image: "lake-boats",
  },
  {
    slug: "family-fun-park",
    name: "Family Fun Park",
    kind: "Recreation",
    categories: ["Recreation", "Family"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    description: "Rides, games and snack stands for children and grown-ups alike. Busiest on Sunday afternoons.",
    hours: "Thu – Sun, 11:00 AM – 8:00 PM",
    price: "From ₦2,500",
    distanceKm: 3.6,
    rating: 4.3,
    reviewCount: 157,
    image: "funfair",
  },
  {
    slug: "palm-grove-trail",
    name: "Palm Grove Nature Trail",
    kind: "Nature",
    categories: ["Nature", "Recreation"],
    area: "nekede",
    address: "Outskirts of Owerri West, Imo State",
    description: "Red-earth paths through oil-palm groves — best for an early-morning walk or a cycle before the heat.",
    hours: "Daily, sunrise – sunset",
    price: "Free",
    distanceKm: 6.5,
    rating: 4.4,
    reviewCount: 48,
    image: "palm-road",
  },
  {
    slug: "skyline-rooftop",
    name: "Skyline Rooftop Lounge",
    kind: "Hangout",
    categories: ["Hangouts", "Music"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    description: "String lights, city views and DJs on weekends. Arrive before 9pm for a table by the edge.",
    hours: "Wed – Sun, 6:00 PM – 2:00 AM",
    price: "No cover before 10 PM",
    distanceKm: 2.5,
    rating: 4.5,
    reviewCount: 311,
    image: "rooftop-lights",
  },
  {
    slug: "courtyard-sessions",
    name: "Courtyard Live Sessions",
    kind: "Hangout",
    categories: ["Hangouts", "Music"],
    area: "ikenegbu",
    address: "Ikenegbu, Owerri, Imo State",
    description: "An intimate stage for highlife, afro-jazz and acoustic sets, with small plates and cocktails.",
    hours: "Fri & Sat, 8:00 PM – late",
    price: "₦3,000 entry",
    distanceKm: 1.3,
    rating: 4.6,
    reviewCount: 88,
    image: "live-music",
  },
  {
    slug: "mbari-cultural-centre",
    name: "Mbari Cultural Centre",
    kind: "Culture",
    categories: ["Culture", "Family"],
    area: "ikenegbu",
    address: "Ikenegbu, Owerri, Imo State",
    description: "Owerri’s home of Mbari heritage — sculpture, Igbo art and cultural performances. Check opening times before visiting.",
    hours: "Hours vary — check locally",
    price: "Small entry fee",
    distanceKm: 1.6,
    rating: 4.6,
    reviewCount: 205,
    image: "masquerade-2",
  },
  {
    slug: "uli-contemporary-gallery",
    name: "Uli Contemporary Gallery",
    kind: "Culture",
    categories: ["Culture"],
    area: "ikenegbu",
    address: "Ikenegbu, Owerri, Imo State",
    description: "Rotating exhibitions of painting and sculpture by artists from Imo State and across Nigeria.",
    hours: "Tue – Sat, 10:00 AM – 6:00 PM",
    price: "Free",
    distanceKm: 1.4,
    rating: 4.5,
    reviewCount: 72,
    image: "gallery-2",
  },
  {
    slug: "drum-circle",
    name: "Sunday Drum Circle",
    kind: "Culture",
    categories: ["Culture", "Music"],
    area: "owerri-municipal",
    address: "Owerri Municipal, Owerri, Imo State",
    description: "Join local drummers for an open, all-levels session of traditional rhythms. Drums provided.",
    hours: "Sundays, 4:00 PM – 6:00 PM",
    price: "₦2,000",
    distanceKm: 0.6,
    rating: 4.8,
    reviewCount: 54,
    image: "drum-ensemble",
  },
  {
    slug: "riverside-eco-lodge",
    name: "Riverside Eco Lodge",
    kind: "Getaway",
    categories: ["Stays", "Nature"],
    area: "nekede",
    address: "Outskirts of Owerri West, Imo State",
    description: "Thatched cabins among palms and rainforest, with river walks, home-cooked Igbo breakfasts and no traffic noise.",
    hours: "Weekend packages, Fri – Sun",
    price: "From ₦95,000 / 2 nights",
    distanceKm: 9.5,
    rating: 4.8,
    reviewCount: 57,
    image: "lodge",
  },
  {
    slug: "lakeside-weekend",
    name: "Oguta Lakeside Weekend",
    kind: "Getaway",
    categories: ["Stays", "Nature", "Family"],
    area: "oguta-lake",
    address: "Oguta Lake, Imo State",
    description: "Two nights by the water: a boat ride, grilled-fish lunch on the shore and slow sunsets over the lake.",
    hours: "Weekends, all year",
    price: "From ₦120,000 / 2 nights",
    distanceKm: 38,
    rating: 4.7,
    reviewCount: 41,
    image: "lake-sunset",
  },
  {
    slug: "treetop-retreat",
    name: "Treetop Garden Retreat",
    kind: "Getaway",
    categories: ["Stays"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    description: "A quiet garden suite raised among the trees — ideal for a city break with good food nearby.",
    hours: "Check-in from 2:00 PM",
    price: "From ₦70,000 / night",
    distanceKm: 4.1,
    rating: 4.6,
    reviewCount: 33,
    image: "eco-lodge",
  },
  {
    slug: "imo-river-canoe",
    name: "Imo River Canoe Trip",
    kind: "Nature",
    categories: ["Nature", "Recreation"],
    area: "nekede",
    address: "Imo River, Imo State",
    description: "A guided paddle through forest-lined water, with a riverside picnic of roasted plantain and fish.",
    hours: "Sat & Sun, 8:00 AM – 1:00 PM",
    price: "From ₦12,000 per person",
    distanceKm: 24,
    rating: 4.6,
    reviewCount: 29,
    image: "forest-river",
  },
  {
    slug: "rainforest-walk",
    name: "Rainforest Stream Walk",
    kind: "Nature",
    categories: ["Nature", "Family"],
    area: "nekede",
    address: "Owerri West, Imo State",
    description: "Shaded paths, birdsong and a cool, fast stream — an easy morning walk with a local guide.",
    hours: "Daily, 7:00 AM – 11:00 AM",
    price: "₦5,000 with guide",
    distanceKm: 12,
    rating: 4.5,
    reviewCount: 38,
    image: "rainforest-river",
  },
  {
    slug: "waterfall-day-trip",
    name: "Waterfall Day Trip",
    kind: "Nature",
    categories: ["Nature", "Recreation"],
    area: "owerri-municipal",
    address: "Departs from Owerri city centre",
    description: "A full-day road trip to a forest waterfall in south-east Nigeria, with swimming spots and a packed lunch.",
    hours: "Saturdays, 6:30 AM – 7:00 PM",
    price: "From ₦25,000 per person",
    distanceKm: 0.5,
    rating: 4.7,
    reviewCount: 62,
    image: "waterfall",
  },
  {
    slug: "green-hills-viewpoint",
    name: "Green Hills Viewpoint",
    kind: "Nature",
    categories: ["Nature"],
    area: "nekede",
    address: "Owerri West, Imo State",
    description: "Rolling green hills and wide views — bring a camera for golden hour.",
    hours: "Daily, sunrise – sunset",
    price: "Free",
    distanceKm: 14,
    rating: 4.4,
    reviewCount: 26,
    image: "green-hills",
  },
  {
    slug: "yam-and-produce-stall",
    name: "Mama Ada’s Yam & Produce",
    kind: "Market",
    marketGroup: "Fresh Produce",
    categories: ["Market"],
    area: "owerri-municipal",
    address: "Owerri Municipal market area, Imo State",
    description: "Seed yams, cocoyam, plantain and seasonal vegetables, sourced from farms around Imo State.",
    hours: "Mon – Sat, 7:00 AM – 6:00 PM",
    price: "Yam from ₦3,500 per tuber",
    distanceKm: 0.6,
    rating: 4.7,
    reviewCount: 88,
    image: "yams",
  },
  {
    slug: "fresh-greens-corner",
    name: "Fresh Greens Corner",
    kind: "Market",
    marketGroup: "Fresh Produce",
    categories: ["Market"],
    area: "wetheral-road",
    address: "Wetheral Road, Owerri, Imo State",
    description: "Ugu, utazi, okazi and garden eggs, picked fresh every morning.",
    hours: "Daily, 7:00 AM – 5:00 PM",
    price: "Bunches from ₦500",
    distanceKm: 0.9,
    rating: 4.6,
    reviewCount: 64,
    image: "produce",
  },
  {
    slug: "tomato-and-pepper-row",
    name: "Tomato & Pepper Row",
    kind: "Market",
    marketGroup: "Fresh Produce",
    categories: ["Market"],
    area: "owerri-municipal",
    address: "Owerri Municipal, Imo State",
    description: "Baskets of tomatoes, scotch bonnets and tatashe for stews and pepper soup.",
    hours: "Mon – Sat, 6:30 AM – 6:00 PM",
    price: "Baskets from ₦4,000",
    distanceKm: 0.5,
    rating: 4.5,
    reviewCount: 102,
    image: "tomato-market",
  },
  {
    slug: "heritage-spice-house",
    name: "Heritage Spice House",
    kind: "Market",
    marketGroup: "Spices & Ingredients",
    categories: ["Market", "Food & Drink"],
    area: "douglas-road",
    address: "Douglas Road, Owerri, Imo State",
    description: "Ehu, uziza seeds, ogiri, crayfish and ready-mixed pepper-soup spice, weighed to order.",
    hours: "Mon – Sat, 8:00 AM – 7:00 PM",
    price: "Spice packs from ₦800",
    distanceKm: 0.7,
    rating: 4.8,
    reviewCount: 117,
    image: "spices",
  },
  {
    slug: "dried-spice-bowls",
    name: "Pepper Soup Spice Corner",
    kind: "Market",
    marketGroup: "Spices & Ingredients",
    categories: ["Market"],
    area: "wetheral-road",
    address: "Wetheral Road, Owerri, Imo State",
    description: "Ground pepper-soup blends, dried chillies and seasoning mixes measured into bowls while you wait.",
    hours: "Daily, 8:00 AM – 6:00 PM",
    price: "Blends from ₦600",
    distanceKm: 0.9,
    rating: 4.5,
    reviewCount: 47,
    image: "spices-2",
  },
  {
    slug: "palm-fruit-stall",
    name: "Palm Fruit & Pepper Stall",
    kind: "Market",
    marketGroup: "Spices & Ingredients",
    categories: ["Market"],
    area: "owerri-municipal",
    address: "Owerri Municipal, Imo State",
    description: "Fresh palm fruit for ofe akwu, red palm oil and dried peppers.",
    hours: "Mon – Sat, 7:00 AM – 5:00 PM",
    price: "Palm oil from ₦2,500 / litre",
    distanceKm: 0.6,
    rating: 4.5,
    reviewCount: 59,
    image: "palm-fruit-market",
  },
  {
    slug: "clay-and-kiln-pottery",
    name: "Clay & Kiln Pottery",
    kind: "Market",
    marketGroup: "Crafts & Handmade",
    categories: ["Market", "Culture"],
    area: "ikenegbu",
    address: "Ikenegbu, Owerri, Imo State",
    description: "Hand-thrown clay pots, water jars and serving bowls, with demonstrations on Saturdays.",
    hours: "Tue – Sat, 10:00 AM – 6:00 PM",
    price: "Bowls from ₦6,000",
    distanceKm: 1.5,
    rating: 4.8,
    reviewCount: 45,
    image: "pottery",
  },
  {
    slug: "woven-basket-collective",
    name: "Woven Basket Collective",
    kind: "Market",
    marketGroup: "Crafts & Handmade",
    categories: ["Market", "Culture"],
    area: "new-owerri",
    address: "New Owerri, Owerri, Imo State",
    description: "Colourful woven trays, baskets and mats made by a local women’s cooperative.",
    hours: "Mon – Sat, 9:00 AM – 6:00 PM",
    price: "Trays from ₦4,500",
    distanceKm: 2.2,
    rating: 4.7,
    reviewCount: 52,
    image: "baskets",
  },
  {
    slug: "ankara-fabric-house",
    name: "Ankara Fabric House",
    kind: "Market",
    marketGroup: "Crafts & Handmade",
    categories: ["Market"],
    area: "douglas-road",
    address: "Douglas Road, Owerri, Imo State",
    description: "Bolts of ankara and lace, with tailors on hand for made-to-measure outfits.",
    hours: "Mon – Sat, 9:00 AM – 7:00 PM",
    price: "From ₦9,000 per 6 yards",
    distanceKm: 0.8,
    rating: 4.6,
    reviewCount: 73,
    image: "ankara",
  },
];

/* ------------------------------------------------------------------ */
/* Stories                                                             */
/* ------------------------------------------------------------------ */

export const stories: Story[] = [
  {
    slug: "ofe-owerri-soup-of-celebration",
    title: "Ofe Owerri: the soup of celebration",
    dek: "Why the city’s signature pot is about generosity as much as flavour.",
    category: "Food",
    author: "Native Editorial",
    readTime: "5 min read",
    date: "Oct 2026",
    image: "ofe-owerri",
    body: [
      {
        text: "Ask anyone from Owerri what to eat first and the answer comes quickly: Ofe Owerri. It is the soup cooked for honoured guests, for homecomings and for the days when a family wants to show that nothing has been spared.",
      },
      {
        heading: "Built on leaves",
        text: "The soup’s character comes from ukazi — a firm, slightly bitter leaf — softened with ugu. Cocoyam paste gives the broth its body, while palm oil lends colour and depth.",
      },
      {
        heading: "Generosity in every spoon",
        text: "What sets Ofe Owerri apart is abundance. Stockfish, dried fish, assorted meats and more all find their way into the pot. Cooking it well takes time, and serving it says something about the host.",
      },
      {
        heading: "Where to try it",
        text: "Many of the best versions are still cooked at home, but a growing number of restaurants now serve it with real care. Start with a modern take, then ask a local friend for an invitation to Sunday lunch.",
      },
    ],
  },
  {
    slug: "douglas-road-after-dark",
    title: "A night guide to Douglas Road",
    dek: "Where to go, what to order and how to pace yourself.",
    category: "City Guide",
    author: "Native Editorial",
    readTime: "4 min read",
    date: "Sep 2026",
    image: "suya-grill",
    body: [
      { text: "By day Douglas Road belongs to traders. By night it belongs to anyone with an appetite. Smoke rises from grills, music spills out of bars and the bowls of nkwobi start to circulate." },
      { heading: "Start light", text: "Begin with a plate of suya and a cold drink while the evening warms up. Pepper soup is the next step — it prepares you for what follows." },
      { heading: "Then go big", text: "Nkwobi and isi ewu are meant to be shared. Order one bowl for the table, take your time and let the conversation carry on." },
    ],
  },
  {
    slug: "mbari-houses-for-the-earth",
    title: "Mbari: art made for the earth",
    dek: "Owerri’s Mbari tradition and why it still matters to the city’s creative scene.",
    category: "Culture",
    author: "Native Editorial",
    readTime: "6 min read",
    date: "Aug 2026",
    image: "masquerade",
    body: [
      { text: "Mbari houses are among the most remarkable art forms of the Owerri Igbo. Built as sacred offerings, traditionally to Ala, the earth deity, they were filled with sculpted clay figures depicting gods, people and everyday life." },
      { heading: "An act, not an object", text: "Part of what makes Mbari distinctive is that the making itself was the offering. Once complete, the house was often left to return to the earth, ready for the cycle to begin again." },
      { heading: "A living influence", text: "Today, the spirit of Mbari shows up across the city’s creative life — in galleries, masquerade performances and the workshops that teach uli and sculpture to a new generation." },
    ],
  },
  {
    slug: "abacha-explained",
    title: "Abacha, explained",
    dek: "Everything you need to know before your first plate of African salad.",
    category: "Lifestyle",
    author: "Native Editorial",
    readTime: "3 min read",
    date: "Jul 2026",
    image: "abacha",
    body: [
      { text: "Abacha is made from cassava that has been cooked, shredded and dried. Soaked briefly, it softens into springy strands ready to soak up a rich palm-oil dressing." },
      { heading: "The essentials", text: "Ugba — fermented oil bean — brings a nutty, savoury depth. Garden egg leaves, onions and utazi add freshness and gentle bitterness." },
      { heading: "How to order", text: "Most spots will ask what you want on top. Fried fish is classic, ponmo is popular and a side of garden eggs is never a bad idea." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Lookups & derived feeds                                             */
/* ------------------------------------------------------------------ */

export const getRestaurant = (slug: string) => restaurants.find((r) => r.slug === slug);
export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
export const getNeighbourhood = (slug: string) => neighbourhoods.find((n) => n.slug === slug);
export const areaName = (slug: string) => getNeighbourhood(slug)?.name ?? slug;

export type ExploreItem = {
  slug: string;
  kind: "event" | "place" | "restaurant";
  title: string;
  image: ImageName;
  location: string;
  time: string;
  categories: ExploreCategory[];
  description: string;
  price: string;
  date?: string;
  ticketPrice?: number;
  distanceKm?: number;
  rating?: number;
  reviewCount?: number;
  label: string; // e.g. "Event", "Stay", "Café"
  href?: string;
};

/** Everything that can appear in the Explore feed: events, places and restaurants. */
export const exploreItems: ExploreItem[] = [
  ...events.map<ExploreItem>((e) => ({
    slug: e.slug,
    kind: "event",
    title: e.title,
    image: e.image,
    location: e.venue === areaName(e.area) ? `${e.venue}, Owerri` : `${e.venue}, ${areaName(e.area)}`,
    time: e.time,
    categories: e.categories,
    description: e.description,
    price: e.price,
    date: e.date,
    ticketPrice: e.ticketPrice,
    label: "Event",
  })),
  ...places.map<ExploreItem>((p) => ({
    slug: p.slug,
    kind: "place",
    title: p.name,
    image: p.image,
    location: `${areaName(p.area)}${p.area === "oguta-lake" ? "" : ", Owerri"}`,
    time: p.hours,
    categories: p.categories,
    description: p.description,
    price: p.price,
    distanceKm: p.distanceKm,
    rating: p.rating,
    reviewCount: p.reviewCount,
    label: p.kind,
  })),
  ...restaurants.map<ExploreItem>((r) => ({
    slug: r.slug,
    kind: "restaurant",
    title: r.name,
    image: r.cover,
    location: `${areaName(r.area)}${r.area === "oguta-lake" ? "" : ", Owerri"}`,
    time: `${r.days} · ${hoursLabel(r.open, r.close)}`,
    categories: r.categories.includes("Bars & Lounges") ? ["Food & Drink", "Hangouts"] : ["Food & Drink"],
    description: r.tagline,
    price: "₦".repeat(r.price),
    distanceKm: r.distanceKm,
    rating: r.rating,
    reviewCount: r.reviewCount,
    label: r.categories.includes("Cafés") ? "Café" : r.categories.includes("Bars & Lounges") ? "Bar & lounge" : "Restaurant",
    href: `/restaurants/${r.slug}`,
  })),
];

export const getExploreItem = (slug: string) => exploreItems.find((x) => x.slug === slug);

export type Notice = { id: string; title: string; body: string; when: string; href: string; kind: "event" | "offer" | "market" | "tour" | "story" };

/** Sample notifications (order updates are added on the client from the orders store). */
export const notices: Notice[] = [
  { id: "n-festival", title: "Tickets now on sale", body: "The Owerri Cultural Festival returns on Sat 28 Nov at Dan Anyiam Stadium.", when: "2h ago", href: "/events?item=owerri-cultural-festival", kind: "event" },
  { id: "n-market", title: "Fresh at the market", body: "New-season yams have arrived at Mama Ada’s Yam & Produce.", when: "Today", href: "/market#fresh-produce", kind: "market" },
  { id: "n-lodge", title: "Weekend getaway idea", body: "Riverside Eco Lodge has weekend cabins free — two nights from ₦95,000.", when: "Yesterday", href: "/tours/stays?item=riverside-eco-lodge", kind: "tour" },
  { id: "n-terrace", title: "Free delivery this week", body: "The Green Terrace is waiving delivery on orders over ₦10,000 (sample offer).", when: "2 days ago", href: "/restaurants/the-green-terrace/menu", kind: "offer" },
  { id: "n-story", title: "New on the blog", body: "Mbari: art made for the earth — why Owerri’s tradition still matters.", when: "This week", href: "/stories/mbari-houses-for-the-earth", kind: "story" },
];
