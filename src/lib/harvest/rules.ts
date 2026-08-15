/**
 * ============================================================================
 * Repurchase rules — the part of tax-loss harvesting that decides whether the
 * loss you just realised actually counts.
 * ============================================================================
 * Selling at a loss is arithmetic. Whether the loss survives depends on what
 * your country does if you buy the asset back, and that answer differs far
 * more than the headline rates do: a fixed day-count window in some places, an
 * intent test with no window at all in others, and in one case a rule that has
 * simply never been extended to crypto.
 *
 * EVERY entry here was verified against the tax authority's own material on
 * 2026-08-11, and each carries the source it came from so a reader can check
 * it. Two rules deliberately record an ABSENCE — that we looked and did not
 * find a crypto-specific rule — because "we could not establish one" is a
 * different and more honest statement than "there is none".
 *
 * If you revise a figure here, re-verify it. Do not trust model memory, and do
 * not copy a competitor: several commercial tax packages assert a four-week
 * rule for Irish crypto that Revenue's own manual does not support.
 */

export interface RuleSource {
  label: string;
  publisher: string;
  url: string;
}

/** What happens to a loss caught by the rule. */
export type LossOutcome =
  /** Gone for good in the year — the classic denial. */
  | "denied"
  /** Disallowed now, but added to the basis of the repurchase, so it resurfaces later. */
  | "deferred";

export type RepurchaseRule =
  | {
      kind: "window";
      /** Days before the disposal that an acquisition can poison it. */
      daysBefore: number;
      /** Days after. */
      daysAfter: number;
      outcome: LossOutcome;
      summary: string;
      detail: string;
      sources: RuleSource[];
    }
  | {
      /** No day count: the rule turns on why you did it (Australia). */
      kind: "intent";
      outcome: LossOutcome;
      summary: string;
      detail: string;
      sources: RuleSource[];
    }
  | {
      /** A statute exists but has not been extended to crypto-assets. */
      kind: "unsettled";
      summary: string;
      detail: string;
      sources: RuleSource[];
    }
  | {
      /** Checked, and no crypto-specific repurchase restriction was found. */
      kind: "none-identified";
      summary: string;
      detail: string;
      sources: RuleSource[];
    }
  | {
      /** Harvesting does not apply as a concept here at all. */
      kind: "not-applicable";
      summary: string;
      detail: string;
      sources: RuleSource[];
    };

/**
 * Keyed by the jurisdiction ids in `src/lib/taxreport/jurisdictions.ts`.
 * Every id there must appear here — `ruleFor` throws otherwise, so adding a
 * country to the tax report cannot silently ship a harvesting page with no
 * repurchase guidance.
 */
