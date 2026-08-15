import type { StaticPage } from "./types";

// Adding a page = create a content file + add ONE import line here + a thin
// route file under src/app/<slug>/page.tsx.
import { privacy } from "./content/privacy";
import { cookies } from "./content/cookies";
import { terms } from "./content/terms";
import { disclaimer } from "./content/disclaimer";
import { affiliateDisclosure } from "./content/affiliate-disclosure";
import { about } from "./content/about";
import { contact } from "./content/contact";
import { editorialPolicy } from "./content/editorial-policy";

export const staticPages: StaticPage[] = [
  about,
  contact,
  editorialPolicy,
  privacy,
  cookies,
  terms,
  disclaimer,
  affiliateDisclosure,
];

const bySlug = new Map(staticPages.map((p) => [p.slug, p]));

export function getStaticPage(slug: string): StaticPage | undefined {
  return bySlug.get(slug);
}

/** Pages linked from the footer's "Legal" column, in display order. */
export const legalSlugs = [
  "privacy",
  "cookies",
  "terms",
  "disclaimer",
  "affiliate-disclosure",
] as const;
