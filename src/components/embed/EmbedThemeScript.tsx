/**
 * Theme resolution for embedded widgets, applied before first paint.
 *
 * Differs from the site's ThemeScript in what it trusts, and the order matters:
 *
 *  1. `?theme=light` / `?theme=dark` on the iframe URL — the embedding site
 *     telling us what its page looks like. This wins, because the widget has to
 *     match the page around it, and a dark calculator dropped into a white blog
 *     post looks broken no matter what the reader's own preference is.
 *  2. The reader's system preference, when the embedder said nothing.
 *
 * Deliberately does NOT read localStorage. That store belongs to our own site's
 * theme toggle; letting it decide here would mean a visitor who once picked
 * dark mode on thecryptotools.com sees a dark widget on every unrelated site
 * they visit afterwards — a setting leaking somewhere it was never meant to go.
 */
export function EmbedThemeScript() {
  const code =
    `(function(){try{` +
    `var p=new URLSearchParams(location.search).get('theme');` +
    `var d=p==='dark'||(p!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);` +
    `if(d)document.documentElement.classList.add('dark');` +
    `}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
