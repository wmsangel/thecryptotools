import { categoryList, type Category, type CategoryId } from "@/lib/categories";
import type { ToolConfig } from "./types";
import { isComputable } from "./types";
import { generatedTools } from "./generated";

// --- Built-in tools ---------------------------------------------------------
// Adding a tool = create a config file + add ONE import line here.
// (An explicit list keeps everything type-checked and statically analyzable for
//  tree-shaking + SSG, which a dynamic glob would not.)
import profitCalculator from "./configs/profit-calculator";
import dcaCalculator from "./configs/dca-calculator";
import positionSizeCalculator from "./configs/position-size-calculator";
import riskRewardCalculator from "./configs/risk-reward-calculator";
import breakEvenCalculator from "./configs/break-even-calculator";
import gridCalculator from "./configs/grid-calculator";
import apyCalculator from "./configs/apy-calculator";
import roiCalculator from "./configs/roi-calculator";
import liquidationCalculator from "./configs/liquidation-calculator";
import averageEntryCalculator from "./configs/average-entry-calculator";
import base64Encoder from "./configs/base64-encoder";
import timestampConverter from "./configs/timestamp-converter";
import fakeWalletGenerator from "./configs/fake-wallet-generator";
import fakePortfolioGenerator from "./configs/fake-portfolio-generator";
import randomDataGenerator from "./configs/random-data-generator";
import jsonGenerator from "./configs/json-generator";
import satoshiConverter from "./configs/satoshi-converter";
import impermanentLossCalculator from "./configs/impermanent-loss-calculator";
import fundingRateCalculator from "./configs/funding-rate-calculator";
import ethUnitConverter from "./configs/eth-unit-converter";
import gasFeeCalculator from "./configs/gas-fee-calculator";
import cryptoPriceConverter from "./configs/crypto-price-converter";
import leverageCalculator from "./configs/leverage-calculator";
import futuresPnlCalculator from "./configs/futures-pnl-calculator";
import stopLossTakeProfitCalculator from "./configs/stop-loss-take-profit-calculator";
import marketCapPriceCalculator from "./configs/market-cap-price-calculator";
import stakingRewardsCalculator from "./configs/staking-rewards-calculator";
import compoundInterestCalculator from "./configs/compound-interest-calculator";
import cryptoTaxCalculator from "./configs/crypto-tax-calculator";
import targetPriceCalculator from "./configs/target-price-calculator";
import halvingCountdown from "./configs/halving-countdown";
import miningProfitabilityCalculator from "./configs/mining-profitability-calculator";
import portfolioRebalanceCalculator from "./configs/portfolio-rebalance-calculator";
import dcaVsLumpSumCalculator from "./configs/dca-vs-lumpsum-calculator";
import percentageCalculator from "./configs/percentage-calculator";
import hexDecimalConverter from "./configs/hex-decimal-converter";
import ruleOf72Calculator from "./configs/rule-of-72-calculator";
import cryptoAirdropCalculator from "./configs/crypto-airdrop-calculator";
import yieldFarmingApyCalculator from "./configs/yield-farming-apy-calculator";
import kellyCriterionCalculator from "./configs/kelly-criterion-calculator";
import sharpeRatioCalculator from "./configs/sharpe-ratio-calculator";
import maxDrawdownCalculator from "./configs/max-drawdown-calculator";
import optionsPayoffCalculator from "./configs/options-payoff-calculator";
import cryptoLoanLtvCalculator from "./configs/crypto-loan-ltv-calculator";
import blackScholesCalculator from "./configs/black-scholes-calculator";
import monteCarloPortfolioCalculator from "./configs/monte-carlo-portfolio-calculator";
import riskOfRuinCalculator from "./configs/risk-of-ruin-calculator";
import tradeExpectancyCalculator from "./configs/trade-expectancy-calculator";
import portfolioVolatilityCalculator from "./configs/portfolio-volatility-calculator";
import sortinoRatioCalculator from "./configs/sortino-ratio-calculator";
import valueAtRiskCalculator from "./configs/value-at-risk-calculator";
import cagrCalculator from "./configs/cagr-calculator";
import lossRecoveryCalculator from "./configs/loss-recovery-calculator";
import cryptoArbitrageCalculator from "./configs/crypto-arbitrage-calculator";
import tradingFeeCalculator from "./configs/trading-fee-calculator";
import hashrateConverter from "./configs/hashrate-converter";
import tokenVestingDilutionCalculator from "./configs/token-vesting-dilution-calculator";
import cryptoSavingsGoalCalculator from "./configs/crypto-savings-goal-calculator";
import marketCapCalculator from "./configs/market-cap-calculator";
import winRateCalculator from "./configs/win-rate-calculator";
import tokenomicsCalculator from "./configs/tokenomics-calculator";
import dcaBotCalculator from "./configs/dca-bot-calculator";
import taxLossHarvestingCalculator from "./configs/tax-loss-harvesting-calculator";
import takeProfitLadderCalculator from "./configs/take-profit-ladder-calculator";
import cryptoWithdrawalCalculator from "./configs/crypto-withdrawal-calculator";
import marginCalculator from "./configs/margin-calculator";
import tokenBurnCalculator from "./configs/token-burn-calculator";
import cryptoLendingCalculator from "./configs/crypto-lending-calculator";
import cryptoMortgageCalculator from "./configs/crypto-mortgage-calculator";

