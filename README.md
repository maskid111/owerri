# Native

*Native, beyond the plate* — order food from local restaurants and discover markets, culture, stays, events and experiences, all in one place. The sample listings in this prototype are set in Owerri, Imo State.

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

## Brand

- **Name:** Native · **Tagline:** *Native, beyond the plate*
- **Logo:** the official artwork, drawn only by `Wordmark` in `src/components/brand.tsx`, which every header, drawer, footer, the splash screen and the admin previews use. `public/brand/native-logo.svg` has green letters; `native-logo-white.svg` swaps the letters to white for dark backgrounds. The gold leaf is never recoloured. `native-logo-original.svg` is the file as supplied (the other two only trim the empty canvas padding).
- **Colours:** forest green is primary; neutrals stay clean. A small orange accent `--color-spark` (#F1A10C, sampled from the supplied swatch) is used only for heading underlines, active-navigation indicators and tiny separators. No yellow or gold in the interface (the logo’s leaf is the only exception).
- **Pattern:** the supplied image (`public/brand/native-pattern.jpg`) is kept; `bg-native-pattern` / `bg-native-pattern-lg` draw a mirrored tile of it at reduced scale under a deep-green wash so it reads as a quiet texture.

## Opening splash & homepage

- **Splash:** white screen with the wordmark and tagline, a soft entrance and fade (`globals.css`, `components/splash.tsx`). Shown on every full load of the homepage, and on the first page of a browser session elsewhere — never on internal navigation (`src/lib/theme-script.ts`). It never intercepts clicks, shortens under reduced motion, and a timer removes it even if animations are paused.
- **Hero video:** the portrait master supplied by the Native team (2160×4096, 25 fps, 14.8 s, a slow push-in on three women holding woven baskets of fruit) is encoded as a seamless 13.8 s crossfade loop in `public/videos/`: `native-hero-portrait.mp4` (1080×1920, tall phones) and `native-hero-1080.mp4` (1920×1080, all other screens — the crop moves down with the camera so faces stay in frame), plus matching posters. `components/hero-video.tsx` picks the rendition on the client; it autoplays muted and looped with `object-fit: cover`, has no visible player controls, stays on its poster under reduced motion, and keeps the poster if a file can't play. Re-encode with ffmpeg (H.264 High, CRF 20–21, `-movflags +faststart`) if the master changes.
- **Product-first homepage:** the video now sits in a compact hero (location, one headline, Order food + Explore) instead of filling the screen. The site search (restaurants, dishes on menus, places, events) overlaps the hero, and the **service tiles** follow directly, so every service is visible on the first screen of a phone. The order below is food first: featured restaurants, popular dishes (add to cart from the card), markets & shops, culture & events, nearby experiences, then an "Explore Native" culture banner.
- **Services** are defined once in `src/lib/services.ts` (Restaurants, Dishes, Local Markets, Culture & Events, Stays & Hospitality, Shops & Crafts, Nearby & Experiences, Places) and drawn with small flat illustrations from `src/components/service-art.tsx`. Version A shows soft-coloured square tiles; Version B shows round bubbles with label pills.
- **Site menu:** both versions' mobile menus use the same grouped list (`components/app-menu.tsx`, `menuGroups` in `services.ts`): *Explore* (illustrated rows with a one-line hint), *Your space* (Saved, Orders, Notifications) and *Support*, then a culture card.

## Food ordering

Food ordering is a primary service: **Restaurants** (`/restaurants`) is second in the navigation, first among the homepage shortcuts and in both mobile docks.

- **Homepage:** a "Good food, delivered." row of restaurants directly below the video in both versions: Annie’s Native Kitchen first, then Chicken Republic and Kilimanjaro (`TOP_RESTAURANTS` in `src/lib/data.ts`), then featured kitchens.
- **Restaurants page:** every restaurant, with those three first under *Recommended*, plus category chips, delivery and open-now filters and sorting. Search matches restaurant names *and* dishes on their menus (“Serves Jollof Rice & Chicken”). A floating cart bar shows items, subtotal and Checkout.
- **Journey:** Home (or Restaurants) → restaurant → add dishes → cart drawer → `/orders` review & checkout → confirmation. The restaurant page *is* the ordering page: photo hero, tabs (Menu / About / Reviews / Gallery in A; Menu / About / Reviews in B), category circles, popular-dish cards and menu rows with Add buttons and quantity steppers (`components/restaurant-page.tsx`, `components/sig/menu.tsx`). `/restaurants/[slug]/menu` still works and shows the same page. Popular dishes can also be added straight from the homepage (`useOrdering` in `components/food.tsx`). One cart store (`src/lib/cart-store.ts`) powers every step.
- **Honest prototype:** checkout says that online ordering isn’t live yet. Orders are saved in the browser only: nothing is sent to the restaurant, no payment is taken, no delivery is arranged and no fake delivery status is shown. The delivery fee is labelled as a sample. To connect real ordering, replace `cart.placeOrder`.
- **Annie’s Native Kitchen, Chicken Republic and Kilimanjaro** have unconfirmed profiles: only their names are real. Menus, prices, cuisine, address, hours, phone and delivery details are `SAMPLE` placeholders in `src/lib/data.ts`. The site shows "New on Native" with a one-line note instead of inventing ratings, reviews, distance, hours or a phone number. To publish real details, put naira prices in `prices`, fill in `open`, `close`, `phone`, `address` and `area`, then remove `sampleProfile`.

## Two design versions

The site ships two complete design systems over the same routes, data and business logic.

| | Version A — Original UI | Version B — Native Signature Experience |
| --- | --- | --- |
| Presentation | existing components in `src/components` | `src/components/sig/*` |
| Header / nav | logo left, horizontal links (white over the homepage hero), grouped drawer + dark green bottom bar (Home, Food, Market, Saved, Menu) | centred logo, a few text links, grouped slide-in menu panel, floating pill dock |
| Homepage | full-width compact video hero, overlapping search bar, square service tiles, dark photo cards | rounded video hero card, floating search pill, round service bubbles, light portrait cards |
| Cards & menus | dark photo cards; restaurant page with dark hero, spark-orange Add buttons | caption-bar tiles, portrait restaurant cards, ticket-style events; restaurant page with rounded hero and a persistent order panel |
| Footer | column footer on the pattern | centred wordmark footer on the full-strength pattern |

**How it works**
- `src/lib/design.ts` stores the version (`native:design` in localStorage). An inline script in `src/app/layout.tsx` sets `<html data-design="b">` before first paint.
- Every page and the layout chrome render `<Design a={…} b={…} />` (`src/components/design.tsx`); CSS in `globals.css` displays exactly one. Both are prerendered, so switching never flashes and survives refresh.
- Version B tokens (`:root[data-design="b"]`) and sans display font are defined in `globals.css`. Version A keeps its Native Light / Native Forest palettes.
- Shared logic: `src/lib/feed.ts` (discovery filtering), `src/lib/restaurant-filter.ts`, cart/orders/saved/notification stores, `src/lib/data.ts`. Functional widgets (checkout, settings, contact form, cart drawer) are reused inside Version B layouts.
- Version B anchors use `data-anchor` (ids belong to Version A); `SigHashScroll` handles `#hash` links.

**Switching:** `/admin` → *Website Design Selector* (frontend-only prototype — affects this browser only, not other visitors). Version A's palette (Light / Forest) is chosen there too.

## Design & themes

References live in `design-references/` (`native/` holds the current Native set: drawer, pattern, light and forest mock-ups).

- **Palette:** forest greens and warm neutrals only — no yellow. Tokens are in `src/app/globals.css` (`@theme`).
- **Two themes:** *Native Light* (default) and *Native Forest*. Theme-dependent tokens (`canvas`, `paper`, `ink`, `forest`, `accent`…) are overridden on `:root[data-theme="forest"]`; constant tokens (`pine`, `forest-deep`, `cream`, `leaf`) are for always-dark surfaces such as photo overlays, pattern sections and the footer.
- **Version A palettes:** set under `/admin` (saved as `native:theme`), applied before first paint.
- **Brand pattern:** the supplied image is kept as `public/brand/native-pattern.jpg`. `public/brand/native-pattern-tile.png` is the same image with a 9px white edge artefact trimmed and mirrored 2×2 so it repeats seamlessly. Use the `bg-native-pattern` / `bg-native-pattern-lg` utilities (hero edges, `PatternBanner`, footer, drawer, culture feature).
- **Navigation:** defined once in `src/lib/navigation.ts` (Home, Restaurants, Local Market, Tours › Stays & Getaways / Nature & Places, Nearby, Events & Hangouts, Discover (`/blog`), Saved, Notifications, Settings, Help / Support) and used by the desktop header, mobile drawer and footer.

## Pages

- `/` – compact video hero, search, service tiles, featured restaurants, popular dishes, markets & shops, culture & events, nearby experiences, Explore Native banner
- `/market` – traditional food (kitchens you can order from), fresh produce, spices & ingredients, crafts
- `/tours`, `/tours/stays`, `/tours/nature` · `/nearby` · `/events` – scoped discovery feeds (`?cat=`, `?item=<slug>` opens the details/tickets sheet)
- `/saved`, `/notifications`, `/blog`, `/settings`, `/help`, `/admin`
- `/restaurants` – Restaurants (+ `[slug]` restaurant & ordering page; `[slug]/menu` shows the same page), `/orders` cart review & checkout
- Existing flows kept: `/explore`, `/culture`, `/dishes`, `/neighbourhoods`, `/stories/[slug]`, `/credits`, ⌘K search

## Data & images

- All listings, menus, events, prices and phone numbers in `src/lib/data.ts` are **sample content** — replace with a CMS/API. Menus are built from a shared catalogue (`getMenu`) so prices stay consistent between menu, cart and orders.
- Cart, orders and favourites are client-side only (`src/lib/cart-store.ts`, `src/lib/saved-store.ts`). There is no backend, authentication or payment.
- Photos live in `public/images` and are registered in `src/lib/images.ts`. Most are from Unsplash (Unsplash License); five are from Wikimedia Commons under CC BY-SA 4.0 and are credited on `/credits`. Photos illustrate dishes and moods, not the specific sample businesses.
- Fonts (Fraunces, Manrope; SIL OFL) are self-hosted in `public/fonts`.
