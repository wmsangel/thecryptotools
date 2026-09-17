import type { ToolConfig } from "../types";

/**
 * Fake wallet SIMULATOR. It produces realistic-LOOKING but entirely fake wallet
 * snapshots — an address plus a plausible balance, tx count and activity dates —
 * for mockups, demos, tutorials and test data. It deliberately never emits a
 * private key or seed phrase, and every result is labelled as simulated: the
 * addresses match the SHAPE of real ones (length/charset) but are not spendable
 * and hold nothing. See the `note` and `article` below — that framing is the
 * whole point of the tool and must stay.
 */

const HEX = "0123456789abcdef";
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
// Real bech32 (BTC segwit) data charset — NOT hex. Using it makes bc1 addresses
// read as genuine to anyone who knows the format.
const BECH32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

const pick = (set: string, n: number): string =>
  Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join("");

interface Net {
  name: string;
  sym: string;
  /** Illustrative, fixed sample price — NOT a market quote (tool is offline). */
  sample: number;
  min: number;
  max: number;
  decimals: number;
  address: () => string;
}

const NETWORKS: Record<string, Net> = {
  eth: { name: "Ethereum", sym: "ETH", sample: 3000, min: 0.05, max: 25, decimals: 6, address: () => "0x" + pick(HEX, 40) },
  btc: { name: "Bitcoin", sym: "BTC", sample: 60000, min: 0.005, max: 2.5, decimals: 6, address: () => "bc1q" + pick(BECH32, 38) },
  sol: { name: "Solana", sym: "SOL", sample: 150, min: 1, max: 400, decimals: 4, address: () => pick(BASE58, 44) },
  tron: { name: "Tron", sym: "TRX", sample: 0.12, min: 200, max: 50000, decimals: 0, address: () => "T" + pick(BASE58, 33) },
};

