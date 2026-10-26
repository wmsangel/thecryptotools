import type { ToolConfig } from "../types";
import { fmtUsd, fmtNumber } from "@/lib/format";

const tool: ToolConfig = {
  slug: "nft-mint-cost-calculator",
  updatedAt: "2026-10-23",
  title: "NFT Mint Cost Calculator",
  description:
    "Estimate the full cost of minting NFTs from mint price, quantity, gas units and gas price — in ETH and USD.",
  category: "defi",
  featured: false,
  popular: false,
  source: "builtin",
  seo: {
    keywords: [
      "nft mint cost calculator",
      "nft minting fees",
      "how much to mint an nft",
      "nft gas fee calculator",
    ],
    description:
      "Free NFT mint cost calculator. Enter mint price, quantity, gas and ETH price to see total cost in ETH and USD.",
  },
  inputs: [
    { name: "mintPrice", label: "Mint price per NFT", type: "number", suffix: "ETH", default: 0.05, min: 0, step: 0.001 },
    { name: "quantity", label: "Quantity", type: "number", default: 1, min: 1, step: 1 },
    {
      name: "gasPrice",
      label: "Gas price",
      type: "number",
      suffix: "gwei",
      default: 20,
      min: 0,
      step: 1,
      help: "Set current network gwei — it changes with congestion.",
    },
    {
      name: "gasPerMint",
      label: "Gas units per mint",
      type: "number",
      default: 150000,
      min: 0,
      step: 1000,
      help: "From the mint contract estimate or a prior mint receipt.",
    },
    {
      name: "ethPrice",
      label: "ETH price",
      type: "number",
      suffix: "USD",
      default: 3000,
      min: 0,
      step: 1,
      help: "Editable spot price for the USD total — not a live feed.",
    },
  ],
  resultLabel: "Total mint cost",
  resultUnit: "USD",
  compute: (i) => {
    const mintPrice = Number(i.mintPrice) || 0;
    const quantity = Math.max(1, Number(i.quantity) || 1);
    const gasPrice = Number(i.gasPrice) || 0;
    const gasPerMint = Number(i.gasPerMint) || 0;
    const ethPrice = Number(i.ethPrice) || 0;

    const mintEth = mintPrice * quantity;
    const gasEth = (gasPrice * gasPerMint * quantity) / 1e9;
    const totalEth = mintEth + gasEth;
    const totalUsd = totalEth * ethPrice;

    return {
      value: fmtUsd(totalUsd),
      note: "Gas varies by network congestion; set the current gwei and ETH price. Not financial advice.",
      breakdown: [
        { label: "Total in ETH", value: `${fmtNumber(totalEth, 6)} ETH`, emphasis: true },
        { label: "Mint price portion", value: `${fmtNumber(mintEth, 6)} ETH` },
        { label: "Gas portion", value: `${fmtNumber(gasEth, 6)} ETH` },
      ],
    };
  },
  relatedSlugs: ["gas-fee-calculator", "eth-unit-converter", "trading-fee-calculator", "crypto-price-converter"],
  article: [
    {
      type: "p",
      text: "Minting an NFT costs the listed mint price plus gas. On Ethereum especially, gas can rival or exceed a cheap mint when the network is busy. This tool separates the mint and gas portions so you can see where the money goes.",
    },
    {
      type: "p",
      text: "Gas units depend on the contract; gas price (gwei) depends on the moment you mint. Defaults are starting points — replace them with the estimate from your wallet or a recent mint of the same collection.",
    },
    {
      type: "p",
      text: "The USD total uses the ETH price you enter. There is no live price feed here; update it before you decide whether a mint is worth the all-in cost.",
    },
  ],
  faq: [
    {
      q: "Why is minting more expensive than the listed price?",
      a: "The mint price is paid to the project; gas is paid to the network to run the mint transaction. Both count toward your total outlay.",
    },
    {
      q: "How do I find gas units per mint?",
      a: "Check the wallet simulation before confirming, or look at a completed mint of the same contract on a block explorer. Complex contracts use more gas than a simple ERC-721 mint.",
    },
    {
      q: "Does this work for other chains?",
      a: "The math is the same anywhere gas is priced in gwei-style units against a native token. Use that chain’s native price instead of ETH if you are minting elsewhere.",
    },
  ],
};

export default tool;
