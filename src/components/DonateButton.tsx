"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/**
 * A small standing link to the donation page.
 *
 * Deliberately quiet. Everything on this site is free with no account and no
 * paywall, and the way to keep that from feeling like a setup for an upsell is
 * for the ask to be small, honest and easy to ignore — a pill in the corner
 * that never covers the answer someone came for, never animates for attention,
 * and cannot be turned into a modal later without someone noticing.
 *
 * Three placement rules, each with a reason:
 *  - `z-40`, below the cookie banner's `z-50`. A consent banner must never be
 *    obscured by anything, least of all a request for money.
 *  - Hidden on `/donate` itself, where it would point at the page you are on.
 *  - Mounted only in the `(site)` layout, so it can never reach `/embed/`.
 *    A widget is a guest on someone else's page; asking their visitors for
 *    money would be the clearest possible abuse of that.
 */
export function DonateButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/donate")) return null;

  return (
    // An <aside> rather than a <div>: content outside every landmark is
    // unreachable by the "jump to region" navigation screen-reader users rely
    // on, and axe flags it. A sibling of <main> is the correct place for one —
    // the nested-aside-inside-main mistake fixed elsewhere on this site does
    // not apply here.
    <aside
      aria-label="Support this site"
      className="pointer-events-none fixed bottom-4 right-4 z-40 print:hidden"
    >
      <Link
        href="/donate"
        onClick={() =>
          track("donate_cta_click", {
            // The section, not the full path: enough to see where people are
            // when they click, without building a per-visitor trail.
            section: pathname?.split("/").filter(Boolean)[0] ?? "home",
          })
        }
        // The wrapper is click-through so the corner of the page stays usable;
        // only the pill itself takes pointer events. min-h-11/min-w-11 keeps the
        // icon-only state a 44×44 target on a phone, where the label is hidden
        // and the pill would otherwise collapse to something fiddly to hit.
        className="pointer-events-auto group flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm font-semibold shadow-lg transition hover:border-brand-500/60 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] sm:px-4"
        title="Everything here is free and staying that way. If it helped, a coffee is a lovely way to say so."
        aria-label="Support the site — everything here is free, buy me a coffee"
      >
        <CoffeeCup />
        {/* Text on wider screens only: on a phone the viewport is the scarce
            thing, and a bare cup still reads as "support". */}
        <span className="hidden sm:inline">Buy me a coffee</span>
      </Link>
    </aside>
  );
}

/**
 * Inline SVG rather than an emoji: ☕ renders as a different picture on every
 * platform and as a black-and-white glyph on some, so it cannot be relied on to
 * sit tidily next to text at this size.
 */
function CoffeeCup() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-brand-ink"
    >
      {/* Steam — two short strokes, so the cup reads as warm rather than empty. */}
      <path d="M8 2.5c-.6.8-.6 1.6 0 2.4M12 2.5c-.6.8-.6 1.6 0 2.4" opacity="0.7" />
      <path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" />
      <path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M3 21h15" />
    </svg>
  );
}
