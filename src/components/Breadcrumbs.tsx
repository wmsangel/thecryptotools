import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

/**
 * One breadcrumb trail rendered two ways at once: the visible <nav><ol> that
 * Google and assistive tech expect, and the matching BreadcrumbList JSON-LD.
 * Keeping them in one component means the two can never drift apart.
 *
 * Pass the trail WITHOUT Home (added here) and WITHOUT the current page's own
 * item URL being anything special — the last crumb is rendered as the current
 * page (aria-current), not a link.
 *
 * @param trail e.g. [{ name: "Guides", path: "/guides" }, { name: guide.title, path: `/guides/${slug}` }]
 */
export function Breadcrumbs({
  trail,
  className = "mb-5",
}: {
  trail: { name: string; path: string }[];
  className?: string;
}) {
  const full = [{ name: "Home", path: "/" }, ...trail];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav className={className} aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm muted">
          {full.map((crumb, i) => {
            const isLast = i === full.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-[var(--text)] line-clamp-1" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.path} className="hover:text-brand-ink">
                    {crumb.name}
                  </Link>
                )}
                {!isLast && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
