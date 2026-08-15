"use client";

import { useState } from "react";

/**
 * Brand icon for a coin, loaded from /public/logos/coins/<slug>.png.
 * Falls back to a coloured ticker badge so a card is never blank if the file
 * is missing (e.g. a coin was just added to the registry without a logo).
 */
export function CoinLogo({
  slug,
  name,
  symbol,
  color,
  size = 28,
  className = "",
}: {
  slug: string;
  name: string;
  symbol: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ${className}`}
        style={{
          width: size,
          height: size,
          background: color,
          fontSize: Math.max(8, size * 0.32),
        }}
        aria-label={`${name} logo`}
      >
        {symbol.slice(0, 4)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/coins/${slug}.png`}
      alt={`${name} (${symbol}) logo`}
      width={size}
      height={size}
      loading="lazy"
      // Light plate behind the icon: several brand marks (XRP, Cardano) are
      // near-black and would disappear against the dark theme.
      className={`shrink-0 rounded-full bg-white/95 object-contain ${className}`}
      style={{ width: size, height: size, padding: Math.max(1, Math.round(size * 0.08)) }}
      onError={() => setFailed(true)}
    />
  );
}
