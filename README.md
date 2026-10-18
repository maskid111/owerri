# Native

*Native, beyond the plate* — food, culture, places and experiences in Owerri, Imo State: local market, tours, stays, events and kitchens to order from.

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

## Opening splash & homepage video

- **Splash:** white screen with the wordmark and tagline, a soft entrance and fade (`globals.css`, `components/splash.tsx`). Shown on every full load of the homepage, and on the first page of a browser session elsewhere — never on internal navigation (`src/lib/theme-script.ts`). It never intercepts clicks, shortens under reduced motion, and a timer removes it even if animations are paused.
- **Hero video:** the cultural-dance master supplied by the Native team (3840×2160, 25 fps, 9.6 s, no audio) is encoded as a seamless 8.8 s crossfade loop in `public/videos/`: `native-dance-portrait.mp4` (1080×1920 centre cut, tall phones), `native-dance-1080.mp4` (most screens) and `native-dance-2160.mp4` (large / high-density displays, skipped with Save-Data), plus matching posters. `components/hero-video.tsx` picks the rendition on the client; it autoplays muted and looped with `object-fit: cover`, has no visible player controls, stays on its poster under reduced motion, and keeps the poster if a file can't play. Re-encode with ffmpeg (H.264 High, CRF 20–21, `-movflags +faststart`) if the master changes.
- **Welcome sequence:** `components/landing-story.tsx` reveals "Discover the heart of Owerri." → "Taste local." → "Explore culture." → "Find places worth discovering." → "Native, beyond the plate." word by word, once, starting after the splash. Version A uses large serif left-aligned text; Version B bold sans, centred. Screen readers get the full text once; reduced motion shows the opening line and tagline with no movement.
- The landing viewport holds only **Explore** (→ `/explore`) and a **search field** (opens the site search pre-filled). Version A aligns them bottom-left; Version B uses one centred pill.

## Food ordering

Food ordering is a primary service: **Food & Restaurants** (`/restaurants`) is second in the navigation, first among the homepage shortcuts and in both mobile docks.

- **Homepage:** a "Good food, delivered." row of restaurants directly below the video in both versions: Annie’s Native Kitchen first, then Chicken Republic and Kilimanjaro (`TOP_RESTAURANTS` in `src/lib/data.ts`), then featured kitchens.
- **Food & Restaurants page:** every restaurant, with those three first under *Recommended*, plus category chips, delivery and open-now filters and sorting. Search matches restaurant names *and* dishes on their menus (“Serves Jollof Rice & Chicken”). A floating cart bar shows items, subtotal and Checkout.
- **Journey:** Food & Restaurants → restaurant (View menu / Order now) → menu → cart drawer → `/orders` review & checkout → confirmation. One cart store (`src/lib/cart-store.ts`) powers every step.
- **Honest prototype:** checkout says that online ordering isn’t live yet. Orders are saved in the browser only: nothing is sent to the restaurant, no payment is taken, no delivery is arranged and no fake delivery status is shown. The delivery fee is labelled as a sample. To connect real ordering, replace `cart.placeOrder`.
- **Annie’s Native Kitchen, Chicken Republic and Kilimanjaro** have unconfirmed profiles: only their names are real. Menus, prices, cuisine, address, hours, phone and delivery details are `SAMPLE` placeholders in `src/lib/data.ts`. The site shows "New on Native" with a one-line note instead of inventing ratings, reviews, distance, hours or a phone number. To publish real details, put naira prices in `prices`, fill in `open`, `close`, `phone`, `address` and `area`, then remove `sampleProfile`.

## Two design versions

The site ships two complete design systems over the same routes, data and business logic.

| | Version A — Original UI | Version B — Native Signature Experience |
| --- | --- | --- |
| Presentation | existing components in `src/components` | `src/components/sig/*` |
| Header / nav | serif logo, horizontal links, Tours dropdown, mobile drawer + 5-tab bar | centred uppercase wordmark, search bar, sticky icon rail of every section, full-screen grid menu, scrollable all-sections dock |
| Hero | full-bleed photo carousel | stacked "Taste / Explore / Experience" headline with an arched photo frame |
| Cards | photo + white body, horizontal listing cards | caption-bar tiles, portrait restaurant cards, distance rows, ticket-style events |
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
- **Navigation:** defined once in `src/lib/navigation.ts` (Home, Food & Restaurants, Local Market, Tours › Stays & Getaways / Nature & Places, Nearby, Events & Hangouts, Saved, Notifications, Blog, Settings, Help / Support) and used by the desktop header, mobile drawer and footer.

## Pages

- `/` – cultural video hero, restaurants row, discovery shortcuts, Tours, Local Market, pattern cultural feature, Nearby, Events & Hangouts, stories
- `/market` – traditional food (kitchens you can order from), fresh produce, spices & ingredients, crafts
- `/tours`, `/tours/stays`, `/tours/nature` · `/nearby` · `/events` – scoped discovery feeds (`?cat=`, `?item=<slug>` opens the details/tickets sheet)
- `/saved`, `/notifications`, `/blog`, `/settings`, `/help`, `/admin`
- `/restaurants` – Food & Restaurants (+ `[slug]` profile, `[slug]/menu` ordering), `/orders` cart review & checkout
- Existing flows kept: `/explore`, `/culture`, `/dishes`, `/neighbourhoods`, `/stories/[slug]`, `/credits`, ⌘K search

## Data & images

- All listings, menus, events, prices and phone numbers in `src/lib/data.ts` are **sample content** — replace with a CMS/API. Menus are built from a shared catalogue (`getMenu`) so prices stay consistent between menu, cart and orders.
- Cart, orders and favourites are client-side only (`src/lib/cart-store.ts`, `src/lib/saved-store.ts`). There is no backend, authentication or payment.
- Photos live in `public/images` and are registered in `src/lib/images.ts`. Most are from Unsplash (Unsplash License); five are from Wikimedia Commons under CC BY-SA 4.0 and are credited on `/credits`. Photos illustrate dishes and moods, not the specific sample businesses.
- Fonts (Fraunces, Manrope; SIL OFL) are self-hosted in `public/fonts`.
