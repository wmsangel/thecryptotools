import Link from "next/link";
import { site } from "@/lib/site";
import { getActiveCategories } from "@/lib/tools/registry";
import { Logo } from "@/components/Logo";
import { getStaticPage, legalSlugs } from "@/lib/pages/registry";
import { CookieSettingsButton } from "@/components/CookieConsent";

export function Footer() {
  const categoryList = getActiveCategories();
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-content px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <Logo className="h-6 w-6" /> {site.name}
            </div>
            <p className="muted mt-2 text-sm">{site.tagline}</p>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">Categories</h2>
            <ul className="space-y-1 text-sm">
              {categoryList.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.id}`} className="muted hover:text-brand-ink">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">More</h2>
            <ul className="space-y-1 text-sm">
              {categoryList.slice(5).map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.id}`} className="muted hover:text-brand-ink">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">Site</h2>
            <ul className="space-y-1 text-sm">
              <li><Link href="/tools" className="muted hover:text-brand-ink">All tools</Link></li>
              <li><Link href="/coins" className="muted hover:text-brand-ink">Calculators by coin</Link></li>
              <li><Link href="/prices" className="muted hover:text-brand-ink">Live prices</Link></li>
              <li><Link href="/exchanges" className="muted hover:text-brand-ink">Crypto platforms</Link></li>
              <li><Link href="/compare" className="muted hover:text-brand-ink">Platform comparisons</Link></li>
              <li><Link href="/widgets" className="muted hover:text-brand-ink">Embeddable widgets</Link></li>
              <li><Link href="/crypto-tax-report" className="muted hover:text-brand-ink">Crypto tax report</Link></li>
              <li><Link href="/tax-loss-harvesting" className="muted hover:text-brand-ink">Tax loss harvesting</Link></li>
              <li><Link href="/cost-basis-method-calculator" className="muted hover:text-brand-ink">Cost basis method (FIFO/LIFO/HIFO)</Link></li>
              <li><Link href="/portfolio" className="muted hover:text-brand-ink">Portfolio analyzer</Link></li>
              <li><Link href="/portfolio/correlation" className="muted hover:text-brand-ink">Correlation matrix</Link></li>
              <li><Link href="/investment-calculator" className="muted hover:text-brand-ink">Investment calculator</Link></li>
              <li><Link href="/unlocks" className="muted hover:text-brand-ink">Token unlock calendar</Link></li>
              <li><Link href="/calendar" className="muted hover:text-brand-ink">Crypto calendar</Link></li>
              <li><Link href="/guides" className="muted hover:text-brand-ink">Guides</Link></li>
              <li><Link href="/research" className="muted hover:text-brand-ink">Research</Link></li>
              <li><Link href="/about" className="muted hover:text-brand-ink">About</Link></li>
              <li><Link href="/contact" className="muted hover:text-brand-ink">Contact</Link></li>
              <li><Link href="/donate" className="muted hover:text-brand-ink">Support us</Link></li>
              <li><Link href="/sitemap.xml" className="muted hover:text-brand-ink">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">Legal</h2>
            <ul className="space-y-1 text-sm">
              {legalSlugs.map((slug) => {
                const page = getStaticPage(slug);
                return page ? (
                  <li key={slug}>
                    <Link href={`/${slug}`} className="muted hover:text-brand-ink">
                      {page.title}
                    </Link>
                  </li>
                ) : null;
              })}
              <li><CookieSettingsButton /></li>
            </ul>
          </div>
        </div>

        <div className="muted mt-8 space-y-2 border-t border-[var(--border)] pt-6 text-xs">
          <p>
            © {`${new Date().getFullYear()} `}{site.name}. Free crypto tools for education only — not financial advice.
          </p>
          <p>
            Some links to exchanges and wallets are affiliate links: we may earn a commission at
            no extra cost to you.{" "}
            <Link href="/affiliate-disclosure" className="hover:text-brand-ink underline">
              Full disclosure
            </Link>
            . Crypto trading carries a high risk of loss —{" "}
            <Link href="/disclaimer" className="hover:text-brand-ink underline">
              read the risk disclaimer
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
