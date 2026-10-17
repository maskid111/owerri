import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Owerri — Explore · Dine · Experience",
    template: "%s · Owerri",
  },
  description:
    "Discover restaurants, local dishes, events, hotels and cultural experiences in Owerri, Imo State — and order from local kitchens.",
  keywords: ["Owerri", "Imo State", "restaurants", "Nigerian food", "Ofe Owerri", "events", "hotels", "culture"],
};

export const viewport: Viewport = {
  themeColor: "#0f3d2a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preload" href="/fonts/fraunces-latin-full-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="flex min-h-dvh flex-col max-lg:pb-[calc(64px+env(safe-area-inset-bottom))]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BottomNav />
      </body>
    </html>
  );
}
