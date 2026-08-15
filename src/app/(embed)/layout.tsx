import type { Metadata, Viewport } from "next";
import "../globals.css";
import { EmbedThemeScript } from "@/components/embed/EmbedThemeScript";

/**
 * ============================================================================
 * Second root layout — the one embeddable widgets render inside.
 * ============================================================================
 * Next allows more than one root layout only when each lives in its own
 * top-level route group, which is why every normal page moved under `(site)`.
 * The alternative — hiding the chrome with CSS — would still have shipped the
 * header, ticker, footer, cookie banner and their JavaScript inside every
 * iframe on every embedding site.
 *
 * Deliberately absent, and each for a reason:
 *
 *  - Header, footer, price ticker: an iframe is a component on somebody else's
 *    page, not a visit to ours. Site navigation inside it is a trap.
 *  - Analytics and AdSense: we are a guest on a third party's page. Loading a
 *    tag there would make every embedding site a party to our data collection
 *    without their visitors ever seeing our cookie banner. Nothing is measured
 *    from inside a widget.
 *  - The cookie banner: nothing is set, so there is nothing to consent to.
 *
  * EmbedThemeScript stays: a widget must match the page it sits in, so the
 * embedder can force a theme with ?theme=light — see that file for why it
 * ignores localStorage.
 */

export const metadata: Metadata = {
  // Widgets duplicate the tool pages by design; only the canonical page should
  // ever be indexed. Also keeps the widget out of Search's own results, where
  // it would appear stripped of context.
  robots: { index: false, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16b378" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
  ],
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <EmbedThemeScript />
      </head>
      {/* No min-h-screen: the widget should be exactly as tall as its content,
          so the auto-resize message reports a useful number. */}
      <body className="font-sans">{children}</body>
    </html>
  );
}
