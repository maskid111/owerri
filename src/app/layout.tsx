import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { Design } from "@/components/design";
import { SearchDialog } from "@/components/search-dialog";
import { SigDock, SigHashScroll } from "@/components/sig/dock";
import { SigFooter } from "@/components/sig/footer";
import { SigHeader } from "@/components/sig/header";
import { SiteHeader } from "@/components/site-header";
import { Splash } from "@/components/splash";
import { DesignSync } from "@/lib/design";
import { ThemeSync } from "@/lib/theme";
import { themeScript } from "@/lib/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Native — Native, beyond the plate",
    template: "%s · Native",
  },
  description:
    "Native — food, culture, places and experiences in Owerri, Imo State: local market, tours, stays, events and kitchens to order from.",
  keywords: ["Native", "Owerri", "Imo State", "Nigerian food", "local market", "tours", "events", "culture"],
};

export const viewport: Viewport = {
  themeColor: "#0f3d2a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        {/* Applies the saved design version and palette before first paint, and flags the opening splash. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" href="/fonts/fraunces-latin-full-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="flex min-h-dvh flex-col max-lg:pb-[calc(64px+env(safe-area-inset-bottom))]">
        <Splash />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-on-forest"
        >
          Skip to content
        </a>
        <ThemeSync />
        <DesignSync />
        <Design a={<SiteHeader />} b={<SigHeader />} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Design a={<SiteFooter />} b={<SigFooter />} />
        <Design a={<BottomNav />} b={<SigDock />} />
        <SearchDialog />
        <SigHashScroll />
      </body>
    </html>
  );
}