export const repurchaseRules: Record<string, RepurchaseRule> = {
  us: {
    kind: "none-identified",
    summary: "Sell and rebuy immediately — the wash-sale rule does not reach crypto",
    detail:
      "The wash-sale rule in IRC §1091 applies to “stock or securities”. The IRS treats digital assets as property rather than securities, so as the law stands in 2026 you can sell a coin at a loss, rebuy it the same day and still claim the loss. Two caveats that matter: Congress has repeatedly proposed extending the rule to digital assets, so this is a rule that could change with a single bill; and a crypto ETF or a crypto-exposed stock IS a security, so buying one of those back inside 30 days is caught in the ordinary way.",
    sources: [
      { label: "Digital assets", publisher: "IRS", url: "https://www.irs.gov/filing/digital-assets" },
      { label: "Notice 2014-21 — virtual currency treated as property", publisher: "IRS", url: "https://www.irs.gov/pub/irs-drop/n-14-21.pdf" },
    ],
  },

  uk: {
    kind: "window",
    daysBefore: 0,
    daysAfter: 30,
    outcome: "deferred",
    summary: "Same-day and 30-day matching — rebuying inside 30 days re-prices the sale",
    detail:
      "HMRC pools each token type under TCGA92/S104, but a disposal is matched first against acquisitions made the SAME day, then against acquisitions in the following 30 days, and only then against the pool. Buying back inside that window does not so much deny the loss as delete it: the sale is matched to the repurchase instead of the pool, so there is little or no gain or loss to report. This is the “bed and breakfasting” rule, and the report on this page already applies the matching order.",
    sources: [
      { label: "CRYPTO22200 — pooling", publisher: "HMRC", url: "https://www.gov.uk/hmrc-internal-manuals/cryptoassets-manual/crypto22200" },
      { label: "CRYPTO22250 — same-day and 30-day matching examples", publisher: "HMRC", url: "https://www.gov.uk/hmrc-internal-manuals/cryptoassets-manual/crypto22250" },
    ],
  },

  de: {
    kind: "none-identified",
    summary: "No repurchase window — but the one-year clock decides everything",
    detail:
      "Germany has no bed-and-breakfast rule for private sales under §23 EStG, so a same-day repurchase does not by itself cost you the loss. The rule that actually governs harvesting here is the one-year holding period, and it cuts both ways: hold longer than a year and the gain is tax-free, but the LOSS on that same position stops being deductible too. A position more than a year old is outside §23 entirely, in both directions.",
    sources: [
      { label: "BMF-Schreiben 6 March 2025 — Einzelfragen zur ertragsteuerrechtlichen Behandlung bestimmter Kryptowerte", publisher: "Bundesministerium der Finanzen", url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2025-03-06-einzelfragen-kryptowerte.html" },
      { label: "§ 23 EStG — private Veräußerungsgeschäfte", publisher: "Gesetze im Internet", url: "https://www.gesetze-im-internet.de/estg/__23.html" },
    ],
  },

  au: {
    kind: "intent",
    outcome: "denied",
    summary: "No fixed window — the ATO denies wash sales on intent, and watches exchange data",
    detail:
      "Australia has no day-count rule to work around. Instead the ATO treats a sale-and-repurchase entered into to manufacture a loss as a wash sale, and cancels the capital loss under the general anti-avoidance provisions. It has said publicly that it identifies these through data matching with crypto exchanges and share registries, and that penalties and interest follow. Because the test is purpose rather than timing, waiting 31 days is not the safe harbour it is elsewhere — and a genuine change of position is not caught even if it happens quickly.",
    sources: [
      { label: "Wash sales: the ATO is cleaning up dirty laundry", publisher: "Australian Taxation Office", url: "https://www.ato.gov.au/media-centre/wash-sales-the-ato-is-cleaning-up-dirty-laundry" },
      { label: "TA 2008/7 — Taxpayer Alert on wash sale arrangements", publisher: "Australian Taxation Office", url: "https://www.ato.gov.au/law/view/view.htm?docid=TPA%2FTA20087%2FNAT%2FATO%2F00001" },
    ],
  },

  ca: {
    kind: "window",
    daysBefore: 30,
    daysAfter: 30,
    outcome: "deferred",
    summary: "Superficial loss: 30 days before AND after, and your spouse counts",
    detail:
      "Calling this “the 30-day rule” describes half of it. The window opens 30 calendar days BEFORE the sale and closes 30 calendar days after, so an acquisition you made a month before selling can spoil the loss on its own. It also applies to affiliated persons — most commonly a spouse or common-law partner, or a corporation you control — and you must still hold the substituted property at the end of the window. The loss is not destroyed: it is added to the adjusted cost base of what you bought back, so it comes out when you finally sell without repurchasing.",
    sources: [
      { label: "Capital losses and deductions — superficial loss", publisher: "Canada Revenue Agency", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains/capital-losses-deductions.html" },
      { label: "Guide for cryptocurrency users and tax professionals", publisher: "Canada Revenue Agency", url: "https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/compliance/cryptocurrency-guide.html" },
    ],
  },

  ie: {
    kind: "unsettled",
    summary: "The four-week rule is written for shares — Revenue has not extended it to crypto",
    detail:
      "Section 581 TCA 1997 sets aside the normal matching order where shares or securities of the same class are sold and reacquired within four weeks, specifically to stop manufactured losses. It is drafted for “shares or securities”, and Revenue's own Tax and Duty Manual on crypto-assets — Part 02-01-03, last reviewed January 2026 — neither mentions section 581 nor extends it to crypto-assets; it states that no special tax rules for crypto-asset transactions are required and that each disposal is computed on a disposal-by-disposal basis. Several commercial tax packages apply a four-week rule to Irish crypto anyway. We are not going to tell you it definitely applies or definitely does not: treat it as unsettled and get advice before relying on a quick repurchase.",
    sources: [
      { label: "Part 02-01-03 — Taxation of Crypto-Asset Transactions (reviewed January 2026)", publisher: "Revenue", url: "https://www.revenue.ie/en/tax-professionals/tdm/income-tax-capital-gains-tax-corporation-tax/part-02/02-01-03.pdf" },
      { label: "Crypto-assets", publisher: "Revenue", url: "https://www.revenue.ie/en/companies-and-charities/financial-services/crypto-assets/index.aspx" },
    ],
  },

  es: {
    kind: "window",
    daysBefore: 60,
    daysAfter: 60,
    outcome: "deferred",
    summary: "Two months either side — the DGT treats coins of one type as homogeneous assets",
    detail:
      "Article 33.5 of the IRPF law blocks a loss where you reacquire “valores homogéneos” within two months (for assets admitted to trading). The Dirección General de Tributos has ruled that units of the same cryptocurrency are homogeneous with one another, which pulls crypto into that rule. The loss is deferred rather than lost: it attaches to the cost of the coins you bought back and surfaces when you eventually sell them without repurchasing. Two months is a materially longer window than the 30 days most people assume from reading about the US or Canada.",
    sources: [
      { label: "Ley 35/2006 del IRPF — artículo 33.5", publisher: "Boletín Oficial del Estado", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764" },
      { label: "Moneda virtual — información fiscal", publisher: "Agencia Tributaria", url: "https://sede.agenciatributaria.gob.es/Sede/procedimientoini/GI44.shtml" },
    ],
  },

  pt: {
    kind: "none-identified",
    summary: "No repurchase window found — but the 365-day exemption disables the loss",
    detail:
      "We did not find a crypto-specific repurchase restriction in the IRS code for category G capital gains. The rule that decides harvesting in Portugal is the holding period: gains on crypto held 365 days or more are exempt, and a position outside the charge cannot produce a deductible loss either. So a losing position becomes worthless for harvesting the day it turns one year old — which is the exact opposite of the “just hold longer” advice that works for gains.",
    sources: [
      { label: "Código do IRS — mais-valias (categoria G)", publisher: "Autoridade Tributária e Aduaneira", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs10.aspx" },
    ],
  },

  pl: {
    kind: "not-applicable",
    summary: "Nothing to harvest before year end — Poland deducts costs when you buy, not when you sell",
    detail:
      "Poland does not match lots at all. Crypto is taxed on PIT-38 as annual revenue less annual costs, and acquisition costs are recognised in the year you incur them whether or not you sold anything. Unused costs carry forward indefinitely. That removes the deadline that makes harvesting urgent everywhere else: selling a losing coin in December rather than January does not change your deductible costs, because the cost was already deducted the year you bought it.",
    sources: [
      { label: "PIT — podatek dochodowy od osób fizycznych", publisher: "Ministerstwo Finansów", url: "https://www.podatki.gov.pl/pit/" },
    ],
  },

  za: {
    kind: "none-identified",
    summary: "No crypto-specific repurchase rule found — general anti-avoidance still applies",
    detail:
      "We did not find a wash-sale or superficial-loss provision in the Eighth Schedule aimed at crypto-assets. That is not a green light: SARS applies ordinary income-tax principles to crypto, capital losses can be ring-fenced or disallowed under existing anti-avoidance provisions, and a disposal to a connected person is treated as taking place at market value. Note also that a “sale” with no real change in your position may not be accepted as a disposal at all.",
    sources: [
      { label: "Crypto assets & tax", publisher: "South African Revenue Service", url: "https://www.sars.gov.za/individuals/crypto-assets-and-tax/" },
    ],
  },

  nz: {
    kind: "not-applicable",
    summary: "No capital gains tax — losses only exist if your crypto activity was taxable in the first place",
    detail:
      "New Zealand has no general CGT. Crypto profit is ordinary income for people who acquired it to sell, and for them a loss is an ordinary deduction rather than a capital loss to be banked against gains. There is no annual capital-loss pool to top up before year end, so the harvesting question here is really “is my crypto activity taxable at all”, which is answered by intent at the time of acquisition, not by timing a sale.",
    sources: [
      { label: "Cryptoassets", publisher: "Inland Revenue", url: "https://www.ird.govt.nz/cryptoassets" },
    ],
  },

  in: {
    kind: "not-applicable",
    summary: "Harvesting saves nothing — India does not let crypto losses offset anything",
    detail:
      "Under section 115BBH each crypto gain is taxed at a flat 30% on its own, and losses from virtual digital assets cannot be set off against any income, not even against gains on other crypto, and cannot be carried forward. Selling a losing position therefore reduces your tax bill by exactly zero. It also triggers 1% TDS on the transfer. This is the one jurisdiction on the list where the honest answer is: do not do this for tax reasons.",
    sources: [
      { label: "Section 115BBH — virtual digital assets", publisher: "Income Tax Department, India", url: "https://www.incometaxindia.gov.in/w/section-115bbh" },
    ],
  },
};

export function ruleFor(jurisdictionId: string): RepurchaseRule {
  const rule = repurchaseRules[jurisdictionId];
  if (!rule) {
    throw new Error(
      `No repurchase rule defined for jurisdiction "${jurisdictionId}". Add one to src/lib/harvest/rules.ts — a harvesting page without it would tell people to sell with no idea whether the loss survives.`,
    );
  }
  return rule;
}

/** Plain-English window, e.g. "30 days before and after the sale". */
export function windowLabel(rule: RepurchaseRule): string | null {
  if (rule.kind !== "window") return null;
  if (rule.daysBefore === 0) return `the same day and the ${rule.daysAfter} days after the sale`;
  if (rule.daysBefore === rule.daysAfter) return `${rule.daysBefore} days before and ${rule.daysAfter} days after the sale`;
  return `${rule.daysBefore} days before and ${rule.daysAfter} days after the sale`;
}
