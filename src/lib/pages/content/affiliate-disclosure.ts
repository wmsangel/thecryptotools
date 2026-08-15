import type { StaticPage } from "../types";
import { site } from "@/lib/site";

export const affiliateDisclosure: StaticPage = {
  slug: "affiliate-disclosure",
  title: "Affiliate Disclosure",
  description:
    "How TheCryptoTools makes money, and what that means for the recommendations you read here.",
  eyebrow: "Legal",
  updatedAt: "2026-07-19",
  seo: {
    title: "Affiliate Disclosure",
    description:
      "TheCryptoTools earns commissions from some exchange and wallet referral links. Full disclosure of how it works and what it costs you (nothing).",
    keywords: ["affiliate disclosure", "referral links", "ftc disclosure", "crypto affiliate"],
  },
  body: [
    {
      type: "callout",
      text: "Some links on this site are affiliate links. If you sign up through one, we may earn a commission — at no extra cost to you, and often with a signup bonus for you.",
    },

    { type: "h2", text: "How it works" },
    {
      type: "p",
      text: `${site.name} is free to use and has no paywall. It is funded by advertising and by referral commissions from exchanges, hardware-wallet makers and crypto tax software. When you click one of those links, the partner records that you came from us and pays a share of their fee revenue if you register and trade.`,
    },
    {
      type: "p",
      text: "You never pay more for using our link. In most cases the opposite is true: the referral link carries a fee discount or deposit bonus that the plain homepage does not.",
    },

    { type: "h2", text: "How we keep it honest" },
    {
      type: "ul",
      items: [
        "Every affiliate link is marked with rel=\"sponsored nofollow\" and the platforms page carries a visible disclosure.",
        "The calculators themselves are neutral — no result nudges you toward a partner.",
        "We list well-known platforms because they are well known, not because a program pays more. Ranking is not for sale.",
        "Bonus amounts quoted are the terms offered at the time of writing; the partner can change them without telling us, so always confirm on their site.",
      ],
    },

    { type: "h2", text: "What we are not doing" },
    {
      type: "p",
      text: "We do not receive payment to write a positive guide, we do not accept sponsored content disguised as education, and we do not sell your data to anyone. Listing a platform is not an endorsement of its safety — see the risk disclaimer.",
    },

    { type: "h2", text: "Regulatory basis" },
    {
      type: "p",
      text: "This disclosure is made in line with the US FTC's endorsement guidelines (16 CFR Part 255) and equivalent advertising rules elsewhere, which require any material connection between a publisher and a product to be stated clearly.",
    },
    {
      type: "p",
      text: `Questions about a specific partnership? Ask us at ${site.contactEmail}.`,
    },
  ],
};
