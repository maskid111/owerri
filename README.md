# Owerri

Food, places, events and culture guide for Owerri, Imo State — with a mock food-ordering flow.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Lucide React · Motion

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types + `tsc --noEmit` |

## Design

The UI follows the five mockups in `design-references/` (homepage, food listing, restaurant detail, restaurant menu, explore feed): forest green + sunshine yellow on warm cream, Fraunces serif headings, Manrope body text, photography-led cards. On mobile the site uses an app-style top bar and bottom navigation (Home · Explore · Orders · Saved · More); from `lg` up it switches to a horizontal header and wider grids.

Design tokens live in `src/app/globals.css` (`@theme`). Shared primitives (logo, buttons, chips, section headers, `Photo`) are in `src/components/ui.tsx`.

## Pages

- `/` – dark-green photo hero, explore-by-interest tiles, popular restaurants, events, order-near-you list, dishes, stays, stories
- `/explore` – image-led feed of events, restaurants, cafés, hotels, recreation, hangouts and cultural places; `?cat=`, `?sort=nearby`, `?item=<slug>` (opens the details/tickets sheet)
- `/restaurants` – Food & Restaurants listing with category chips, search, sort and filters; `?category=` and `?q=`
- `/restaurants/[slug]` – restaurant profile (Call / Directions / Share, hours, reviews, View menu)
- `/restaurants/[slug]/menu` – ordering interface: Menu / About / Reviews / Photos tabs, menu categories, add-to-cart, quantities, cart bar and drawer
- `/orders` – checkout (delivery or pickup) and order history, stored in localStorage
- `/saved` – favourite restaurants, places and events, stored in localStorage
- `/culture`, `/dishes`, `/neighbourhoods`, `/stories/[slug]`, `/credits`
- Global ⌘K / Ctrl+K search

## Data & images

- All listings, menus, events, prices and phone numbers in `src/lib/data.ts` are **sample content** — replace with a CMS/API. Menus are built from a shared catalogue (`getMenu`) so prices stay consistent between menu, cart and orders.
- Cart, orders and favourites are client-side only (`src/lib/cart-store.ts`, `src/lib/saved-store.ts`). There is no backend, authentication or payment.
- Photos live in `public/images` and are registered in `src/lib/images.ts`. Most are from Unsplash (Unsplash License); five are from Wikimedia Commons under CC BY-SA 4.0 and are credited on `/credits`. Photos illustrate dishes and moods, not the specific sample businesses.
- Fonts (Fraunces, Manrope; SIL OFL) are self-hosted in `public/fonts`.