function fmtAmount(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: n >= 1000 ? 0 : n >= 1 ? 4 : 6 });
}
function fmtUsd(n: number): string {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
function daysAgoISO(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

const tool: ToolConfig = {
  slug: "fake-wallet-generator",
  updatedAt: "2026-09-17",
  title: "Fake Crypto Wallet Generator & Simulator",
  description:
    "Generate a realistic-looking but completely fake crypto wallet — address, sample balance and activity — for UI mockups, demos and test data. Simulated only: no private keys, never holds real funds.",
  category: "dev",
  source: "builtin",
  seo: {
    title: "Fake Crypto Wallet Generator & Simulator — Realistic Test Addresses",
    keywords: [
      "fake crypto wallet simulator",
      "fake wallet generator",
      "crypto wallet simulator",
      "fake wallet simulator",
      "fake bitcoin wallet",
      "fake ethereum wallet address",
      "test crypto address generator",
      "dummy wallet address",
      "mock crypto wallet",
      "sample wallet data",
    ],
    description:
      "Free fake crypto wallet simulator. Generate realistic ETH, BTC, Solana and Tron wallet snapshots — address, sample balance and transaction history — for mockups, screenshots and QA. Simulated data only, no private keys, never real funds.",
  },
  inputs: [
    {
      name: "chain",
      label: "Network",
      type: "select",
      default: "eth",
      options: [
        { label: "Ethereum (0x…)", value: "eth" },
        { label: "Bitcoin (bc1…)", value: "btc" },
        { label: "Solana", value: "sol" },
        { label: "Tron (T…)", value: "tron" },
      ],
    },
    { name: "count", label: "How many wallets", type: "number", default: 1, min: 1, max: 25, step: 1 },
  ],
  resultLabel: "Simulated wallet",
  compute: (i) => {
    const net = NETWORKS[String(i.chain)] ?? NETWORKS.eth;
    const count = Math.min(25, Math.max(1, Math.floor(Number(i.count) || 1)));

    const wallets = Array.from({ length: count }, () => {
      const balance = net.min + Math.random() * (net.max - net.min);
      const firstDays = Math.floor(200 + Math.random() * 2200); // ~7mo–6.5yr ago
      const lastDays = Math.floor(Math.random() * Math.min(firstDays, 150)); // more recent
      return {
        network: net.name,
        symbol: net.sym,
        address: net.address(),
        balance: Number(balance.toFixed(net.decimals)),
        valueUsdSample: Number((balance * net.sample).toFixed(2)),
        transactions: Math.floor(1 + Math.random() * 500),
        firstSeen: daysAgoISO(firstDays),
        lastActive: daysAgoISO(lastDays),
        simulated: true,
      };
    });

    const w = wallets[0];
    const breakdown = [
      { label: "Balance", value: `${fmtAmount(w.balance)} ${w.symbol}`, emphasis: true },
      { label: "Value (sample price)", value: `≈ ${fmtUsd(w.valueUsdSample)}` },
      { label: "Network", value: `${w.network} (${w.symbol})` },
      { label: "Transactions", value: w.transactions.toLocaleString("en-US") },
      { label: "First seen", value: w.firstSeen },
      { label: "Last active", value: w.lastActive },
    ];
    if (count > 1) {
      breakdown.push({ label: "Wallets generated", value: `${count} · full list in JSON below` });
    }

    return {
      value: w.address,
      label: `Simulated ${w.network} wallet — sample data, not a real account`,
      tone: "neutral" as const,
      breakdown,
      copyText: JSON.stringify(count === 1 ? w : wallets, null, 2),
      copyLabel: count === 1 ? "Copy wallet as JSON" : `Copy all ${count} wallets as JSON`,
      note:
        "Simulated sample data for testing, mockups and screenshots. These addresses only mimic the format of real ones — they have no private key or seed phrase and cannot hold or receive anything. Never send real crypto to a generated address; it would be lost forever. Balances and prices are illustrative, not market values. Change any input to roll a new wallet.",
    };
  },
  article: [
    { type: "h2", text: "What this wallet simulator does" },
    {
      type: "p",
      text: "It builds a realistic-looking but entirely fake wallet snapshot: an address in the real format of the network you pick, plus a plausible balance, a transaction count and first-seen / last-active dates. It is designed for the moments when you need something that looks like a wallet without touching a real one — a UI mockup, a product screenshot, a tutorial, a demo, or seed data for a test database.",
    },
    { type: "h2", text: "Why the data is fake — and why that matters" },
    {
      type: "p",
      text: "Every value here is generated at random in your browser and nothing is saved or sent anywhere. Crucially, the tool never produces a private key or a recovery phrase, so what it makes is not a wallet anyone can spend from — it is a picture of one. That is deliberate: a page that handed out real, spendable keys would be dangerous, and a realistic address with a real key displayed on screen is exactly how funds get stolen.",
    },
    { type: "h2", text: "The address formats it mimics" },
    {
      type: "ul",
      items: [
        "Ethereum — 0x followed by 40 hexadecimal characters (also used by most EVM chains).",
        "Bitcoin — native SegWit bc1… built from the real bech32 character set, so it reads as genuine.",
        "Solana — a 44-character base58 string, the same shape as a real Solana address.",
        "Tron — T followed by a base58 body, the format used for TRX and USDT-TRC20.",
      ],
    },
    {
      type: "p",
      text: "These match the length and character set of real addresses so they display convincingly in an interface, but they are not checksum-valid spendable accounts. Treat them as placeholder text, not as wallets.",
    },
    { type: "h2", text: "Good ways to use it" },
    {
      type: "ul",
      items: [
        "Fill a UI mockup or Figma-to-code screen with address-shaped data instead of lorem ipsum.",
        "Seed a test database, fixtures or Storybook stories — copy the JSON straight in.",
        "QA how your app truncates, copies and validates addresses across networks.",
        "Illustrate a tutorial, doc or screenshot without exposing a real wallet.",
      ],
    },
    { type: "h2", text: "What it will never do" },
    {
      type: "ul",
      items: [
        "Never generates a private key or seed phrase.",
        "Never produces a wallet you can actually send from or receive to.",
        "Never presents a balance as real money — the figures are illustrative.",
      ],
    },
    {
      type: "p",
      text: "If you want a real wallet, use a reputable self-custody wallet app, and back up your recovery phrase offline — never on a web page. This tool is for test data only.",
    },
  ],
  faq: [
    {
      q: "Are these real wallet addresses?",
      a: "No. They only mimic the format of real addresses — the right length and character set — so they look convincing in a UI. They have no private key and cannot receive or hold funds.",
    },
    {
      q: "Is it safe to send crypto to a generated address?",
      a: "Never. A generated address has no private key behind it, so any real crypto sent to it is permanently lost. These are placeholders for testing, not accounts.",
    },
    {
      q: "Does it generate a private key or seed phrase?",
      a: "No, and that is deliberate. The simulator only ever produces an address and fake metadata. Handing out real, spendable keys on a web page would be dangerous, so it does not.",
    },
    {
      q: "What networks does it support?",
      a: "Ethereum (and EVM-style 0x addresses), Bitcoin native SegWit (bc1…), Solana and Tron. Pick the network and it matches that format.",
    },
    {
      q: "Are the balances and transaction counts real?",
      a: "No. The balance, sample USD value, transaction count and activity dates are all randomly generated to look plausible for mockups and screenshots. They are not tied to any real account or live price.",
    },
    {
      q: "Can I generate several at once and export them?",
      a: "Yes. Set 'How many wallets' up to 25 and copy the full list as JSON — ready to drop into fixtures, a mock API or a test database.",
    },
    {
      q: "What are these fake wallets actually for?",
      a: "UI mockups, product screenshots, tutorials, demos and QA — anywhere you need address-shaped, wallet-shaped placeholder data without using a real wallet.",
    },
  ],
};

export default tool;
