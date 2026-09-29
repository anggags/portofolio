/**
 * Time-of-day theming.
 *
 * The whole page is painted from two CSS custom properties that are interpolated
 * against the visitor's local clock. A blocking script in <head> applies the
 * first frame before the stylesheet loads, so there is no light flash.
 *
 * The ramp below is original to this project: a warm neutral that runs from a
 * deep brown-black at night through a cream midday and back again.
 */

export type BgStop = { hour: number; bg: string };

export type TextKey = "night" | "golden" | "day";

/**
 * Background ramp — interpolated per RGB channel between neighbouring stops.
 *
 * A mid-tone background (relative luminance roughly 0.065 to 0.20) cannot reach
 * 4.5:1 against either the light or the dark text colour, so the dawn and dusk
 * crossings are deliberately compressed into a narrow window instead of being
 * spread across an hour. Outside those two short windows the whole page clears
 * WCAG AA.
 */
export const BG_STOPS: BgStop[] = [
  { hour: 0, bg: "#241F1A" },
  { hour: 4, bg: "#241F1A" },
  { hour: 5, bg: "#4A4038" },
  { hour: 5.4, bg: "#5E5449" },
  { hour: 6, bg: "#B0A48F" },
  { hour: 7, bg: "#D6CFC1" },
  { hour: 8, bg: "#EAE5DB" },
  { hour: 9, bg: "#F6F3EE" },
  { hour: 16, bg: "#F6F3EE" },
  { hour: 17, bg: "#DCD5C8" },
  { hour: 18, bg: "#AFA28D" },
  { hour: 18.6, bg: "#6E6558" },
  { hour: 19, bg: "#4A4237" },
  { hour: 20, bg: "#3A332A" },
  { hour: 21, bg: "#241F1A" },
  { hour: 24, bg: "#241F1A" },
];

/**
 * Text colour steps.
 *
 * The switch points sit at the background luminance where the light-on-dark and
 * dark-on-light contrast curves are balanced (relative luminance ~0.12), which
 * is the point that minimises the worst-case ratio for this palette.
 */
export const TEXT_STEPS: { hour: number; key: TextKey }[] = [
  { hour: 0, key: "night" },
  { hour: 4.8, key: "golden" },
  { hour: 5.46, key: "day" },
  { hour: 18.67, key: "night" },
];

export const TEXT_COLORS: Record<TextKey, { ui: string; sel: string }> = {
  night: { ui: "#BEB7A8", sel: "rgba(255,238,194,0.2)" },
  golden: { ui: "#E8B84B", sel: "rgba(68,48,0,0.2)" },
  day: { ui: "#14110E", sel: "rgba(68,48,0,0.2)" },
};

function parseColor(value: string): [number, number, number] {
  const hex = value.replace("#", "");
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function mix(from: string, to: string, progress: number): string {
  const a = parseColor(from);
  const b = parseColor(to);
  const channel = (i: number) => Math.round(a[i] + (b[i] - a[i]) * progress);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

export function getTextKey(hour: number): TextKey {
  let index = 0;
  while (index < TEXT_STEPS.length - 1 && TEXT_STEPS[index + 1].hour <= hour) index++;
  return TEXT_STEPS[index].key;
}

export function getBackground(hour: number): string {
  let index = 0;
  while (index < BG_STOPS.length - 1 && BG_STOPS[index + 1].hour <= hour) index++;

  const from = BG_STOPS[index];
  const to = BG_STOPS[Math.min(index + 1, BG_STOPS.length - 1)];
  const range = to.hour - from.hour;
  const progress = range > 0 ? (hour - from.hour) / range : 0;

  return mix(from.bg, to.bg, progress);
}

export type TimeTheme = {
  bg: string;
  main: string;
  selBg: string;
};

export function getTimeTheme(hour: number): TimeTheme {
  const text = TEXT_COLORS[getTextKey(hour)];
  return { bg: getBackground(hour), main: text.ui, selBg: text.sel };
}

/**
 * Self-contained script injected before paint. Kept as a string so the ramp
 * above stays the single source of truth — the stops are serialised in.
 */
export const TIME_THEME_SCRIPT = `(function(){
var S=${JSON.stringify(BG_STOPS)},T=${JSON.stringify(TEXT_STEPS)},C=${JSON.stringify(TEXT_COLORS)};
function h2r(h){var s=h.replace("#","");return[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)];}
function mix(a,b,p){var x=h2r(a),y=h2r(b);return"rgb("+Math.round(x[0]+(y[0]-x[0])*p)+","+Math.round(x[1]+(y[1]-x[1])*p)+","+Math.round(x[2]+(y[2]-x[2])*p)+")";}
function theme(h){var i=0;while(i<T.length-1&&T[i+1].hour<=h)i++;var c=C[T[i].key];
var j=0;while(j<S.length-1&&S[j+1].hour<=h)j++;var f=S[j],t=S[Math.min(j+1,S.length-1)];
var r=t.hour-f.hour,p=r>0?(h-f.hour)/r:0;return{bg:mix(f.bg,t.bg,p),main:c.ui,sel:c.sel};}
window.__applyTimeTheme=function(h){
var r=theme(h),s=document.documentElement.style;
s.setProperty("--bg",r.bg);s.setProperty("--fg",r.main);s.setProperty("--sel-bg",r.sel);
s.backgroundColor=r.bg;s.color=r.main;};
var now=new Date();window.__applyTimeTheme(now.getHours()+now.getMinutes()/60);
})();`;
