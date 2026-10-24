export const THEME_STORAGE_KEY = "oliyrank-theme";

/** Runs before paint so the page never flashes the wrong theme. */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var t=s==='light'||s==='dark'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}})();`;
