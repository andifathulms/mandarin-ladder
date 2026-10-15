import { STORAGE_KEY } from '@/lib/progress/constants';

/** --paper of each theme, for the browser chrome (theme-color follows the in-app theme, DESIGN §3.3). */
export const THEME_COLOR = { light: '#F6F2E9', dark: '#170F0E' } as const;

// Runs before first paint so theme, text sizes and motion never flash.
// Bright (light) is the default; "system" follows the OS only when the learner picked it.
export const themeScript = `(function(){var d=document.documentElement,t='light';try{
var o=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}'),s=o.settings||{};
if(s.theme==='dark'||s.theme==='system')t=s.theme;
if(s.textSize===115||s.textSize===130)d.setAttribute('data-text-size',String(s.textSize));
if(s.zhSize===120||s.zhSize===140)d.setAttribute('data-zh-size',String(s.zhSize));
if(s.motion==='reduce')d.setAttribute('data-motion','reduce');
if(s.uiLang==='en')d.setAttribute('lang','en');
}catch(e){}if(t!=='system')d.setAttribute('data-theme',t);
var k=t==='system'?(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t,
m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',k==='dark'?'${THEME_COLOR.dark}':'${THEME_COLOR.light}');})();`;
