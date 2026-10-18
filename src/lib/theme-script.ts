/**
 * Runs before first paint so the saved design version and palette never flash, and flags a fresh
 * browser-session entry so the opening splash shows once (not on internal navigation or reloads).
 * Keep in sync with THEME_KEY (theme.ts) and DESIGN_KEY (design.ts).
 */
export const themeScript = `try{var d=document.documentElement;if(JSON.parse(localStorage.getItem("native:theme"))==="forest")d.dataset.theme="forest";if(JSON.parse(localStorage.getItem("native:design"))==="b")d.dataset.design="b";if(!sessionStorage.getItem("native:entered")){sessionStorage.setItem("native:entered","1");d.dataset.splash="1"}}catch(e){}`;
