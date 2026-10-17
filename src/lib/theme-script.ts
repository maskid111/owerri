/**
 * Runs before first paint so the saved design version and palette never flash.
 * Keep in sync with THEME_KEY (theme.ts) and DESIGN_KEY (design.ts).
 */
export const themeScript = `try{var d=document.documentElement;if(JSON.parse(localStorage.getItem("native:theme"))==="forest")d.dataset.theme="forest";if(JSON.parse(localStorage.getItem("native:design"))==="b")d.dataset.design="b"}catch(e){}`;
