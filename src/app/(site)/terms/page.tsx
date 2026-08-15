import type { Metadata } from "next";
import { StaticPageView, buildStaticPageMetadata } from "@/components/StaticPageView";

const SLUG = "terms";

export const metadata: Metadata = buildStaticPageMetadata(SLUG);

export default function Page() {
  return <StaticPageView slug={SLUG} />;
}
