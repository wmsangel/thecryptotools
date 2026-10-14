/**
 * ============================================================================
 * Amazon Associates picks — native physical-product recommendations.
 * ============================================================================
 * Tag: thecryptotools-20. These are the few categories where Amazon genuinely
 * ADDS something we can't link better elsewhere: crypto books and key-safety
 * gear (metal seed backups, 2FA keys, Faraday bags) have no brand affiliate of
 * their own. Hardware wallets are DELIBERATELY not here — Ledger/Trezor pay more
 * through their own programs (see platforms.ts), so those stay on direct links.
 *
 * Policy-safe by construction:
 *   • No prices and no images in the source — Amazon forbids manually stated
 *     prices, and product images need the PA-API, which unlocks after the first
 *     three sales. Links are text only for now.
 *   • Links are tracked SEARCH links (title + author), not guessed `/dp/<ASIN>/`
 *     URLs — we never fabricate an ASIN. The `tag` still attributes the sale.
 *   • Every render carries the required "As an Amazon Associate…" disclosure
 *     (see AmazonPicks.tsx) and rel="sponsored nofollow".
 */

export type AmazonTopic = "books" | "security";

export interface AmazonPick {
  /** Product/title as shown. */
  title: string;
  /** Author, or a short "what it is" for gear. */
  by: string;
  /** One honest line on why it is here. */
  blurb: string;
  /** Amazon search query (title + author / exact product) — tracked, no ASIN guess. */
  q: string;
}

const TAG = "thecryptotools-20";

/** A tracked Amazon US search link for a query. */
export function amazonUrl(q: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${TAG}`;
}

export const AMAZON_PICKS: Record<AmazonTopic, { heading: string; items: AmazonPick[] }> = {
  books: {
    heading: "Recommended crypto books",
    items: [
      { title: "The Bitcoin Standard", by: "Saifedean Ammous", blurb: "The economic case for Bitcoin as sound money.", q: "The Bitcoin Standard Saifedean Ammous" },
      { title: "Mastering Bitcoin", by: "Andreas M. Antonopoulos", blurb: "The technical deep dive — how Bitcoin actually works.", q: "Mastering Bitcoin Andreas Antonopoulos" },
      { title: "The Internet of Money", by: "Andreas M. Antonopoulos", blurb: "Why crypto matters, in plain language — a great first read.", q: "The Internet of Money Antonopoulos" },
      { title: "Digital Gold", by: "Nathaniel Popper", blurb: "The story of Bitcoin's early years and the people behind it.", q: "Digital Gold Nathaniel Popper" },
      { title: "Mastering Ethereum", by: "Antonopoulos & Wood", blurb: "Smart contracts and the EVM, for builders and the curious.", q: "Mastering Ethereum Antonopoulos Wood" },
    ],
  },
  security: {
    heading: "Gear to keep your keys safe",
    items: [
      { title: "Steel seed-phrase backup", by: "Cryptosteel / Billfodl", blurb: "Stamp your recovery phrase into metal — it survives fire and water; paper does not.", q: "cryptosteel capsule seed phrase steel backup" },
      { title: "YubiKey 5 security key", by: "Hardware 2FA", blurb: "A phishing-proof second factor for your exchange and email logins.", q: "YubiKey 5 NFC security key" },
      { title: "Faraday bag", by: "Signal-blocking pouch", blurb: "Blocks all wireless signals — an extra layer for a hardware wallet or phone.", q: "Mission Darkness Faraday bag" },
    ],
  },
};
