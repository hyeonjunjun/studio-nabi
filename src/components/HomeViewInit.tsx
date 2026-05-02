/**
 * Inline blocking script that runs before paint and reads
 * localStorage('hkj.home.view'), then sets
 * document.documentElement.dataset.homeView so CSS can render the
 * correct composition (gallery vs list) without a hydration flash.
 *
 * Pairs with useHomeView. Mounted only on the home route — its
 * behavior is page-local, not app-global. Renders as a plain
 * <script> element with dangerouslySetInnerHTML; this is a server
 * component (no "use client" directive) so the script appears in the
 * SSR HTML output and runs before hydration.
 *
 * Pattern: theme-flash mitigation (same shape used widely for
 * dark-mode persistence). The script is tiny, synchronous, and runs
 * once before first paint.
 */
export default function HomeViewInit() {
  const code = `(function(){try{var v=localStorage.getItem('hkj.home.view');document.documentElement.dataset.homeView=(v==='list')?'list':'gallery';}catch(e){document.documentElement.dataset.homeView='gallery';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
