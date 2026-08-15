/**
 * ============================================================================
 * Donation addresses.
 * ============================================================================
 * Adding a chain = one object here plus a QR SVG in `public/donate/`.
 *
 * IMPORTANT when editing: an address typo sends money to nobody, permanently.
 * Every address here has had its base58/checksum verified before being added —
 * do the same for any new one rather than trusting a copy-paste.
 *
 * QR codes are generated at build time and committed as static SVGs, so the
 * page makes no external request. A QR fetched from a third-party image API
 * would be both a privacy leak and a place for an address to be swapped.
 */

export interface DonationAddress {
  id: string;
  /** Network name as an exchange withdrawal screen would label it. */
  network: string;
  /** Short chain tag shown as a badge, e.g. "TRC-20". */
  tag: string;
  address: string;
  /** Assets this address can actually receive. */
  accepts: string[];
  /** Path to the committed QR SVG. */
  qr: string;
  /** The mistake that loses funds on this chain. */
  warning: string;
}

export const donationAddresses: DonationAddress[] = [
  {
    id: "tron",
    network: "TRON",
    tag: "TRC-20",
    address: "TT5MBhRrX4Fioc2F78BiWG95K2esAHKSMo",
    accepts: ["USDT", "USDC", "TRX"],
    qr: "/donate/tron.svg",
    warning:
      "Send only on the TRON network (TRC-20). If you are withdrawing USDT from an exchange, pick TRON — choosing Ethereum (ERC-20) or BNB Smart Chain (BEP-20) for this address will lose the funds, and nobody can reverse it.",
  },
];
