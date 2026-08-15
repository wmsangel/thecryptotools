import type { Coin } from "./types";

/**
 * ============================================================================
 * Per-coin questions for the /coins/<slug>/ hub.
 * ============================================================================
 * The last page family on the site without FAQ schema.
 *
 * ⚠️ THE CONSTRAINT THAT SHAPES THIS FILE: `/coins/bitcoin/` and
 * `/investment-calculator/bitcoin/` are both pages about Bitcoin. Putting the
 * same questions on both would manufacture a near-duplicate pair out of our own
 * pages — the exact problem this whole sweep exists to fix, self-inflicted.
 *
 * So the two are split along a clean axis and must stay split:
 *   • investment-calculator FAQ → PRICE. Hold multiple, deepest fall, recovery
 *     time, best and worst years, whether the record is long enough to trust.
 *   • this file → PROTOCOL. Supply and issuance, staking mechanics, which
 *     calculator answers which question.
 * If you add a question here, check it is not a price question first.
 *
 * Everything is derived from the coin registry, whose supply figures are always
 * rendered with their `supplyAsOf` date because they were read on a day and are
 * not live.
 */

const num = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/** "1.2 billion", "21 million" — readable at a glance for large supplies. */
function big(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toLocaleString("en-US", { maximumFractionDigits: 2 })} trillion`;
  if (n >= 1e9) return `${(n / 1e9).toLocaleString("en-US", { maximumFractionDigits: 2 })} billion`;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString("en-US", { maximumFractionDigits: 2 })} million`;
  return num(n);
}

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

export function coinHubFaq(coin: Coin, toolCount: number): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const { symbol, name, circulatingSupply: circ, totalSupply: total, supplyAsOf } = coin;

  // --- Supply: the answer changes shape depending on whether there is a cap ---
  if (circ && supplyAsOf) {
    if (total && total > 0) {
      const issued = (circ / total) * 100;
      const left = total - circ;
      out.push({
        q: `How many ${symbol} are there?`,
        a:
          `${big(circ)} ${symbol} were in circulation as of ${longDate(supplyAsOf)}, against a maximum of ${big(total)} — so ${issued.toFixed(1)}% of everything that will ever exist has already been issued, leaving ${big(left)} still to come. ` +
          (issued >= 95
            ? `At that point issuance is close to finished, so future supply growth is not a meaningful factor in the price.`
            : issued >= 70
              ? `The remaining ${(100 - issued).toFixed(1)}% still has to reach the market at some point, which is a slow headwind rather than an event.`
              : `That is a large share still to arrive, and it is worth knowing on what schedule before treating the current price as the settled one.`),
      });
    } else {
      out.push({
        q: `Does ${symbol} have a maximum supply?`,
        a: `No fixed cap is published for ${name}, which is why no maximum is shown on this page — we leave the figure out rather than invent a denominator. Circulating supply was ${big(circ)} ${symbol} as of ${longDate(supplyAsOf)}. Without a cap, the number that matters is the net issuance rate: new supply minus anything burned, as a percentage per year.`,
      });
    }
  }

  // --- Staking: present, or deliberately absent ---
  if (coin.staking) {
    const s = coin.staking;
    out.push({
      q: `Can I stake ${symbol}, and what does it pay?`,
      a: `Yes. ${s.how} Rewards run at ${s.range}, and the calculator on this page is prefilled with ${s.defaultApr}% so you can change it to whatever your validator or platform actually quotes. ${s.lockup} ${s.native ? `Staking is native to the protocol here, so you are not relying on a third party's wrapper.` : `Note this is not native protocol staking, so the yield comes with a counterparty rather than only from the network.`}`,
    });
  } else {
    // The 30 coins without a staking block are NOT all the same case, and an
    // early version of this answer got it wrong by treating them as one. They
    // split three ways: networks with no staking at all (Bitcoin, Monero and
    // the other mined coins), governance tokens that can be delegated for votes
    // but earn nothing (UNI, ARB, OP), and networks that do pay but in a
    // different asset (Stacks pays in BTC, Lido's yield is on stETH not LDO).
    // Asserting the reward-denomination reason for Bitcoin is simply false.
    //
    // So lead with the coin's OWN staking fact from the registry, which is
    // hand-written and correct for each, then give the one sentence that is
    // true in every case: our calculator only covers same-asset rewards.
    const fact = coin.facts.find(
      (f) => /staking|staked asset/i.test(f.label) || /\bstak/i.test(f.value),
    );
    out.push({
      q: `Can I stake ${symbol}?`,
      a:
        (fact ? `${fact.value.replace(/\.$/, "")}. ` : `${name} has no holder staking that this site tracks. `) +
        `That is why there is no ${symbol} staking calculator here: the tool reports rewards in units of the coin you staked, so it only covers networks that pay in that same asset. Publishing a page where the dollar figure was right and the unit was wrong would be worse than leaving it out.`,
    });
  }

  // --- Which tool answers what ---
  out.push({
    q: `Which ${symbol} calculator should I use?`,
    a: `There are ${toolCount} on this page and they answer different questions. Start from what you are actually asking: what a past purchase would be worth now, what a position is worth today, where a leveraged position gets liquidated, or what regular buying would have produced. Each opens with the live ${symbol} price already filled in, and every calculation runs in your browser — nothing is sent anywhere and nothing is stored.`,
  });

  // Deliberately NOT a "what should I know before trading" question built from
  // volatilityNote + feeNote: the About section on this same page already prints
  // both verbatim, so it would be on-page padding rather than new information.
  // This one is genuinely elsewhere — five coins in the registry carry no
  // Binance pair at all, so the answer really does differ.
  out.push({
    q: `Where does the ${symbol} price on this page come from?`,
    a:
      `Live from CoinGecko when you press the price button` +
      (coin.binance
        ? `, with the ${coin.binance} pair on Binance as a fallback if that request fails.`
        : `. There is no Binance fallback for ${symbol} — it has no pair there, so the page asks CoinGecko only rather than requesting a pair that does not exist.`) +
      ` The request happens in your browser and carries nothing about you; if both fail the calculator keeps working with whatever figure you type in.`,
  });

  return out;
}
