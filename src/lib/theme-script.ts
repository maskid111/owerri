/**
 * Runs before first paint so the saved design version and palette never flash, and decides whether
 * the white opening splash plays: on every full load / refresh of the homepage, and on the first
 * entry of a browser session for any other page. Client-side navigation never runs this, so the
 * splash never replays when moving between pages.
 * Keep in sync with THEME_KEY (theme.ts) and DESIGN_KEY (design.ts).
 */
export const themeScript = `try{var d=document.documentElement;if(JSON.parse(localStorage.getItem("native:theme"))==="forest")d.dataset.theme="forest";if(JSON.parse(localStorage.getItem("native:design"))==="b")d.dataset.design="b";var first=!sessionStorage.getItem("native:entered");sessionStorage.setItem("native:entered","1");if(location.pathname==="/"||first)d.dataset.splash="1"}catch(e){}`;
