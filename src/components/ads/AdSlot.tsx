"use client";

/**
 * Manually-placed ad slots.
 *
 * Renders a real AdSense <ins> unit only when BOTH are true: ads are enabled
 * (NEXT_PUBLIC_ENABLE_ADS) and the slot was given a numeric `adUnitId` from the
 * AdSense dashboard. Without an id it stays a labelled placeholder — an <ins>
 * with no valid slot id logs errors and can count against the account.
 *
 * Note this is separate from Auto ads, which Google places itself via the
 * loader script in <head> (see AdSenseScript) and which needs nothing here.
 *
 * Consent-aware: nothing that could set an advertising cookie may render before
 * the visitor has answered the banner. Personalisation follows their answer via
 * Google Consent Mode (see ConsentModeScript) and the data-npa attribute below.
 */

import { useEffect, useRef, useState } from "react";
import { CONSENT_CHANGED_EVENT, readConsent, type Consent } from "@/lib/consent";
import { site } from "@/lib/site";
import { defaultHouseAd, houseAdFor, type HouseAd as HouseAdData } from "@/lib/house-ads";

const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

/** Current consent, kept in sync with the banner. `undefined` = not decided. */
function useConsent(): Consent | undefined {
  const [consent, setConsent] = useState<Consent | undefined>(undefined);

  useEffect(() => {
    setConsent(readConsent() ?? undefined);
    const onChange = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, []);

  return consent;
}

export function AdSlot({
  slot = "responsive",
  adUnitId,
  className = "",
}: {
  slot?: string;
  /** Numeric ad unit id from the AdSense dashboard, e.g. "1234567890". */
  adUnitId?: string;
  className?: string;
}) {
  const consent = useConsent();
  // Undecided (or SSR): show the neutral placeholder, never an ad request.
  const live = adsEnabled && consent !== undefined && Boolean(adUnitId) && Boolean(site.adsenseClient);
  const pushed = useRef(false);

  useEffect(() => {
    if (!live || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // A blocked or not-yet-loaded tag must never break the page.
    }
  }, [live]);

  if (live) {
    return (
      <div data-ad-slot={slot} data-npa={consent?.ads ? undefined : "1"} className={className}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={site.adsenseClient}
          data-ad-slot={adUnitId}
          data-ad-format="auto"
          data-full-width-responsive="true"
          {...(consent?.ads ? {} : { "data-npa-on-unfilled-ad": "true", "data-npa": "1" })}
        />
      </div>
    );
  }

  // AdSense not live for this slot: fill it with a cross-promo of a sister site
  // rather than an empty placeholder. Never sets a cookie, so no consent gate.
  return <HouseAd slot={slot} className={className} />;
}

/**
 * A cross-promo for one of our own sites. First render (and the static export)
 * shows the English default so hydration matches; after mount we swap in a
 * Russian ad for Russian-speaking visitors. See src/lib/house-ads.ts.
 */
function HouseAd({ slot, className = "" }: { slot: string; className?: string }) {
  const [ad, setAd] = useState<HouseAdData>(defaultHouseAd);

  useEffect(() => {
    // Client-only: navigator.language is unavailable during the static export,
    // and Math.random() here is safe because the first paint already committed.
    setAd(houseAdFor(navigator.language, Math.random()));
  }, []);

  return (
    <a
      href={ad.href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      data-ad-slot={slot}
      data-house-ad={ad.id}
      data-house-ad-placement={slot}
      className={`card card-hover flex min-h-[90px] flex-col justify-center gap-1 p-4 ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
        {ad.eyebrow}
      </span>
      <span className="text-sm font-semibold leading-snug">{ad.title}</span>
      <span className="muted text-xs leading-snug">{ad.description}</span>
      <span className="mt-0.5 text-xs font-semibold text-brand-ink">
        {ad.cta} <span aria-hidden="true">→</span>
      </span>
    </a>
  );
}

export function AffiliateBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Partner</div>
      <div className="mt-1 text-sm font-medium">Trade on a top crypto exchange</div>
      <p className="muted mt-1 text-xs">
        Affiliate banner placeholder — swap in your exchange referral (Binance, Bybit, etc.).
      </p>
    </div>
  );
}

export function SponsoredSlot({ className = "" }: { className?: string }) {
  return (
    <div className={`card border-dashed p-4 ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-wide muted">Sponsored tool</div>
      <p className="muted mt-1 text-xs">Highlight a sponsored tool here.</p>
    </div>
  );
}
