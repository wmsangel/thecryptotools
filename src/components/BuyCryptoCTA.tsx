"use client";

import { useEffect, useState } from "react";
import { platforms, type Platform } from "@/lib/platforms";
import { exchangesForCountry, platformLink } from "@/lib/affiliate";

/**
 * "Got a fake wallet? Here's the real thing" — a low-pressure, disclosed partner
 * block for /tools/fake-wallet-generator (the network's most-clicked page). It
 * is geo-aware: Binance and most of our venues block US residents, and our
 * Crypto.com offer excludes the US, so a US visitor is shown Kraken (which
 * serves the US and pays us) instead of a dead Binance link. Country comes from
 * Cloudflare's /cdn-cgi/trace at runtime; if that can't be read (e.g. local
 * dev), it falls back to the default non-US picks. Only real referral links are
 * rendered (platformLink), each rel="sponsored".
 */
function useCountry(): string | null {
  const [country, setCountry] = useState<string | null>(null);
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("cf-geo");
      if (cached) { setCountry(cached); return; }
    } catch { /* private mode */ }
    let alive = true;
    fetch("/cdn-cgi/trace")
      .then((r) => r.text())
      .then((t) => {
        const m = t.match(/^loc=([A-Z]{2})$/m);
        const c = m ? m[1] : null;
        if (!alive) return;
        setCountry(c);
        try { if (c) sessionStorage.setItem("cf-geo", c); } catch { /* ignore */ }
      })
      .catch(() => { /* not on Cloudflare — keep default */ });
    return () => { alive = false; };
  }, []);
  return country;
}

function Offer({ p, placement, sub }: { p: Platform; placement: string; sub: string }) {
  const link = platformLink(p);
  if (!link.sponsored) return null; // only disclosed partners
  return (
    <a
      href={link.href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      data-affiliate={p.slug}
      data-affiliate-placement={placement}
      className="card card-hover flex items-center gap-3 p-4"
    >
      <span className="text-2xl" aria-hidden>{p.icon}</span>
      <span className="min-w-0">
        <span className="block font-semibold">{p.name} <span className="text-brand-ink">→</span></span>
        <span className="muted block text-sm leading-snug">{sub}</span>
      </span>
    </a>
  );
}

export function BuyCryptoCTA() {
  const country = useCountry();
  const exchanges = exchangesForCountry(country, 2);
  const wallets = ["trezor", "ledger"]
    .map((s) => platforms.find((p) => p.slug === s))
    .filter((p): p is Platform => !!p);

  return (
    <section className="mt-12 rounded-2xl border border-[var(--border)] p-6 sm:p-7">
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Partner picks</div>
      <h2 className="mt-1 text-xl font-bold">Got a fake wallet? Here&apos;s the real thing</h2>
      <p className="muted mt-1 text-sm leading-relaxed">
        A generated wallet is for testing and screenshots only — never put real funds in it. When you&apos;re
        ready for the real thing, no pressure:
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-semibold">Buy crypto on a trusted exchange</div>
          <div className="grid gap-2">
            {exchanges.map((p) => (
              <Offer key={p.slug} p={p} placement="fake-wallet-buy" sub={p.tagline} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-semibold">Store it in a hardware wallet</div>
          <div className="grid gap-2">
            {wallets.map((p) => (
              <Offer key={p.slug} p={p} placement="fake-wallet-hw" sub={p.tagline} />
            ))}
          </div>
        </div>
      </div>

      <p className="muted mt-4 text-xs leading-relaxed">
        Partner links — we may earn a commission at no extra cost to you. We only list platforms we&apos;d use
        ourselves; shown to match where you can actually sign up.
      </p>
    </section>
  );
}
