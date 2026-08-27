import type { Metadata, Viewport } from "next";
import "../globals.css";
import { buildBaseMetadata, websiteJsonLd } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import { ThemeScript } from "@/components/ThemeScript";
import { ConsentModeScript } from "@/components/ConsentModeScript";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieConsent } from "@/components/CookieConsent";
import { DonateButton } from "@/components/DonateButton";
import { OutboundTracker } from "@/components/analytics/OutboundTracker";
import { ServiceWorker } from "@/components/ServiceWorker";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildBaseMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16b378" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <ConsentModeScript />
        {/* Must come after ConsentModeScript — consent defaults first, tags second. */}
        <GoogleAnalytics />
        <AdSenseScript />
        <JsonLd data={websiteJsonLd()} />
      </head>
      <body className="min-h-screen font-sans">
        {/* First tab stop on every page: the header alone is ~15 links, and a
            keyboard or screen-reader user should not walk them to reach the
            calculator they came for. */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <PriceTicker />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <DonateButton />
        <CookieConsent />
        <OutboundTracker />
        <ServiceWorker />
      </body>
    </html>
  );
}