const builtinTools: ToolConfig[] = [
  profitCalculator,
  dcaCalculator,
  positionSizeCalculator,
  riskRewardCalculator,
  breakEvenCalculator,
  gridCalculator,
  apyCalculator,
  roiCalculator,
  liquidationCalculator,
  averageEntryCalculator,
  base64Encoder,
  timestampConverter,
  fakeWalletGenerator,
  fakePortfolioGenerator,
  randomDataGenerator,
  jsonGenerator,
  satoshiConverter,
  impermanentLossCalculator,
  fundingRateCalculator,
  ethUnitConverter,
  gasFeeCalculator,
  cryptoPriceConverter,
  leverageCalculator,
  futuresPnlCalculator,
  stopLossTakeProfitCalculator,
  marketCapPriceCalculator,
  stakingRewardsCalculator,
  compoundInterestCalculator,
  cryptoTaxCalculator,
  targetPriceCalculator,
  halvingCountdown,
  miningProfitabilityCalculator,
  portfolioRebalanceCalculator,
  dcaVsLumpSumCalculator,
  percentageCalculator,
  hexDecimalConverter,
  ruleOf72Calculator,
  cryptoAirdropCalculator,
  yieldFarmingApyCalculator,
  kellyCriterionCalculator,
  sharpeRatioCalculator,
  maxDrawdownCalculator,
  optionsPayoffCalculator,
  cryptoLoanLtvCalculator,
  blackScholesCalculator,
  monteCarloPortfolioCalculator,
  riskOfRuinCalculator,
  tradeExpectancyCalculator,
  portfolioVolatilityCalculator,
  sortinoRatioCalculator,
  valueAtRiskCalculator,
  cagrCalculator,
  lossRecoveryCalculator,
  cryptoArbitrageCalculator,
  tradingFeeCalculator,
  hashrateConverter,
  tokenVestingDilutionCalculator,
  cryptoSavingsGoalCalculator,
  marketCapCalculator,
  winRateCalculator,
  tokenomicsCalculator,
  dcaBotCalculator,
  taxLossHarvestingCalculator,
  takeProfitLadderCalculator,
  cryptoWithdrawalCalculator,
  marginCalculator,
  tokenBurnCalculator,
  cryptoLendingCalculator,
  cryptoMortgageCalculator,
];

// --- Assemble + validate the full registry ---------------------------------

function assemble(): ToolConfig[] {
  const all = [...builtinTools, ...generatedTools];
  const bySlug = new Map<string, ToolConfig>();
  for (const tool of all) {
    if (!isComputable(tool)) {
      // Skip broken tools rather than crash the whole build.
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[registry] Tool "${tool.slug}" has no compute/expression — skipped.`);
      }
      continue;
    }
    if (bySlug.has(tool.slug)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[registry] Duplicate slug "${tool.slug}" — keeping the first.`);
      }
      continue;
    }
    bySlug.set(tool.slug, { source: "builtin", ...tool });
  }
  return [...bySlug.values()];
}

export const tools: ToolConfig[] = assemble();

const toolIndex = new Map(tools.map((t) => [t.slug, t]));

// --- Query helpers ----------------------------------------------------------

export function getTool(slug: string): ToolConfig | undefined {
  return toolIndex.get(slug);
}

export function getAllSlugs(): string[] {
  return tools.map((t) => t.slug);
}

export function getToolsByCategory(category: CategoryId): ToolConfig[] {
  return tools.filter((t) => t.category === category);
}

export function getFeaturedTools(limit = 8): ToolConfig[] {
  return tools.filter((t) => t.featured).slice(0, limit);
}

export function getPopularTools(limit = 10): ToolConfig[] {
  const popular = tools.filter((t) => t.popular);
  return (popular.length ? popular : tools).slice(0, limit);
}

/**
 * Related tools for internal linking: explicit `relatedSlugs` first, then other
 * tools from the same category, capped at `limit`.
 */
export function getRelatedTools(tool: ToolConfig, limit = 6): ToolConfig[] {
  const seen = new Set<string>([tool.slug]);
  const out: ToolConfig[] = [];

  for (const slug of tool.relatedSlugs ?? []) {
    const t = getTool(slug);
    if (t && !seen.has(slug)) {
      out.push(t);
      seen.add(slug);
    }
  }
  for (const t of getToolsByCategory(tool.category)) {
    if (out.length >= limit) break;
    if (!seen.has(t.slug)) {
      out.push(t);
      seen.add(t.slug);
    }
  }
  return out.slice(0, limit);
}

export function countByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of tools) counts[t.category] = (counts[t.category] ?? 0) + 1;
  return counts;
}

/**
 * Categories that currently contain at least one tool. Empty categories are
 * hidden from navigation, the homepage grid, the sitemap and static generation
 * until a tool is added to them — so nothing renders an empty "coming soon"
 * page, and a category reappears automatically the moment it gets its first tool.
 */
export function getActiveCategories(): Category[] {
  const counts = countByCategory();
  return categoryList.filter((c) => (counts[c.id] ?? 0) > 0);
}

/** Lightweight search index item for the client search bar. */
export interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  keywords: string[];
}

export function getSearchIndex(): SearchItem[] {
  return tools.map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    category: t.category,
    keywords: t.seo.keywords,
  }));
}
