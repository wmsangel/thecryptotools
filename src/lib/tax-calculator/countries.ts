/**
 * ============================================================================
 * Country landing metadata for the per-country tax calculators.
 * ============================================================================
 * The tax MECHANICS live in @/lib/taxreport/jurisdictions (one verified record
 * per country). This file adds only what a landing page needs on top: a
 * URL slug, a one-line rule for the hub table, and a short distinctive intro.
 *
 * Only the 12 countries with calculator-grade rules in jurisdictions.ts get a
 * page — each is a genuinely different calculation, not a spun duplicate.
 */
import { jurisdictions, type Jurisdiction } from "@/lib/taxreport/jurisdictions";

/** The tax rules were verified against each country's guide through 2026. */
export const TAX_YEAR = "2026";

export interface CountryMeta {
  /** Matches a Jurisdiction.id. */
  id: string;
  /** URL slug: /crypto-tax-calculator/<slug>/ — the SEO-friendly country name. */
  slug: string;
  /** One line for the hub comparison table. */
  headline: string;
  /** Distinctive 1–2 sentence intro — the real, country-specific hook. */
  hook: string;
}

const META: CountryMeta[] = [
  {
    id: "us", slug: "united-states",
    headline: "Short-term = income rate; long-term 0/15/20%",
    hook: "In the US, how long you held decides everything. Sell within a year and the gain is taxed as ordinary income (up to 37%); hold more than a year and it drops to the 0%, 15% or 20% long-term rate.",
  },
  {
    id: "uk", slug: "united-kingdom",
    headline: "£3,000 allowance; 18% / 24%; Section 104 pooling",
    hook: "The UK gives you a £3,000 tax-free allowance each year, then charges 18% or 24% depending on your income band. Holding longer doesn't cut the rate — HMRC's Section 104 pooling decides your cost basis instead.",
  },
  {
    id: "de", slug: "germany",
    headline: "Tax-free after 1 year; €1,000 Freigrenze",
    hook: "Germany is the generous one: hold crypto more than a year and the gain is completely tax-free. Under a year, a €1,000 Freigrenze applies — but it's all-or-nothing, so one euro over and the whole gain becomes taxable.",
  },
  {
    id: "au", slug: "australia",
    headline: "50% CGT discount after 12 months",
    hook: "Hold longer than 12 months in Australia and a 50% CGT discount halves your taxable gain. The discounted gain is then added to your income and taxed at your marginal rate.",
  },
  {
    id: "ca", slug: "canada",
    headline: "50% inclusion rate; adjusted cost base",
    hook: "Canada taxes only half of each capital gain — the 50% inclusion rate — at your marginal rate, using the adjusted-cost-base (moving-average) method across all your coins of the same kind.",
  },
  {
    id: "ie", slug: "ireland",
    headline: "Flat 33% above a €1,270 exemption",
    hook: "Ireland charges a flat 33% CGT on gains above a €1,270 annual exemption, with no distinction between short and long-term holding.",
  },
  {
    id: "za", slug: "south-africa",
    headline: "40% of the gain taxed; ~18% max effective",
    hook: "In South Africa, 40% of your net gain (after a R50,000 annual exclusion) is added to your income — a maximum effective rate of about 18% on investment crypto held as capital.",
  },
  {
    id: "pt", slug: "portugal",
    headline: "Exempt after 365 days; swaps untaxed",
    hook: "Portugal exempts crypto held 365 days or more, and crypto-to-crypto swaps aren't taxed at all — a swap even carries your original acquisition date through. Under a year, gains are taxed at a flat 28%.",
  },
  {
    id: "pl", slug: "poland",
    headline: "Flat 19%; annual pool; swaps outside the system",
    hook: "Poland taxes virtual-currency income at a flat 19% on your fiat-exit revenue minus documented costs, pooled annually — and crypto-to-crypto swaps sit outside the system entirely.",
  },
  {
    id: "nz", slug: "new-zealand",
    headline: "No CGT — taxed as income at your rate",
    hook: "New Zealand has no capital gains tax: crypto profit is ordinary income taxed at your marginal rate (10.5%–39%), and a genuine loss is generally deductible against your other income.",
  },
  {
    id: "es", slug: "spain",
    headline: "Savings scale: 19% to 28%",
    hook: "Spain taxes crypto gains on its savings-income scale — 19% up to €6,000, then 21%, 23% and 27% in bands, reaching 28% above €300,000.",
  },
  {
    id: "in", slug: "india",
    headline: "Flat 30%; no loss offset; 1% TDS",
    hook: "India applies a flat 30% to every crypto gain under Section 115BBH, regardless of holding period or income — and losses can't offset anything. A 1% TDS is also withheld on each transfer.",
  },
];

const metaById = new Map(META.map((m) => [m.id, m]));
const metaBySlug = new Map(META.map((m) => [m.slug, m]));
const jurById = new Map(jurisdictions.map((j) => [j.id, j]));

export interface CountryCalculator {
  meta: CountryMeta;
  jurisdiction: Jurisdiction;
}

/** Every country that gets a landing page, in the display order above. */
export const countryCalculators: CountryCalculator[] = META.map((meta) => ({
  meta,
  jurisdiction: jurById.get(meta.id)!,
}));

export function getCountryCalculator(slug: string): CountryCalculator | undefined {
  const meta = metaBySlug.get(slug);
  if (!meta) return undefined;
  const jurisdiction = jurById.get(meta.id);
  return jurisdiction ? { meta, jurisdiction } : undefined;
}

export function countrySlug(id: string): string | undefined {
  return metaById.get(id)?.slug;
}
