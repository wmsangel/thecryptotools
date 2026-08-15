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

/** Shown on the server and to every non-Russian visitor. */
export const defaultHouseAd: HouseAd = houseAds.find((a) => a.id === "calclumen")!;

/** The pool a Russian-speaking visitor rotates through, after mount. */
export const russianHouseAds: HouseAd[] = houseAds.filter((a) => a.lang === "ru");

/**
 * Pick the house ad to show for a browser language. Deterministic default; a
 * Russian visitor gets one of the Russian ads chosen by `pick` in [0, 1) so the
 * caller controls variety across slots without this module importing randomness.
 */
export function houseAdFor(language: string | undefined, pick: number): HouseAd {
  if (language && language.toLowerCase().startsWith("ru") && russianHouseAds.length > 0) {
    const i = Math.min(russianHouseAds.length - 1, Math.floor(pick * russianHouseAds.length));
    return russianHouseAds[i];
  }
  return defaultHouseAd;
}
