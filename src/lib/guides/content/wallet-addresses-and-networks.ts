import type { Guide } from "../types";

const guide: Guide = {
  slug: "wallet-addresses-and-networks",
  title: "Wallet Addresses and Networks: How Crypto Gets Lost in Transit",
  description:
    "Same address, different chain. Token sent to a contract. Bitcoin format mismatch. Almost every permanently lost transfer comes from misunderstanding what an address actually identifies.",
  readingMinutes: 8,
  updatedAt: "2026-07-30",
  seo: {
    keywords: [
      "crypto wallet address explained",
      "wrong network crypto sent",
      "erc20 vs trc20 vs bep20",
      "bitcoin address formats",
      "same address different chain",
      "crypto address checksum",
    ],
    description:
      "How crypto addresses and networks really work: Bitcoin address formats, why one Ethereum address exists on every EVM chain, ERC-20 vs TRC-20 vs BEP-20, memos, contract addresses, and which mistakes are recoverable.",
  },
  relatedTools: ["gas-fee-calculator", "eth-unit-converter", "satoshi-converter"],
  body: [
    { type: "p", text: "An address is not an account somewhere. It is a short public identifier derived from a key you hold, and it only means anything within a specific network's ledger. Two things follow from that, and between them they explain nearly every irreversible loss that is not outright theft: the same string of characters can be perfectly valid on several chains at once, and a chain has no idea what you meant to do — only what you signed." },

    { type: "h2", text: "Bitcoin: several formats, one wallet" },
    { type: "p", text: "Bitcoin addresses come in generations, and a modern wallet holds all of them from the same seed." },
    { type: "ul", items: [
      "Legacy addresses start with 1. The original format — universally accepted, more expensive to spend from.",
      "P2SH addresses start with 3. Used for wrapped SegWit and for multisig.",
      "Native SegWit (bech32) starts with bc1q. Cheaper fees, all-lowercase, with strong error detection built in.",
      "Taproot starts with bc1p. The newest format, better for privacy and complex spending conditions.",
    ] },
    { type: "p", text: "Any of them can receive coins; the differences are fee efficiency and compatibility. The genuine friction is on the sending side: some older exchanges and services still cannot send to bech32 or Taproot addresses. If a withdrawal form rejects your address, that is usually why, and the fix is to generate a legacy or P2SH receiving address from the same wallet rather than to switch wallets. Testnet addresses (starting tb1 or m/n) belong to a separate practice network and are worthless — check you did not copy one from a tutorial." },

    { type: "h2", text: "Ethereum: one address, every EVM chain" },
    { type: "p", text: "An Ethereum address — the 42-character string beginning 0x — is derived from your key alone, with no reference to any particular network. That is why the identical address exists on Ethereum mainnet, Arbitrum, Base, Polygon, BNB Smart Chain and every other EVM-compatible chain simultaneously. You control all of them with the same key." },
    { type: "p", text: "This is a genuine convenience and the source of endless confusion. Sending tokens 'to your address' on the wrong chain does not lose them: the funds are sitting at your address on that other network, and adding the network in your wallet usually reveals them immediately. What you then need is a small amount of that chain's native gas token before you can move them — which is why the recovery ends up costing a bridging transaction and some patience rather than the balance itself." },
    { type: "p", text: "Ethereum addresses also carry an optional checksum expressed through capitalisation (EIP-55). A wallet that validates it will reject a single mistyped character. Pasting a lowercase-only address bypasses that check, so paste the mixed-case version when you have it." },
    { type: "callout", text: "The rule that matters: if you control the private key for the destination, a wrong-chain send is usually a nuisance. If somebody else controls it — an exchange deposit address, a custodial service — it may be gone." },

    { type: "h2", text: "The same token on different chains" },
    { type: "p", text: "USDT on Ethereum, USDT on Tron and USDT on Solana are three separate tokens with the same name and price. Each is issued on its own ledger; none of them can move to another chain by being sent there. Bridging between them is a real operation involving a bridge contract or a custodian, not a matter of picking a different dropdown." },
    { type: "ul", items: [
      "ERC-20 means the token follows Ethereum's token standard on an EVM chain — the fee is paid in that chain's native coin.",
      "TRC-20 is the Tron equivalent, generally the cheapest route for stablecoin transfers, which is why so much USDT settles there.",
      "BEP-20 is the BNB Smart Chain equivalent.",
      "Address formats differ visibly between families: Tron addresses start with T, Solana addresses are base58 with no prefix, EVM addresses start with 0x. A wallet will usually refuse an obviously foreign format — the dangerous cases are the ones that look valid.",
    ] },
    { type: "tool", slug: "gas-fee-calculator" },

    { type: "h2", text: "Memos, tags and shared addresses" },
    { type: "p", text: "XRP, Stellar, Cosmos and several others let a service pool all customer deposits at one address and separate them with an extra field — a destination tag or memo. Send without it and your coins arrive at an address the service controls but cannot attribute to you. Nothing is technically lost; it is simply indistinguishable from everyone else's money until a human intervenes. Expect a support ticket, proof of the transaction, and a wait. Sending to your own non-custodial wallet, the field is normally unnecessary." },

    { type: "h2", text: "Addresses that are not wallets" },
    { type: "p", text: "Two destinations swallow funds routinely, and both look like ordinary addresses." },
    { type: "ul", items: [
      "Token contract addresses. Every token has one, and it appears constantly — in explorers, in 'add this token' instructions. Send tokens to their own contract and they are almost always unrecoverable, because the contract has no code to give them back.",
      "Contracts that cannot receive plain transfers. Sending the native coin to a contract that was never written to accept it can burn it. This is rare in normal use and common when people paste an address from documentation.",
      "The burn address (all zeros) does exactly what its name says, permanently.",
    ] },
    { type: "p", text: "Human-readable names such as ENS sidestep typos but introduce their own care: confirm the resolved 0x address before signing, and be alert to lookalike names using different Unicode characters. A name that expires and is re-registered by somebody else will happily route your next payment to them." },

    { type: "h2", text: "Address poisoning" },
    { type: "p", text: "A specific and now very common attack: someone sends you a zero-value or dust transaction from an address engineered to share the first and last characters of one you use regularly. It lands in your transaction history. Next time you copy 'the address I used last time' from that history, you copy theirs. The defence is simple and absolute — never source an address from your own transaction history. Use a saved address book entry, or fetch it fresh from the recipient." },

    { type: "h2", text: "A checklist that prevents nearly all of it" },
    { type: "ul", items: [
      "Match the network on both ends before anything else — sender's dropdown and receiving wallet.",
      "Paste, never type. Then verify the first four, last four and a middle chunk.",
      "On a hardware wallet, read the address on the device screen, not the computer's.",
      "Include the memo or destination tag when the recipient asks for one.",
      "Hold a little native gas token on any chain where you hold tokens.",
      "Send a small test first and wait for it to appear as spendable.",
    ] },
  ],
  faq: [
    { q: "Can I send Bitcoin to an Ethereum address?", a: "No, and the wallet will stop you — the formats are incompatible and validation rejects them. This particular mistake is one of the few the software reliably catches for you." },
    { q: "I sent tokens to the right address but the wrong chain. Can I get them back?", a: "If the address is your own wallet, almost certainly yes: add that network in your wallet, acquire a small amount of its gas token, and move them. If it was an exchange deposit address, open a support ticket immediately — some will recover it for a fee, many will not." },
    { q: "Why does my balance show on the explorer but not in my wallet?", a: "Usually the wallet is watching a different network, or the token has not been added to its list. Switch networks and use 'import token' with the contract address. If the explorer shows it, the funds exist and you control them." },
    { q: "Is it safe to reuse the same receiving address?", a: "It is safe in the sense that funds arrive correctly. It is worse for privacy, because everyone who has ever paid you can see the whole balance and history at that address. Bitcoin wallets generate a fresh address per receipt for this reason; on EVM chains reuse is the norm." },
    { q: "What is dust in my wallet that I did not ask for?", a: "Usually address poisoning or a spam token airdrop. Ignore it. Do not interact with unknown tokens, and never visit a site advertised inside a token name — 'claiming' them is how the actual theft happens." },
    { q: "Do I need gas on every chain I use?", a: "Yes. Each network charges fees in its own native coin — ETH on Ethereum, BNB on BNB Chain, TRX on Tron, SOL on Solana. Holding a token on a chain where you have no native coin means you cannot move it until you send some in." },
  ],
};

export default guide;
