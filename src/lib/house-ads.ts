/**
 * House ads — cross-promotion of our own sister sites.
 *
 * These fill the ad slots while AdSense is not live (no numeric adUnitId set,
 * see AdSlot.tsx). The moment a slot is given a real AdSense unit, that slot
 * shows the paid ad instead and these never render — nothing here needs undoing
 * when AdSense goes on.
 *
 * LANGUAGE TARGETING (deliberate): TheCryptoTools' audience is English-speaking,
 * so the English calculator site (CalcLumen — same "free tools, no signup"
 * spirit) is the only relevant promo for most visitors and is what the server
 * renders. The two Russian-language sites are shown ONLY to visitors whose
 * browser language is Russian — surfacing an irrelevant Russian site to an
 * English reader reads as spam and costs trust. The swap happens after mount
 * (navigator.language is not available during the static export / first render),
 * using the same two-pass pattern the calendar and portfolio pages use to stay
 * hydration-safe: first paint = the default English ad, then the client swaps in
 * a Russian one if warranted.
 *
 * Links are marked rel="sponsored nofollow" like our affiliate links: these are
 * promotional, and thousands of identical sitewide links to owned domains would
 * otherwise look like a link scheme and could hurt all four sites.
 */

export type HouseAdLang = "en" | "ru";

export interface HouseAd {
  /** Stable id, also sent to GA via data-house-ad for click attribution. */
  id: string;
  href: string;
  lang: HouseAdLang;
  /** Small accent label above the title. */
  eyebrow: string;
  title: string;
  description: string;
  /** Call-to-action text; a "→" is appended by the component. */
  cta: string;
}

export const houseAds: HouseAd[] = [
  {
    id: "calclumen",
    href: "https://calclumen.com/en",
    lang: "en",
    eyebrow: "Free calculators",
    title: "48 free calculators — no signup",
    description: "Finance, health, conversions and everyday math. Instant answers, nothing to install.",
    cta: "Open CalcLumen",
  },
  {
    id: "costtrek",
    href: "https://costtrek.com/",
    lang: "en",
    eyebrow: "Cost of living",
    title: "Will your salary go further abroad?",
    description: "Compare cost of living, taxes and quality of life across 49 cities before you move.",
    cta: "Open CostTrek",
  },
  {
    id: "iznkit",
    href: "https://iznkit.com/",
    lang: "en",
    eyebrow: "Free PDF tools",
    title: "Invoices & docs → a clean PDF, free",
    description: "21+ generators and calculators: invoices, quotes, freelance tax, QR codes. No signup.",
    cta: "Open iznKit",
  },
  {
    id: "izngames",
    href: "https://izngames.com/",
    lang: "en",
    eyebrow: "Free games",
    title: "Free browser games — no install",
    description: "Quick, casual games you can play right in the browser. Nothing to download.",
    cta: "Open iznGames",
  },
  {
    id: "prodom-expert",
    href: "https://prodom-expert.ru/",
    lang: "ru",
    eyebrow: "Ремонт и стройка",
    title: "Ремонт по нормам, а не на глаз",
    description: "Статьи и 21 калькулятор: проверьте работу подрядчика в цифрах и допусках.",
    cta: "Открыть ДомЭксперт",
  },
  {
    id: "24zdorovie",
    href: "https://24zdorovie.com/ru/",
    lang: "ru",
    eyebrow: "Здоровье",
    title: "Здоровье по доказательной медицине",
    description: "Питание, сон и тренировки: понятные разборы, рецепты и калькуляторы здоровья.",
    cta: "Открыть 24Здоровье",
  },
];

export const englishHouseAds: HouseAd[] = houseAds.filter((a) => a.lang === "en");
export const russianHouseAds: HouseAd[] = houseAds.filter((a) => a.lang === "ru");

/**
 * Shown on the server and on every first paint, before we know the visitor's
 * language. Must be ONE stable ad so the static HTML and hydration match — the
 * client swaps in a rotated/localised one after mount. CalcLumen is the closest
 * fit to a crypto-calculator audience, so it is the safe default.
 */
export const defaultHouseAd: HouseAd = houseAds.find((a) => a.id === "calclumen")!;

/**
 * Pick the house ad to show for a browser language. Russian visitors rotate
 * through the Russian sites; everyone else rotates through the English ones.
 * `pick` is a number in [0, 1) supplied by the caller (one Math.random per slot,
 * after mount), so variety across slots lives in the component and this module
 * stays pure and safe to import on the server.
 */
export function houseAdFor(language: string | undefined, pick: number): HouseAd {
  const pool =
    language && language.toLowerCase().startsWith("ru") && russianHouseAds.length > 0
      ? russianHouseAds
      : englishHouseAds;
  if (pool.length === 0) return defaultHouseAd;
  const i = Math.min(pool.length - 1, Math.floor(pick * pool.length));
  return pool[i];
}
