/**
 * Cloudflare Pages middleware: force the production host.
 *
 * The Pages project is reachable on its *.pages.dev subdomains (the project
 * alias and every preview deploy) as well as the real domain. Those mirrors
 * served a full copy of the site — duplicate content for search engines, and
 * analytics/ads firing on a host they shouldn't. This redirects any request
 * whose host isn't the production domain to that domain with a 301, preserving
 * the path and query, so the mirrors resolve to canonical and run nothing.
 *
 * On the production host it does nothing and the request passes straight
 * through. Compiled automatically because wrangler.toml sets
 * pages_build_output_dir, which makes Pages pick up this functions/ directory.
 */
const PROD_HOST = "thecryptotools.com";

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  if (url.hostname === PROD_HOST) return next();
  url.protocol = "https:";
  url.hostname = PROD_HOST;
  url.port = "";
  return Response.redirect(url.toString(), 301);
}
