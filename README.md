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
- **Logo:** the official artwork (lowercase “native” with the woman carrying a pot as the “i”), drawn only by `Wordmark` in `src/components/brand.tsx`, which every header, drawer, footer, the splash screen, auth pages and the admin previews use. `public/brand/native-logo-green.png` / `native-logo-white.png` are the full lockup with “BEYOND THE PLATE” (`tagline`, the default); `native-wordmark-green.png` / `native-wordmark-white.png` are the wordmark alone for tight spaces such as the phone header. White files are used on dark backgrounds and in the Option 2 dark theme.
- **Colours:** forest green is primary; neutrals stay clean. A soft gold accent `--color-spark` (#E7B655 — lighter than the original #F1A10C, which read too yellow) is used for small highlights, ratings and the key Explore Food / Add / View Restaurant buttons.
- **Pattern:** the supplied image (`public/brand/native-pattern.jpg`) is kept; `bg-native-pattern` / `bg-native-pattern-lg` draw a mirrored tile of it at reduced scale under a deep-green wash so it reads as a quiet texture.

## Opening splash & homepage

- **Splash:** white screen with the wordmark and tagline, a soft entrance and fade (`globals.css`, `components/splash.tsx`). Shown on every full load of the homepage, and on the first page of a browser session elsewhere — never on internal navigation (`src/lib/theme-script.ts`). It never intercepts clicks, shortens under reduced motion, and a timer removes it even if animations are paused.
- **Hero:** a compact, cinematic food photograph (three slides cross-fading every 6 s, with dots; paused under reduced motion) with the text to one side: a small label, "Real Flavours. True Stories.", one line and an orange **Explore Food** button. The supplied cultural video and its renditions remain in `public/videos/` and `components/hero-video.tsx` (`HeroVideo`) but are no longer shown on the homepage.
- **Homepage (follows the dark reference mock-up):** header with the logo on the left; on phones only search, cart and the menu button (right) — notifications and the account are inside the menu. Then the food hero, the search bar beneath it (the existing site search; the filter icon opens Explore), **six illustrated shortcuts** (compact soft-coloured tiles) (Restaurants, Hangout → Events filtered to Hangouts, Places, Events, Market, Stays — `homeShortcuts` in `src/lib/services.ts`), **Featured Restaurants** as a spotlight for Annie’s Native Kitchen (label, name, place, description, View Restaurant) beside a "Places to explore" card, **Popular Dishes** (bordered cards with a category badge, price and Add / quantity controls using the shared cart), **Nearby** (closest places and restaurants with distance badges; they open the existing details) **Farmers Market** (produce and spice stalls) and **Shops & Crafts** (craft makers) rows, and a compact culture banner on the Native pattern. On phones there is no bottom bar. Version B uses the same structure in its own style (rounded hero card, round shortcut bubbles, softer radii). Components: `components/home/*`.
- **Shortcut and menu illustrations** come from `src/components/service-art.tsx` (one consistent flat style).
- **Site menu:** both versions' mobile menus use the same grouped list (`components/app-menu.tsx`, `menuGroups` in `services.ts`): the account card, *Discover & Order* (Home, Restaurants, Explore Nigerian Food) followed by the Native Kitchen banner, *Explore More* (Farmers Market, Tours & Experiences — which includes stays, Events & Hangouts, Nearby, Shops & Crafts, Explore — the stories page), *Quick Access* (Saved, Orders, Notifications, Settings, Help / Support) and the Taste the regions banner.

## Food ordering

Food ordering is a primary service: **Restaurants** (`/restaurants`) is second in the navigation, first among the homepage shortcuts and in both mobile docks.

- **Homepage:** a "Good food, delivered." row of restaurants directly below the video in both versions: Annie’s Native Kitchen first, then Chicken Republic and Kilimanjaro (`TOP_RESTAURANTS` in `src/lib/data.ts`), then featured kitchens.
- **Restaurants page:** every restaurant, with those three first under *Recommended*, plus category chips, delivery and open-now filters and sorting. Search matches restaurant names *and* dishes on their menus (“Serves Jollof Rice & Chicken”). A floating cart bar shows items, subtotal and Checkout.
- **Journey:** Home (or Restaurants) → restaurant → add dishes → cart drawer → `/orders` review & checkout → confirmation. The restaurant page *is* the ordering page: photo hero, tabs (Menu / About / Reviews / Gallery in A; Menu / About / Reviews in B), category circles, popular-dish cards and menu rows with Add buttons and quantity steppers (`components/restaurant-page.tsx`, `components/sig/menu.tsx`). `/restaurants/[slug]/menu` still works and shows the same page. Popular dishes can also be added straight from the homepage (`useOrdering` in `components/food.tsx`). One cart store (`src/lib/cart-store.ts`) powers every step.
- **Honest prototype:** checkout says that online ordering isn’t live yet. Orders are saved in the browser only: nothing is sent to the restaurant, no payment is taken, no delivery is arranged and no fake delivery status is shown. The delivery fee is labelled as a sample. To connect real ordering, replace `cart.placeOrder`.
- **Annie’s Native Kitchen, Chicken Republic and Kilimanjaro** have unconfirmed profiles: only their names are real. Menus, prices, cuisine, address, hours, phone and delivery details are `SAMPLE` placeholders in `src/lib/data.ts`. The site shows "New on Native" with a one-line note instead of inventing ratings, reviews, distance, hours or a phone number. To publish real details, put naira prices in `prices`, fill in `open`, `close`, `phone`, `address` and `area`, then remove `sampleProfile`.

## Accounts & sign-in (prototype)

Routes: `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/verify-email`, `/account` (My Profile), plus draft `/terms` and `/privacy`. Every screen has a Version A layout (form beside a photograph on desktop) and a Version B layout (centred card); behaviour is shared.

**This is not real authentication.** It is a frontend prototype with a clean seam for a real provider:

| Layer | File | Notes |
| --- | --- | --- |
| Validation | `src/lib/auth/validation.ts` | Email, name, Nigerian phone (formats `0803 123 4567` / `+234 …`), password strength, matching, safe `?next=` return paths. Pure functions. |
| Service | `src/lib/auth/service.ts` | `AuthService` interface + `mockAuthService`. Replace the `authService` export with a real implementation (secure HTTP-only sessions, server-side password hashing, real email). |
| Session | `src/lib/auth/session.ts` | `useAuth()` — status, user, sign in/up/out. Stores only the signed-in **profile** (name, email, phone) — never a password or token. "Keep me signed in" → localStorage, otherwise sessionStorage. |
| UI | `src/components/auth/*` | Shared fields (labels, inline errors, show/hide password, strength meter), notices and messages for every state, shells per version, header account button and menu, sign-out confirmation, profile page. |

Prototype behaviour:
- **Demo account:** `demo@native.test` / `NativeDemo1!` (also offered on the sign-in screen).
- Accounts created on `/sign-up` are remembered on this device as a profile only; because passwords are never stored, they sign in with any password of 8+ characters.
- `offline@native.test` simulates a network/service failure on any form.
- No email is ever sent. Forgot-password shows an honest "no email was sent" notice and a demo link to `/reset-password?token=demo-reset`; any other token shows the expired-link state. Verify-email offers "Resend" (prototype feedback) and a labelled "Simulate verification".
- Browsing, menus and the cart never require an account. Checkout asks visitors to sign in or create an account at the final "Place order" step and returns them to `/orders` with the cart intact. Saving works signed out; a one-time toast suggests signing in. Signing in or out never touches the cart, orders or saved items.
- Signed in: initials avatar in the header with My Profile, My Orders, Saved Items, Notifications, Settings, Help & Support and Sign out (with confirmation). The site menu shows an account card at the top.

## Two design versions

The site ships two complete design systems over the same routes, data and business logic.

| | Version A — Original UI | Version B — Native Signature Experience |
| --- | --- | --- |
| Presentation | existing components in `src/components` | `src/components/sig/*` |
| Header / nav | logo left, horizontal links (white over the homepage hero), grouped drawer opening from the right (menu button on the right on phones; no bottom bar) | centred logo, a few text links, grouped slide-in menu panel (no bottom bar on phones) |
| Homepage | full-width compact video hero, overlapping search bar, square service tiles, dark photo cards | rounded video hero card, floating search pill, round service bubbles, light portrait cards |
| Cards & menus | dark photo cards; restaurant page with dark hero, spark-orange Add buttons | caption-bar tiles, portrait restaurant cards, ticket-style events; restaurant page with rounded hero and a persistent order panel |
| Footer | column footer on the pattern | centred wordmark footer on the full-strength pattern |

**How it works**
- `src/lib/design.ts` stores the version (`native:design` in localStorage). An inline script in `src/app/layout.tsx` sets `<html data-design="b">` before first paint.
- Every page and the layout chrome render `<Design a={…} b={…} />` (`src/components/design.tsx`); CSS in `globals.css` displays exactly one. Both are prerendered, so switching never flashes and survives refresh.
- Version B tokens (`:root[data-design="b"]`) and sans display font are defined in `globals.css`. Both versions follow the admin background theme (Option 1 — Native Original / Option 2 — Native Forest Dark).
- Shared logic: `src/lib/feed.ts` (discovery filtering), `src/lib/restaurant-filter.ts`, cart/orders/saved/notification stores, `src/lib/data.ts`. Functional widgets (checkout, settings, contact form, cart drawer) are reused inside Version B layouts.
- Version B anchors use `data-anchor` (ids belong to Version A); `SigHashScroll` handles `#hash` links.

**Switching:** `/admin` → *Website Design Selector* (frontend-only prototype — affects this browser only, not other visitors). The background theme is chosen there too, in its own *Website Background Theme* section.

## Design & themes

References live in `design-references/` (`native/` holds the current Native set: drawer, pattern, light and forest mock-ups).

- **Palette:** forest greens and warm neutrals only — no yellow. Tokens are in `src/app/globals.css` (`@theme`).
- **Website background themes (admin only):** *Option 1 — Native Original* (the existing light surfaces) and *Option 2 — Native Forest Dark* (a complete dark system: layered forest greens for page, cards and inputs, warm cream text, leaf-green accents, `gold `#E7B655` only for small highlights). Theme tokens are overridden on `:root[data-theme="forest"]` for Version A and `:root[data-design="b"][data-theme="forest"]` for Version B, so both design versions follow the selected theme; `dark:` utilities are tied to the same attribute. The logo automatically uses white letters on dark surfaces (the gold leaf is never recoloured).
- **Switching:** only in `/admin` → *Website Background Theme* (separate from the *Website Design Selector*). There is no public toggle in the header, menus, profile or settings. The choice is saved in this browser (`native:theme`) and applied before first paint, so it never flashes — it is **not** yet a central setting shared with every visitor.
- **Brand pattern:** the supplied image is kept as `public/brand/native-pattern.jpg`. `public/brand/native-pattern-tile.png` is the same image with a 9px white edge artefact trimmed and mirrored 2×2 so it repeats seamlessly. Use the `bg-native-pattern` / `bg-native-pattern-lg` utilities (hero edges, `PatternBanner`, footer, drawer, culture feature).
- **Navigation:** defined once in `src/lib/navigation.ts` (Home, Restaurants, Farmers Market, Tours › Stays & Getaways / Nature & Places, Nearby, Events & Hangouts, Explore (`/blog`, stories), Saved, Notifications, Settings, Help / Support) and used by the desktop header, mobile drawer and footer.

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
