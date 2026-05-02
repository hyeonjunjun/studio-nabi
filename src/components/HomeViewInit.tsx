/**
 * Inline blocking script rendered ahead of <main> on the home route.
 * Reads localStorage('hkj.home.view') and sets
 * document.documentElement.dataset.homeView synchronously, before
 * the gated home sections (.home__gallery / .home__list) parse — so
 * CSS visibility resolves correctly on first paint, no flash.
 *
 * Pairs with useHomeView. Mounted only on the home route — its
 * behavior is page-local, not app-global. Renders as a plain
 * <script> element with dangerouslySetInnerHTML; this is a server
 * component (no "use client" directive) so the script appears in
 * the SSR HTML output and runs before client hydration. Next.js
 * places the rendered script inside <body>, not <head> — that's
 * fine, since the only requirement is "before the gated elements
 * parse," not "in head."
 *
 * Pattern: theme-flash mitigation. The script is tiny, synchronous,
 * and runs once before first paint.
 */
export default function HomeViewInit() {
  const code = `(function(){try{var v=localStorage.getItem('hkj.home.view');document.documentElement.dataset.homeView=(v==='list')?'list':'gallery';}catch(e){document.documentElement.dataset.homeView='gallery';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
